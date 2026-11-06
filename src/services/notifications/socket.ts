"use client";

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
): Promise<() => void> {
  const ticket = await fetchNotificationSocketTicket();
  if (!ticket) return () => undefined;

  const socket = new Socket(socketUrl, { params: { ticket } });
  socket.connect();
  const channel = socket.channel(`notifications:${userId}`, {});
  channel.on("health_check_changed", onHealthCheckChanged);
  if (onStatusChanged) channel.on("status_changed", onStatusChanged);
  channel.join();

  return () => {
    channel.leave();
    socket.disconnect();
  };
}
