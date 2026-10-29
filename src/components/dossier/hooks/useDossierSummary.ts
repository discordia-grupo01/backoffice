"use client";

import { useCallback, useEffect, useState } from "react";

import { ROUTES } from "@/lib/constants";
import type { DossierSummaryResult } from "@/types/dossier.types";

export type DossierStatus = "loading" | "success" | "error" | "forbidden";

export function useDossierSummary<S, T>(
  subject: S,
  fetchSummary: (subject: S) => Promise<DossierSummaryResult<T>>,
) {
  const [status, setStatus] = useState<DossierStatus>("loading");
  const [summary, setSummary] = useState<T | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchSummary(subject).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setSummary(result.summary);
        setStatus("success");
      } else if (result.status === 401) {
        window.location.href = ROUTES.login;
      } else {
        setStatus(result.status === 403 ? "forbidden" : "error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [subject, fetchSummary, attempt]);

  return {
    status,
    summary,
    retry: useCallback(() => setAttempt((value) => value + 1), []),
  };
}
