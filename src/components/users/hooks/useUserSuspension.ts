"use client";

import { useState } from "react";

import { ROUTES } from "@/lib/constants";
import { reactivateUser, suspendUser } from "@/services/users/client";
import type {
  PlatformUser,
  SuspensionAction,
  SuspensionResult,
} from "@/types/users.types";

import { suspensionErrorMessage } from "../utils/suspensionError";

interface PendingSuspension {
  user: PlatformUser;
  action: SuspensionAction;
}

interface UseUserSuspensionOptions {
  onChanged: (user: PlatformUser) => void;
}

const SEND: Record<
  SuspensionAction,
  (userId: string) => Promise<SuspensionResult>
> = {
  suspend: suspendUser,
  reactivate: reactivateUser,
};

/** Si otro miembro del staff ya hizo lo mismo, el resultado es el que se buscaba. */
const ALREADY_DONE: Record<SuspensionAction, string> = {
  suspend: "USER_ALREADY_SUSPENDED",
  reactivate: "USER_NOT_SUSPENDED",
};

function withStatus(user: PlatformUser, action: SuspensionAction) {
  return action === "suspend"
    ? { ...user, status: "suspended" as const }
    : { ...user, status: "active" as const, suspended_at: null };
}

export function useUserSuspension({ onChanged }: UseUserSuspensionOptions) {
  const [pending, setPending] = useState<PendingSuspension | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function request(user: PlatformUser, action: SuspensionAction) {
    setError(undefined);
    setPending({ user, action });
  }

  function cancel() {
    if (isSubmitting) return;
    setPending(null);
  }

  async function confirm() {
    if (!pending || isSubmitting) return;
    const { user, action } = pending;
    setIsSubmitting(true);
    setError(undefined);

    const result = await SEND[action](user.id);
    setIsSubmitting(false);

    if (result.ok) {
      setPending(null);
      onChanged(result.user);
      return;
    }
    if (result.status === 401) {
      window.location.href = ROUTES.login;
      return;
    }
    if (result.code === ALREADY_DONE[action]) {
      setPending(null);
      onChanged(withStatus(user, action));
      return;
    }
    setError(suspensionErrorMessage(action, result.code));
  }

  return { pending, isSubmitting, error, request, cancel, confirm };
}
