"use client";

import { useCallback, useEffect, useState } from "react";

import { useBackofficeChange } from "@/contexts/BackofficeChangesContext";
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

  useBackofficeChange(
    "recovery_requests",
    useCallback(() => setAttempt((value) => value + 1), []),
  );

  return count;
}
