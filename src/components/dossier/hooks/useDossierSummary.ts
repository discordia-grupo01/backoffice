"use client";

import { type ChangeFilter } from "@discordia/client-shared";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRefreshOnChange } from "@/hooks/useRefreshOnChange";

import { ROUTES } from "@/lib/constants";
import type { DossierSummaryResult } from "@/types/dossier.types";

const SUMMARY_CHANGE: ChangeFilter = {
  resources: ["backoffice"],
  kinds: ["dossier", "users", "servers", "reports"],
};

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

  const subjectRef = useRef(subjectId);
  useEffect(() => {
    subjectRef.current = subjectId;
  }, [subjectId]);

  const refresh = useCallback(async () => {
    const requested = subjectId;
    const result = await fetchSummary(requested);
    if (result.ok && requested === subjectRef.current) {
      setSummary(result.summary);
    }
  }, [subjectId, fetchSummary]);

  useRefreshOnChange(SUMMARY_CHANGE, refresh);

  return {
    status,
    summary,
    retry: useCallback(() => setAttempt((value) => value + 1), []),
  };
}
