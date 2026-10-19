"use client";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { cn } from "@/lib/cn";
import { resultsLabel } from "@/utils/pagination";

import { useUsers } from "./hooks/useUsers";
import { UserFilters } from "./UserFilters";
import { UsersList } from "./UsersList";
import { UsersEmptyState, UsersErrorState } from "./UsersStates";
import { UsersSkeleton } from "./UsersSkeleton";
import type { PlatformUser } from "@/types/users.types";

function handleViewDossier(user: PlatformUser) {
  console.log("Ver expediente", user.id);
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

  const hasData = users.length > 0;

  if (status === "forbidden") return <NoStaffAccess />;

  function renderResults() {
    if (status === "error") return <UsersErrorState onRetry={retry} />;
    if (status === "loading" && !hasData) return <UsersSkeleton />;
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
        <UsersList users={users} onViewDossier={handleViewDossier} />
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
            countLabel={
              status === "success" ? resultsLabel(page, pageSize, total) : ""
            }
            hasActiveFilters={hasActiveFilters}
            onQueryChange={setQuery}
            onStatusChange={setStatusFilter}
            onClear={clear}
          />
          {renderResults()}
        </div>
      </PanelBody>
    </>
  );
}
