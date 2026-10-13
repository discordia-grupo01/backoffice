"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  presetPeriod,
  toIsoDate,
  validateCustomRange,
  addDays,
  type CustomRangeError,
} from "@/utils/metricsPeriod";
import { ROUTES } from "@/lib/constants";
import { getPlatformMetrics } from "@/services/metrics/client";
import type {
  MetricsPeriod,
  MetricsPeriodKey,
  PlatformMetrics,
} from "@/types/metrics.types";

export type MetricsStatus = "loading" | "success" | "error" | "forbidden";

export const METRICS_LOAD_ERROR =
  "No pudimos cargar las métricas. Revisá tu conexión e intentá de nuevo.";

function defaultCustomRange(): MetricsPeriod {
  const now = new Date();
  return { from: toIsoDate(addDays(now, -6)), to: toIsoDate(now) };
}

export function usePlatformMetrics() {
  const [periodKey, setPeriodKey] = useState<MetricsPeriodKey>("7d");
  const [customRange, setCustomRange] =
    useState<MetricsPeriod>(defaultCustomRange);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<MetricsStatus>("loading");
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);

  const customError: CustomRangeError | null =
    periodKey === "custom" ? validateCustomRange(customRange) : null;

  const period = useMemo<MetricsPeriod | null>(() => {
    if (periodKey !== "custom") return presetPeriod(periodKey);
    return validateCustomRange(customRange) ? null : customRange;
  }, [periodKey, customRange]);

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
        window.location.href = `${ROUTES.login}?next=${ROUTES.home}`;
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
