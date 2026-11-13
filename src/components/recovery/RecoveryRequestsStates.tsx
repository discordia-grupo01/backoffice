import { AlertTriangle, KeyRound, SearchX } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StateBox } from "@/components/ui/StateBox";

import { RECOVERY_REQUESTS_LOAD_ERROR } from "./hooks/useRecoveryRequests";

export function RecoveryRequestsEmptyState({
  hasActiveFilters,
  onClear,
}: {
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  if (!hasActiveFilters) {
    return (
      <StateBox icon={KeyRound} title="No hay solicitudes pendientes">
        Cuando alguien pida recuperar su cuenta, va a aparecer acá.
      </StateBox>
    );
  }

  return (
    <StateBox
      icon={SearchX}
      title="No encontramos solicitudes con esos filtros"
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
      Probá con otro nombre, correo o estado.
    </StateBox>
  );
}

export function RecoveryRequestsErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <StateBox
      role="alert"
      icon={AlertTriangle}
      title="No pudimos cargar las solicitudes"
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
      {RECOVERY_REQUESTS_LOAD_ERROR}
    </StateBox>
  );
}
