"use client";

import { useState } from "react";

import { useDossierUrl } from "@/components/dossier/hooks/useDossierUrl";
import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { useViewMode } from "@/hooks/useViewMode";
import { cn } from "@/lib/cn";
import { totalLabel } from "@/utils/pagination";

import { useUserSuspension } from "./hooks/useUserSuspension";
import { useUsers } from "./hooks/useUsers";
import { UserFilters } from "./UserFilters";
import { UsersList } from "./UsersList";
import { UsersEmptyState, UsersErrorState } from "./UsersStates";
import { UsersSkeleton } from "./UsersSkeleton";
import { UserSuspensionDialog } from "./UserSuspensionDialog";
import { UserDossierDialog } from "./dossier/UserDossierDialog";
import { USER_DOSSIER_SECTION_ORDER } from "./dossier/UserDossierItems";

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
  const dossier = useDossierUrl(USER_DOSSIER_SECTION_ORDER);
  const [dossierVersion, setDossierVersion] = useState(0);
  const suspension = useUserSuspension({
    onChanged: () => {
      setDossierVersion((version) => version + 1);
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
          onViewDossier={(user) => dossier.open(user.id)}
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
        nav={dossier}
        placeholder={
          users.find((user) => user.id === dossier.subjectId) ?? null
        }
        refreshKey={dossierVersion}
        onSuspend={(user) => suspension.request(user, "suspend")}
        onReactivate={(user) => suspension.request(user, "reactivate")}
      />

      <UserSuspensionDialog
        pending={suspension.pending}
        isSubmitting={suspension.isSubmitting}
        error={suspension.error}
        onConfirm={suspension.confirm}
        onCancel={suspension.cancel}
      />
    </>
  );
}
