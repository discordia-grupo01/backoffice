import { AlertTriangle, BarChart3, ShieldOff } from "lucide-react";

import { METRICS_LOAD_ERROR } from "@/components/metrics/hooks/usePlatformMetrics";
import { Button } from "@/components/ui/Button";
import { StateBox } from "@/components/ui/StateBox";

export function MetricsEmptyState() {
  return (
    <StateBox icon={BarChart3} title="No hubo actividad en este período">
      Probá con un rango de fechas más amplio.
    </StateBox>
  );
}

export function MetricsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateBox
      role="alert"
      icon={AlertTriangle}
      title="Algo salió mal"
      action={
        <Button
          variant="secondary"
          className="mt-3 w-auto py-2.5"
          onClick={onRetry}
        >
          Reintentar
        </Button>
      }
    >
      {METRICS_LOAD_ERROR}
    </StateBox>
  );
}

export function NoStaffAccess() {
  return (
    <StateBox
      role="alert"
      isFullScreen
      headingLevel="h1"
      icon={ShieldOff}
      title="No tenés permisos para ver esta sección"
    >
      Las métricas de la plataforma son solo para el staff de Discordia. Si
      creés que es un error, contactá a un administrador.
    </StateBox>
  );
}
