"use client";

import { SearchX } from "lucide-react";

import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { Button } from "@/components/ui/Button";
import { StateBox } from "@/components/ui/StateBox";
import { MOCK_USERS } from "@/services/users/mockUsers";
import type { PlatformUser } from "@/types/users.types";

import { useUserFilters } from "./hooks/useUserFilters";
import { UserFilters } from "./UserFilters";
import { UsersList } from "./UsersList";

function handleViewDossier(user: PlatformUser) {
  console.log("Ver expediente", user.id);
}

export function UsersView() {
  const {
    filters,
    filteredUsers,
    hasActiveFilters,
    setQuery,
    setStatus,
    clear,
  } = useUserFilters(MOCK_USERS);

  return (
    <>
      <PanelHeader
        title="Usuarios"
        subtitle="Buscá y consultá las cuentas de la plataforma"
      />

      <PanelBody>
        <div className="space-y-2">
          <UserFilters
            query={filters.query}
            status={filters.status}
            resultCount={filteredUsers.length}
            hasActiveFilters={hasActiveFilters}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            onClear={clear}
          />

          {filteredUsers.length === 0 ? (
            <StateBox
              icon={SearchX}
              title="No se encontraron resultados"
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={clear}
                >
                  Limpiar filtros
                </Button>
              }
            >
              Probá con otro nombre, usuario o correo.
            </StateBox>
          ) : (
            <UsersList
              users={filteredUsers}
              onViewDossier={handleViewDossier}
            />
          )}
        </div>
      </PanelBody>
    </>
  );
}
