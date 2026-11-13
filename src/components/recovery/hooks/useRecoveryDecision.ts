"use client";

import { useState } from "react";

import { ROUTES } from "@/lib/constants";
import { decideRecoveryRequest } from "@/services/recovery/client";
import type {
  RecoveryDecision,
  RecoveryRequestResult,
} from "@/types/recovery.types";

import { decisionToast, type ToastMessage } from "../utils/decisionToast";

interface UseRecoveryDecisionOptions {
  onSettled: (result: RecoveryRequestResult, toast: ToastMessage) => void;
}

export function useRecoveryDecision({ onSettled }: UseRecoveryDecisionOptions) {
  const [pending, setPending] = useState<RecoveryDecision | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function cancel() {
    if (!isSubmitting) setPending(null);
  }

  async function confirm(requestId: string) {
    if (!pending || isSubmitting) return;
    const decision = pending;
    setIsSubmitting(true);
    const result = await decideRecoveryRequest(requestId, decision);
    setIsSubmitting(false);

    if (!result.ok && result.status === 401) {
      window.location.href = ROUTES.login;
      return;
    }
    setPending(null);
    onSettled(result, decisionToast(decision, result));
  }

  return { pending, isSubmitting, request: setPending, cancel, confirm };
}
