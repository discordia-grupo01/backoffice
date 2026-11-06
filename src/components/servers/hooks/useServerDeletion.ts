"use client";

import { matchesServerNameForDeletion } from "@discordia/client-shared";

import { useState } from "react";

import { ROUTES } from "@/lib/constants";
import { deleteServer } from "@/services/servers/client";
import type { PlatformServer } from "@/types/servers.types";

import { deleteServerErrorMessage } from "../utils/deleteServerError";

export type ServerDeletionOutcome = "requested" | "alreadyDeleted";

export interface ServerDeletionResult {
  server: PlatformServer;
  outcome: ServerDeletionOutcome;
}

interface UseServerDeletionOptions {
  onDeleted: (server: PlatformServer) => void;
  onDismissed: () => void;
}

export function useServerDeletion({
  onDeleted,
  onDismissed,
}: UseServerDeletionOptions) {
  const [pending, setPending] = useState<PlatformServer | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<ServerDeletionResult | null>(null);

  const canConfirm =
    pending !== null &&
    !isSubmitting &&
    matchesServerNameForDeletion(pending.name, confirmName);

  function request(server: PlatformServer) {
    setConfirmName("");
    setError(undefined);
    setPending(server);
  }

  function cancel() {
    if (isSubmitting) return;
    setPending(null);
  }

  function finish(server: PlatformServer, outcome: ServerDeletionOutcome) {
    setPending(null);
    setResult({ server, outcome });
    onDeleted(server);
  }

  async function confirm() {
    if (!pending || !canConfirm) return;
    const server = pending;
    setIsSubmitting(true);
    setError(undefined);

    const response = await deleteServer(server.id, confirmName.trim());
    setIsSubmitting(false);

    if (response.ok) {
      finish(server, "requested");
      return;
    }
    if (response.status === 401) {
      window.location.href = ROUTES.login;
      return;
    }
    if (response.code === "SERVER_NOT_FOUND") {
      finish(server, "alreadyDeleted");
      return;
    }
    setError(deleteServerErrorMessage(response.code));
  }

  function dismissResult() {
    setResult(null);
    onDismissed();
  }

  return {
    pending,
    confirmName,
    setConfirmName,
    canConfirm,
    isSubmitting,
    error,
    result,
    request,
    cancel,
    confirm,
    dismissResult,
  };
}
