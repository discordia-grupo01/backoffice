"use client";

import { useCallback, useEffect, useState } from "react";

import { ROUTES } from "@/lib/constants";
import { getServerGrowth } from "@/services/metrics/client";
import type {
  MetricsPeriod,
  MetricsStatus,
  ServerGrowth,
} from "@/types/metrics.types";

export function useServerGrowth(
  serverId: string,
  period: MetricsPeriod | null,
) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<MetricsStatus>("loading");
  const [growth, setGrowth] = useState<ServerGrowth | null>(null);

  const from = period?.from;
  const to = period?.to;

  useEffect(() => {
    if (!from || !to) return;

    let cancelled = false;
    setStatus("loading");

    getServerGrowth(serverId, { from, to }).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setGrowth(result.growth);
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
  }, [serverId, from, to, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { status, growth, retry };
}
