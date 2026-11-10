"use client";

import { useCallback, useEffect, useState } from "react";

import { useMetricsPeriod } from "@/hooks/useMetricsPeriod";
import { ROUTES } from "@/lib/constants";
import { getPlatformMetrics } from "@/services/metrics/client";
import type { MetricsStatus, PlatformMetrics } from "@/types/metrics.types";

export const METRICS_LOAD_ERROR =
  "No pudimos cargar las métricas. Revisá tu conexión e intentá de nuevo.";

export function usePlatformMetrics() {
  const {
    periodKey,
    setPeriodKey,
    customRange,
    setCustomRange,
    customError,
    period,
  } = useMetricsPeriod();
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<MetricsStatus>("loading");
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);

  const from = period?.from;
  const to = period?.to;

  useEffect(() => {
    if (!from || !to) return;

    let cancelled = false;
    setStatus("loading");

    getPlatformMetrics({ from, to }).then((result) => {
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
  }, [from, to, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return {
    periodKey,
    setPeriodKey,
    customRange,
    setCustomRange,
    customError,
    status,
    metrics,
    retry,
  };
}
