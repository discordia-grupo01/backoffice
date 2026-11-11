"use client";

import { type ChangeFilter } from "@discordia/client-shared";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRefreshOnChange } from "@/hooks/useRefreshOnChange";

import { ROUTES } from "@/lib/constants";
import { getServerGrowth } from "@/services/metrics/client";
import type {
  MetricsPeriod,
  MetricsStatus,
  ServerGrowth,
} from "@/types/metrics.types";

const GROWTH_CHANGE: ChangeFilter = {
  resources: ["backoffice"],
  kinds: ["metrics", "servers"],
};

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

  const rangeRef = useRef(`${serverId}|${from}|${to}`);
  useEffect(() => {
    rangeRef.current = `${serverId}|${from}|${to}`;
  }, [serverId, from, to]);

  const refresh = useCallback(async () => {
    if (!from || !to) return;
    const range = `${serverId}|${from}|${to}`;
    const result = await getServerGrowth(serverId, { from, to });
    if (result.ok && range === rangeRef.current) setGrowth(result.growth);
  }, [serverId, from, to]);

  useRefreshOnChange(GROWTH_CHANGE, refresh, { enabled: Boolean(from && to) });

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { status, growth, retry };
}
