"use client";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { ListFilters } from "@/components/ui/ListFilters";
import { ListSkeleton } from "@/components/ui/ListSkeleton";
import { PaginationBar } from "@/components/ui/PaginationBar";
import type { ToggleOption } from "@/components/ui/ToggleGroup";
import { useViewMode } from "@/hooks/useViewMode";
import { cn } from "@/lib/cn";
import type { RecoveryStatusFilter } from "@/types/recovery.types";
import { totalLabel } from "@/utils/pagination";

import { useRecoveryRequests } from "./hooks/useRecoveryRequests";
import { useRecoveryRequestUrl } from "./hooks/useRecoveryRequestUrl";
import { RecoveryRequestDialog } from "./RecoveryRequestDialog";
import { RecoveryRequestsList } from "./RecoveryRequestsList";
import {
  RecoveryRequestsEmptyState,
  RecoveryRequestsErrorState,
} from "./RecoveryRequestsStates";

const STATUS_OPTIONS: ToggleOption<RecoveryStatusFilter>[] = [
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
  { value: "all", label: "Todas" },
];

export function RecoveryRequestsView() {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    hasActiveFilters,
    status,
    requests,
    total,
    page,
    pageSize,
    setPage,
    clear,
    retry,
  } = useRecoveryRequests();
  const { viewMode, setViewMode } = useViewMode();
  const detail = useRecoveryRequestUrl();
  const hasData = requests.length > 0;

  if (status === "forbidden") return <NoStaffAccess />;

  function renderResults() {
    if (status === "error")
      return <RecoveryRequestsErrorState onRetry={retry} />;
    if (status === "loading" && !hasData) {
      return (
        <ListSkeleton
          view={viewMode}
          label="Cargando solicitudes"
          rowHeightPx={61}
        />
      );
    }
    if (!hasData) {
      return (
        <RecoveryRequestsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClear={clear}
        />
      );
    }
    return (
      <div
        aria-busy={status === "loading"}
        className={cn(
          "space-y-4 transition-opacity",
          status === "loading" && "opacity-60",
        )}
      >
        <RecoveryRequestsList
          requests={requests}
          view={viewMode}
          onOpen={(request) => detail.open(request.id)}
        />
        <PaginationBar
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        />
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Solicitudes de recuperación"
        subtitle="Revisá los pedidos de usuarios que perdieron su segundo factor"
      />

      <PanelBody>
        <div className="space-y-3">
          <ListFilters
            query={search}
            status={statusFilter}
            statusOptions={STATUS_OPTIONS}
            countLabel={status === "success" ? totalLabel(total) : ""}
            hasActiveFilters={hasActiveFilters}
            view={viewMode}
            onViewChange={setViewMode}
            onQueryChange={setSearch}
            onStatusChange={setStatusFilter}
            onClear={clear}
          />
          {renderResults()}
        </div>
      </PanelBody>

      <RecoveryRequestDialog
        requestId={detail.requestId}
        onClose={detail.close}
      />
    </>
  );
}
