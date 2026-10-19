"use client";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/cn";
import { resultsLabel } from "@/utils/pagination";
import type { PlatformServer } from "@/types/servers.types";

import { useServers } from "./hooks/useServers";
import { ServersList } from "./ServersList";
import { ServersSkeleton } from "./ServersSkeleton";
import { ServersEmptyState, ServersErrorState } from "./ServersStates";

function handleViewDossier(server: PlatformServer) {
  console.log("Ver expediente", server.id);
}

function handleSuspend(server: PlatformServer) {
  console.log("Suspender", server.id);
}

function handleReactivate(server: PlatformServer) {
  console.log("Reactivar", server.id);
}

export function ServersView() {
  const {
    query,
    hasActiveFilters,
    status,
    servers,
    total,
    page,
    pageSize,
    setPage,
    setQuery,
    clear,
    retry,
  } = useServers();

  const hasData = servers.length > 0;

  if (status === "forbidden") return <NoStaffAccess />;

  function renderResults() {
    if (status === "error") return <ServersErrorState onRetry={retry} />;
    if (status === "loading" && !hasData) return <ServersSkeleton />;
    if (!hasData) {
      return <ServersEmptyState hasSearch={hasActiveFilters} onClear={clear} />;
    }
    return (
      <div
        aria-busy={status === "loading"}
        className={cn(
          "space-y-4 transition-opacity",
          status === "loading" && "opacity-60",
        )}
      >
        <ServersList
          servers={servers}
          onViewDossier={handleViewDossier}
          onSuspend={handleSuspend}
          onReactivate={handleReactivate}
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
        title="Servidores"
        subtitle="Buscá y consultá los servidores de la plataforma"
      />

      <PanelBody>
        <div className="space-y-3">
          <SearchInput
            label="Buscar por nombre"
            placeholder="Nombre del servidor"
            value={query}
            onChange={setQuery}
          />
          <p
            aria-live="polite"
            className="text-content-muted min-h-6 text-[13px] tabular-nums"
          >
            {status === "success" ? resultsLabel(page, pageSize, total) : ""}
          </p>
          {renderResults()}
        </div>
      </PanelBody>
    </>
  );
}
