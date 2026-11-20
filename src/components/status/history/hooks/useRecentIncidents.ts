"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getIncidentHistory } from "@/services/status/client";
import type { ResolvedIncident } from "@/types/status.types";

export const RECENT_LIMIT = 5;

export type RecentIncidentsState =
  | { phase: "loading" }
  | { phase: "error" }
  | { phase: "ready"; incidents: ResolvedIncident[] };

export function useRecentIncidents() {
  const [state, setState] = useState<RecentIncidentsState>({
    phase: "loading",
  });
  const requestId = useRef(0);

  const load = useCallback(async (showLoading: boolean) => {
    const id = ++requestId.current;
    if (showLoading) setState({ phase: "loading" });

    const result = await getIncidentHistory({
      search: "",
      type: "all",
      service: "all",
      limit: RECENT_LIMIT,
      offset: 0,
    });
    if (id !== requestId.current) return;

    if (result.ok)
      setState({ phase: "ready", incidents: result.page.incidents });
    else if (showLoading) setState({ phase: "error" });
  }, []);

  useEffect(() => {
    void load(true);
    const requests = requestId;
    return () => {
      requests.current++;
    };
  }, [load]);

  const retry = useCallback(() => void load(true), [load]);
  const refresh = useCallback(() => void load(false), [load]);

  return { state, retry, refresh };
}
