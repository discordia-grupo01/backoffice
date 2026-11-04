"use client";

import { useState } from "react";

import { ROUTES } from "@/lib/constants";
import { resolveIncident } from "@/services/status/client";
import type { Incident } from "@/types/status.types";

interface UseResolveIncidentOptions {
  onResolved: () => void;
  onForbidden: () => void;
}

export function useResolveIncident({
  onResolved,
  onForbidden,
}: UseResolveIncidentOptions) {
  const [pending, setPending] = useState<Incident | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function request(incident: Incident) {
    setError(undefined);
    setPending(incident);
  }

  function cancel() {
    if (!isSubmitting) setPending(null);
  }

  async function confirm() {
    if (!pending || isSubmitting) return;
    setIsSubmitting(true);
    setError(undefined);
    const result = await resolveIncident(pending.id);
    setIsSubmitting(false);

    // 404: otro miembro del staff ya lo resolvió, que es lo que se buscaba.
    if (result.ok || result.status === 404) {
      setPending(null);
      onResolved();
      return;
    }
    if (result.status === 401) {
      window.location.href = ROUTES.login;
      return;
    }
    if (result.status === 403) {
      setPending(null);
      onForbidden();
      return;
    }
    setError(result.message);
  }

  return { pending, isSubmitting, error, request, cancel, confirm };
}
