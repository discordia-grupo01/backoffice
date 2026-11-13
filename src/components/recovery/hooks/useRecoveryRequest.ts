"use client";

import { useCallback, useEffect, useState } from "react";

import { useRefreshOnChange } from "@/hooks/useRefreshOnChange";
import { ROUTES } from "@/lib/constants";
import { RECOVERY_REQUESTS_CHANGE } from "@/lib/recoveryRequestsChange";
import { getRecoveryRequest } from "@/services/recovery/client";
import type { RecoveryRequestDetail } from "@/types/recovery.types";

export type RecoveryRequestStatus =
  "loading" | "success" | "error" | "not-found" | "forbidden";

interface Loaded {
  id: string;
  status: Exclude<RecoveryRequestStatus, "loading">;
  request: RecoveryRequestDetail | null;
}

export function useRecoveryRequest(requestId: string | null) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!requestId) return;
    let cancelled = false;

    void getRecoveryRequest(requestId).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setLoaded({
          id: requestId,
          status: "success",
          request: result.request,
        });
        return;
      }
      if (result.status === 401) {
        window.location.href = ROUTES.login;
        return;
      }
      setLoaded((previous) => ({
        id: requestId,
        status:
          result.status === 404
            ? "not-found"
            : result.status === 403
              ? "forbidden"
              : "error",
        request: previous?.id === requestId ? previous.request : null,
      }));
    });

    return () => {
      cancelled = true;
    };
  }, [requestId, attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);
  useRefreshOnChange(RECOVERY_REQUESTS_CHANGE, reload, {
    enabled: requestId !== null,
  });

  const current = loaded?.id === requestId ? loaded : null;

  return {
    status: (current?.status ?? "loading") as RecoveryRequestStatus,
    request: current?.request ?? null,
    reload,
    replace: (request: RecoveryRequestDetail) =>
      setLoaded({ id: request.id, status: "success", request }),
  };
}
