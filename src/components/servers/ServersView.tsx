"use client";

import { useState } from "react";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { SearchInput } from "@/components/ui/SearchInput";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
import { useViewMode } from "@/hooks/useViewMode";
import { cn } from "@/lib/cn";
import { totalLabel } from "@/utils/pagination";
import type { PlatformServer } from "@/types/servers.types";

import { ServerDossierDialog } from "./dossier/ServerDossierDialog";
import { useServers } from "./hooks/useServers";
import { ServersList } from "./ServersList";
import { ServersSkeleton } from "./ServersSkeleton";
import { ServersEmptyState, ServersErrorState } from "./ServersStates";

function handleSuspend(server: PlatformServer) {
  console.log("Suspender", server.id);
}

function handleReactivate(server: PlatformServer) {
  console.log("Reactivar", server.id);
}

function handleDelete(server: PlatformServer) {
  console.log("Eliminar", server.id);
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

  const { viewMode, setViewMode } = useViewMode();
  const [dossierServer, setDossierServer] = useState<PlatformServer | null>(
    null,
  );
  const hasData = servers.length > 0;

  if (status === "forbidden") return <NoStaffAccess />;

  function renderResults() {
    if (status === "error") return <ServersErrorState onRetry={retry} />;
    if (status === "loading" && !hasData)
      return <ServersSkeleton view={viewMode} />;
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
          view={viewMode}
          onViewDossier={setDossierServer}
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
          <div className="flex flex-col gap-3 @3xl:flex-row @3xl:items-center">
            <div className="@3xl:flex-1">
              <SearchInput
                label="Buscar por nombre"
                placeholder="Nombre del servidor"
                value={query}
                onChange={setQuery}
              />
            </div>
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </div>
          <p
            aria-live="polite"
            className="text-content-muted min-h-6 text-[13px] tabular-nums"
          >
            {status === "success" ? totalLabel(total) : ""}
          </p>
          {renderResults()}
        </div>
      </PanelBody>

      <ServerDossierDialog
        server={dossierServer}
        onClose={() => setDossierServer(null)}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
        onDelete={handleDelete}
      />
    </>
  );
}
