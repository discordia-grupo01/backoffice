"use client";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { getIncidentHistory } from "@/services/status/client";
import type {
  ResolvedIncident,
  IncidentServiceFilter,
  IncidentTypeFilter,
} from "@/types/status.types";

import { historyPeriodStart, type HistoryPeriod } from "../utils/historyPeriod";

export const INCIDENT_HISTORY_LOAD_ERROR =
  "No pudimos cargar el historial. Revisá tu conexión e intentá de nuevo.";

interface HistoryFilters {
  type: IncidentTypeFilter;
  service: IncidentServiceFilter;
  period: HistoryPeriod;
}

const EMPTY_FILTERS: HistoryFilters = {
  type: "all",
  service: "all",
  period: "all",
};

async function fetchIncidentHistory({
  search,
  filters,
  limit,
  offset,
}: PageRequest<HistoryFilters>) {
  const result = await getIncidentHistory({
    search,
    type: filters.type,
    service: filters.service,
    from: historyPeriodStart(filters.period),
    limit,
    offset,
  });
  return result.ok
    ? {
        ok: true as const,
        items: result.page.incidents,
        total: result.page.total,
      }
    : result;
}

export function useIncidentHistory() {
  const list = usePagedList<ResolvedIncident, HistoryFilters>({
    fetchPage: fetchIncidentHistory,
    emptyFilters: EMPTY_FILTERS,
  });

  return { ...list, incidents: list.items };
}
