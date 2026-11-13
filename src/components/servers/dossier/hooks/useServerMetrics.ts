"use client";

import {
  CHANGE_POLL_INTERVAL_MS,
  type ChangeFilter,
} from "@discordia/client-shared";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRefreshOnChange } from "@/hooks/useRefreshOnChange";

import { useMetricsPeriod } from "@/hooks/useMetricsPeriod";
import { ROUTES } from "@/lib/constants";
import { getServerMetrics } from "@/services/metrics/client";
import type { MetricsStatus, ServerMetrics } from "@/types/metrics.types";

const METRICS_CHANGE: ChangeFilter = {
  resources: ["backoffice"],
  kinds: ["metrics"],
};

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

  const rangeRef = useRef(`${serverId}|${from}|${to}`);
  useEffect(() => {
    rangeRef.current = `${serverId}|${from}|${to}`;
  }, [serverId, from, to]);

  const refresh = useCallback(async () => {
    if (!from || !to) return;
    const range = `${serverId}|${from}|${to}`;
    const result = await getServerMetrics(serverId, { from, to });
    if (result.ok && range === rangeRef.current) setMetrics(result.metrics);
  }, [serverId, from, to]);

  useRefreshOnChange(METRICS_CHANGE, refresh, {
    enabled: Boolean(from && to),
    pollMs: CHANGE_POLL_INTERVAL_MS,
  });

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { ...periodState, status, metrics, retry };
}
