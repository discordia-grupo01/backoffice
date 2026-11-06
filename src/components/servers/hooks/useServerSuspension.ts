"use client";

import { useState } from "react";

import { ROUTES } from "@/lib/constants";
import { reactivateServer, suspendServer } from "@/services/servers/client";
import type {
  PlatformServer,
  ServerSuspensionAction,
  ServerSuspensionResult,
} from "@/types/servers.types";

import { serverSuspensionErrorMessage } from "../utils/serverSuspensionError";

interface PendingServerSuspension {
  server: PlatformServer;
  action: ServerSuspensionAction;
}

interface UseServerSuspensionOptions {
  onChanged: (server: PlatformServer) => void;
}

const SEND: Record<
  ServerSuspensionAction,
  (serverId: string) => Promise<ServerSuspensionResult>
> = {
  suspend: suspendServer,
  reactivate: reactivateServer,
};

/** Si otro miembro del staff ya hizo lo mismo, el resultado es el que se buscaba. */
const ALREADY_DONE: Record<ServerSuspensionAction, string> = {
  suspend: "SERVER_ALREADY_SUSPENDED",
  reactivate: "SERVER_NOT_SUSPENDED",
};

function withSuspension(
  server: PlatformServer,
  action: ServerSuspensionAction,
): PlatformServer {
  return {
    ...server,
    suspended_at:
      action === "suspend"
        ? (server.suspended_at ?? new Date().toISOString())
        : null,
  };
}

export function useServerSuspension({ onChanged }: UseServerSuspensionOptions) {
  const [pending, setPending] = useState<PendingServerSuspension | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function request(server: PlatformServer, action: ServerSuspensionAction) {
    setError(undefined);
    setPending({ server, action });
  }

  function cancel() {
    if (isSubmitting) return;
    setPending(null);
  }

  async function confirm() {
    if (!pending || isSubmitting) return;
    const { server, action } = pending;
    setIsSubmitting(true);
    setError(undefined);

    const result = await SEND[action](server.id);
    setIsSubmitting(false);

    if (result.ok) {
      setPending(null);
      onChanged(result.server);
      return;
    }
    if (result.status === 401) {
      window.location.href = ROUTES.login;
      return;
    }
    if (result.code === ALREADY_DONE[action]) {
      setPending(null);
      onChanged(withSuspension(server, action));
      return;
    }
    setError(serverSuspensionErrorMessage(action, result.code));
  }

  return { pending, isSubmitting, error, request, cancel, confirm };
}
