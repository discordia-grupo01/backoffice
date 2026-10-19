import { AlertTriangle, SearchX, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StateBox } from "@/components/ui/StateBox";

import { USERS_LOAD_ERROR } from "./hooks/useUsers";

export function UsersEmptyState({
  hasActiveFilters,
  onClear,
}: {
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  if (!hasActiveFilters) {
    return (
      <StateBox icon={Users} title="Todavía no hay usuarios">
        Cuando alguien se registre en la plataforma, va a aparecer acá.
      </StateBox>
    );
  }

  return (
    <StateBox
      icon={SearchX}
      title="No se encontraron resultados"
      action={
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onClear}
        >
          Limpiar filtros
        </Button>
      }
    >
      Probá con otro nombre o correo.
    </StateBox>
  );
}

export function UsersErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateBox
      role="alert"
      icon={AlertTriangle}
      title="Algo salió mal"
      action={
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onRetry}
        >
          Reintentar
        </Button>
      }
    >
      {USERS_LOAD_ERROR}
    </StateBox>
  );
}
