"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { ListSkeleton } from "@/components/ui/ListSkeleton";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/constants";
import type { ResolvedIncident } from "@/types/status.types";
import { totalLabel } from "@/utils/pagination";

import { useIncidentHistory } from "./hooks/useIncidentHistory";
import { IncidentDetailDialog } from "./IncidentDetailDialog";
import { IncidentHistoryFilters } from "./IncidentHistoryFilters";
import {
  IncidentHistoryEmptyState,
  IncidentHistoryErrorState,
} from "./IncidentHistoryStates";
import { IncidentHistoryTable } from "./IncidentHistoryTable";

export function IncidentHistoryView() {
  const history = useIncidentHistory();
  const [selected, setSelected] = useState<ResolvedIncident | null>(null);
  const { status, incidents, filters, setFilters } = history;
  const hasData = incidents.length > 0;

  if (status === "forbidden") return <NoStaffAccess />;

  function renderResults() {
    if (status === "error")
      return <IncidentHistoryErrorState onRetry={history.retry} />;
    if (status === "loading" && !hasData) {
      return (
        <ListSkeleton
          view="table"
          label="Cargando historial"
          rowHeightPx={65}
        />
      );
    }
    if (!hasData) {
      return (
        <IncidentHistoryEmptyState
          hasActiveFilters={history.hasActiveFilters}
          onClear={history.clear}
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
        <IncidentHistoryTable incidents={incidents} onOpen={setSelected} />
        <PaginationBar
          page={history.page}
          pageSize={history.pageSize}
          total={history.total}
          onPageChange={history.setPage}
        />
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Historial de incidentes"
        subtitle="Todo lo que se publicó y resolvió en la plataforma"
      />

      <PanelBody>
        <div className="space-y-3">
          <Link
            href={ROUTES.status}
            className="text-content-muted hover:text-content focus-visible:ring-bo -ml-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Volver al estado de la plataforma
          </Link>
          <IncidentHistoryFilters
            query={history.search}
            type={filters.type}
            service={filters.service}
            period={filters.period}
            countLabel={status === "success" ? totalLabel(history.total) : ""}
            hasActiveFilters={history.hasActiveFilters}
            onQueryChange={history.setSearch}
            onTypeChange={(type) => setFilters({ type })}
            onServiceChange={(service) => setFilters({ service })}
            onPeriodChange={(period) => setFilters({ period })}
            onClear={history.clear}
          />
          {renderResults()}
        </div>
      </PanelBody>

      <IncidentDetailDialog
        incident={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
