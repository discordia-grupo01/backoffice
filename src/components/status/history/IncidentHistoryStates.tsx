import { AlertTriangle, History, SearchX } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StateBox } from "@/components/ui/StateBox";

import { INCIDENT_HISTORY_LOAD_ERROR } from "./hooks/useIncidentHistory";

export function IncidentHistoryEmptyState({
  hasActiveFilters,
  onClear,
}: {
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  if (!hasActiveFilters) {
    return (
      <StateBox icon={History} title="Todavía no hay incidentes resueltos">
        Cuando resuelvas un incidente, va a quedar registrado acá.
      </StateBox>
    );
  }

  return (
    <StateBox
      icon={SearchX}
      title="No encontramos incidentes con esos filtros"
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
      Probá con otro texto, tipo, servicio o período.
    </StateBox>
  );
}

export function IncidentHistoryErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <StateBox
      role="alert"
      icon={AlertTriangle}
      title="No pudimos cargar el historial"
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
      {INCIDENT_HISTORY_LOAD_ERROR}
    </StateBox>
  );
}
