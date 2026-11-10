"use client";

import { useCallback, useEffect, useState } from "react";

import { useMetricsPeriod } from "@/hooks/useMetricsPeriod";
import { ROUTES } from "@/lib/constants";
import { getServerMetrics } from "@/services/metrics/client";
import type { MetricsStatus, ServerMetrics } from "@/types/metrics.types";

export function useServerMetrics(serverId: string) {
  const periodState = useMetricsPeriod();
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<MetricsStatus>("loading");
  const [metrics, setMetrics] = useState<ServerMetrics | null>(null);

  const from = periodState.period?.from;
  const to = periodState.period?.to;

  useEffect(() => {
    if (!from || !to) return;

    let cancelled = false;
    setStatus("loading");

    getServerMetrics(serverId, { from, to }).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setMetrics(result.metrics);
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

  return { ...periodState, status, metrics, retry };
}
