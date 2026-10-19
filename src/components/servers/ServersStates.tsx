import { AlertTriangle, SearchX, Server } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StateBox } from "@/components/ui/StateBox";

import { SERVERS_LOAD_ERROR } from "./hooks/useServers";

export function ServersEmptyState({
  hasSearch,
  onClear,
}: {
  hasSearch: boolean;
  onClear: () => void;
}) {
  if (!hasSearch) {
    return (
      <StateBox icon={Server} title="Todavía no hay servidores">
        Cuando alguien cree un servidor, va a aparecer acá.
      </StateBox>
    );
  }

  return (
    <StateBox
      icon={SearchX}
      title="No se encontraron servidores"
      action={
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onClear}
        >
          Limpiar búsqueda
        </Button>
      }
    >
      Probá con otro nombre.
    </StateBox>
  );
}

export function ServersErrorState({ onRetry }: { onRetry: () => void }) {
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
      {SERVERS_LOAD_ERROR}
    </StateBox>
  );
}
