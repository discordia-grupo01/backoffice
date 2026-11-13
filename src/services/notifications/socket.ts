"use client";

import {
  CHANGE_SOCKET_EVENTS,
  isResourceChangedPayload,
  type ResourceChangedPayload,
} from "@discordia/client-shared";

import { Socket } from "phoenix";

import { fetchNotificationSocketTicket } from "./client";

const socketUrl =
  process.env.NEXT_PUBLIC_NOTIFICATIONS_WS_URL ??
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
    /^http/,
    "ws",
  ) + "/notifications/socket";

export interface HealthCheckChangedPayload {
  service: string;
  previous_status: string;
  status: string;
  consecutive_failures: number;
}

export async function connectHealthNotifications(
  userId: string,
  onHealthCheckChanged: (payload: HealthCheckChangedPayload) => void,
  onStatusChanged?: () => void,
  onChanged?: (payload: ResourceChangedPayload) => void,
  onRejoined?: () => void,
): Promise<() => void> {
  let joins = 0;
  let stopped = false;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let socket: Socket | undefined;
  let channel: ReturnType<Socket["channel"]> | undefined;

  const scheduleRetry = () => {
    if (stopped || retryTimer) return;
    retryTimer = setTimeout(() => {
      retryTimer = undefined;
      void connect();
    }, 1_000);
  };

  const connect = async (): Promise<void> => {
    if (stopped) return;

    const ticket = await fetchNotificationSocketTicket();
    if (stopped) return;
    if (!ticket) {
      scheduleRetry();
      return;
    }

    const nextSocket = new Socket(socketUrl, {
      params: { ticket },
      reconnectAfterMs: () => 60_000,
    });
    const nextChannel = nextSocket.channel(`notifications:${userId}`, {});
    socket = nextSocket;
    channel = nextChannel;

    const reconnect = () => {
      if (stopped || socket !== nextSocket) return;
      nextSocket.disconnect();
      socket = undefined;
      channel = undefined;
      scheduleRetry();
    };

    nextSocket.onClose(reconnect);
    nextChannel.on("health_check_changed", onHealthCheckChanged);
    if (onStatusChanged) nextChannel.on("status_changed", onStatusChanged);
    if (onChanged) {
      nextChannel.on(CHANGE_SOCKET_EVENTS.changed, (payload: unknown) => {
        if (isResourceChangedPayload(payload)) onChanged(payload);
      });
    }
    nextChannel
      .join()
      .receive("ok", () => {
        joins += 1;
        if (joins > 1) onRejoined?.();
      })
      .receive("error", reconnect);
    nextSocket.connect();
  };

  void connect();

  return () => {
    stopped = true;
    if (retryTimer) clearTimeout(retryTimer);
    channel?.leave();
    socket?.disconnect();
    channel = undefined;
    socket = undefined;
  };
}
