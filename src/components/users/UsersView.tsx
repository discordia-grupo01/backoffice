"use client";

import { useState } from "react";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { useViewMode } from "@/hooks/useViewMode";
import { cn } from "@/lib/cn";
import { totalLabel } from "@/utils/pagination";

import { useSuspendUser } from "./hooks/useSuspendUser";
import { useUsers } from "./hooks/useUsers";
import { UserFilters } from "./UserFilters";
import { UsersList } from "./UsersList";
import { UsersEmptyState, UsersErrorState } from "./UsersStates";
import { UsersSkeleton } from "./UsersSkeleton";
import { UserDossierDialog } from "./dossier/UserDossierDialog";
import type { PlatformUser } from "@/types/users.types";

function handleReactivate(user: PlatformUser) {
  console.log("Reactivar", user.id);
}

export function UsersView() {
  const {
    query,
    statusFilter,
    hasActiveFilters,
    status,
    users,
    total,
    page,
    pageSize,
    setPage,
    setQuery,
    setStatusFilter,
    clear,
    retry,
  } = useUsers();

  const { viewMode, setViewMode } = useViewMode();
  const [dossierUser, setDossierUser] = useState<PlatformUser | null>(null);
  const suspension = useSuspendUser({
    onSuspended: (user) => {
      setDossierUser((current) => (current?.id === user.id ? user : current));
      retry();
    },
  });
  const hasData = users.length > 0;

  if (status === "forbidden") return <NoStaffAccess />;

  function renderResults() {
    if (status === "error") return <UsersErrorState onRetry={retry} />;
    if (status === "loading" && !hasData)
      return <UsersSkeleton view={viewMode} />;
    if (!hasData) {
      return (
        <UsersEmptyState hasActiveFilters={hasActiveFilters} onClear={clear} />
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
        <UsersList
          users={users}
          view={viewMode}
          onViewDossier={setDossierUser}
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
        title="Usuarios"
        subtitle="Buscá y consultá las cuentas de la plataforma"
      />

      <PanelBody>
        <div className="space-y-3">
          <UserFilters
            query={query}
            status={statusFilter}
            countLabel={status === "success" ? totalLabel(total) : ""}
            hasActiveFilters={hasActiveFilters}
            view={viewMode}
            onViewChange={setViewMode}
            onQueryChange={setQuery}
            onStatusChange={setStatusFilter}
            onClear={clear}
          />
          {renderResults()}
        </div>
      </PanelBody>

      <UserDossierDialog
        user={dossierUser}
        onClose={() => setDossierUser(null)}
        onSuspend={suspension.request}
        onReactivate={handleReactivate}
      />

      <ConfirmDialog
        open={suspension.target !== null}
        title={`¿Suspender a ${suspension.target?.name ?? ""}?`}
        confirmLabel="Sí, suspender"
        isLoading={suspension.isSubmitting}
        error={suspension.error}
        onConfirm={suspension.confirm}
        onCancel={suspension.cancel}
      >
        No va a poder iniciar sesión en Discordia, se cerrarán sus sesiones
        abiertas y su perfil dejará de estar visible para el resto.
      </ConfirmDialog>
    </>
  );
}
