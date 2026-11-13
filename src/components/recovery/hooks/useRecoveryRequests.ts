"use client";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { RECOVERY_REQUESTS_CHANGE } from "@/lib/recoveryRequestsChange";
import { getRecoveryRequests } from "@/services/recovery/client";
import type {
  RecoveryRequest,
  RecoveryStatusFilter,
} from "@/types/recovery.types";

export const RECOVERY_REQUESTS_LOAD_ERROR =
  "No pudimos cargar las solicitudes. Revisá tu conexión e intentá de nuevo.";

interface RecoveryListFilters {
  status: RecoveryStatusFilter;
}

const DEFAULT_FILTERS: RecoveryListFilters = { status: "pending" };

async function fetchRecoveryRequests({
  search,
  filters,
  limit,
  offset,
}: PageRequest<RecoveryListFilters>) {
  const result = await getRecoveryRequests({
    search,
    status: filters.status,
    limit,
    offset,
  });
  return result.ok
    ? {
        ok: true as const,
        items: result.page.requests,
        total: result.page.total,
      }
    : result;
}

export function useRecoveryRequests() {
  const list = usePagedList<RecoveryRequest, RecoveryListFilters>({
    fetchPage: fetchRecoveryRequests,
    emptyFilters: DEFAULT_FILTERS,
    refreshOn: RECOVERY_REQUESTS_CHANGE,
  });

  return {
    ...list,
    requests: list.items,
    statusFilter: list.filters.status,
    setStatusFilter: (status: RecoveryStatusFilter) =>
      list.setFilters({ status }),
  };
}
