import { AlertTriangle, BarChart3 } from "lucide-react";

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
          size="sm"
          className="mt-3"
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
