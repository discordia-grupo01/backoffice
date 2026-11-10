"use client";

import { useCallback, useEffect, useState } from "react";

import { ROUTES } from "@/lib/constants";
import type { DossierSummaryResult } from "@/types/dossier.types";

export type DossierStatus =
  "loading" | "success" | "error" | "forbidden" | "not-found";

export function useDossierSummary<T>(
  subjectId: string,
  fetchSummary: (subjectId: string) => Promise<DossierSummaryResult<T>>,
  refreshKey = 0,
) {
  const [status, setStatus] = useState<DossierStatus>("loading");
  const [summary, setSummary] = useState<T | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchSummary(subjectId).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setSummary(result.summary);
        setStatus("success");
      } else if (result.status === 401) {
        window.location.href = ROUTES.login;
      } else {
        setStatus(
          result.status === 403
            ? "forbidden"
            : result.status === 404
              ? "not-found"
              : "error",
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [subjectId, fetchSummary, attempt, refreshKey]);

  return {
    status,
    summary,
    retry: useCallback(() => setAttempt((value) => value + 1), []),
  };
}
