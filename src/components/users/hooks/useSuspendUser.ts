"use client";

import { useState } from "react";

import { ROUTES } from "@/lib/constants";
import { suspendUser } from "@/services/users/client";
import type { PlatformUser } from "@/types/users.types";

import { suspendUserErrorMessage } from "../utils/suspendUserError";

interface UseSuspendUserOptions {
  onSuspended: (user: PlatformUser) => void;
}

export function useSuspendUser({ onSuspended }: UseSuspendUserOptions) {
  const [target, setTarget] = useState<PlatformUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function request(user: PlatformUser) {
    setError(undefined);
    setTarget(user);
  }

  function cancel() {
    if (isSubmitting) return;
    setTarget(null);
  }

  async function confirm() {
    if (!target || isSubmitting) return;
    setIsSubmitting(true);
    setError(undefined);

    const result = await suspendUser(target.id);
    setIsSubmitting(false);

    if (result.ok) {
      setTarget(null);
      onSuspended(result.user);
      return;
    }
    if (result.status === 401) {
      window.location.href = ROUTES.login;
      return;
    }
    // Otro miembro del staff lo suspendió antes: el resultado es el mismo.
    if (result.code === "USER_ALREADY_SUSPENDED") {
      setTarget(null);
      onSuspended({ ...target, status: "suspended" });
      return;
    }
    setError(suspendUserErrorMessage(result.code));
  }

  return { target, isSubmitting, error, request, cancel, confirm };
}
