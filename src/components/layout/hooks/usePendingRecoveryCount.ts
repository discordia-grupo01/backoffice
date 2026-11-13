"use client";

import { useCallback, useEffect, useState } from "react";

import { useRefreshOnChange } from "@/hooks/useRefreshOnChange";
import { RECOVERY_REQUESTS_CHANGE } from "@/lib/recoveryRequestsChange";
import { getRecoveryRequests } from "@/services/recovery/client";

export function usePendingRecoveryCount(): number {
  const [count, setCount] = useState(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void getRecoveryRequests({
      search: "",
      status: "pending",
      limit: 1,
      offset: 0,
    }).then((result) => {
      if (!cancelled && result.ok) setCount(result.page.total);
    });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const refetch = useCallback(() => setAttempt((value) => value + 1), []);
  useRefreshOnChange(RECOVERY_REQUESTS_CHANGE, refetch);

  return count;
}
