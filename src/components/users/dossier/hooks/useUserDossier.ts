"use client";

import { useCallback, useEffect, useState } from "react";

import { ROUTES } from "@/lib/constants";
import { getUserDossierSummary } from "@/services/users/dossierClient";
import type { PlatformUser, UserDossierSummary } from "@/types/users.types";

export type UserDossierStatus = "loading" | "success" | "error" | "forbidden";

export const USER_DOSSIER_LOAD_ERROR =
  "No pudimos cargar el expediente. Revisá tu conexión e intentá de nuevo.";

export function useUserDossier(user: PlatformUser) {
  const [status, setStatus] = useState<UserDossierStatus>("loading");
  const [summary, setSummary] = useState<UserDossierSummary | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getUserDossierSummary(user).then((result) => {
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
  }, [user, attempt]);

  return {
    status,
    summary,
    retry: useCallback(() => setAttempt((value) => value + 1), []),
  };
}
