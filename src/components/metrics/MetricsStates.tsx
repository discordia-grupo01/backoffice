import { AlertTriangle, BarChart3, ShieldOff } from "lucide-react";

import { METRICS_LOAD_ERROR } from "@/components/metrics/hooks/usePlatformMetrics";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const STATE_BOX =
  "flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-line-strong px-4 py-10 text-center text-content-muted min-[481px]:px-6 min-[481px]:py-14 [&_h1]:mt-2 [&_h1]:text-sm [&_h1]:font-semibold [&_h1]:text-content [&_h2]:mt-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-content [&_p]:max-w-[420px] [&_p]:text-xs";

export function MetricsEmptyState() {
  return (
    <div className={STATE_BOX}>
      <BarChart3 size={32} aria-hidden="true" />
      <h2>No hubo actividad en este período</h2>
      <p>Probá con un rango de fechas más amplio.</p>
    </div>
  );
}

export function MetricsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={STATE_BOX} role="alert">
      <AlertTriangle size={32} aria-hidden="true" />
      <h2>Algo salió mal</h2>
      <p>{METRICS_LOAD_ERROR}</p>
      <Button
        variant="secondary"
        className="mt-3 w-auto py-2.5"
        onClick={onRetry}
      >
        Reintentar
      </Button>
    </div>
  );
}

export function NoStaffAccess() {
  return (
    <div
      className={cn(STATE_BOX, "min-h-dvh justify-center border-none")}
      role="alert"
    >
      <ShieldOff size={36} aria-hidden="true" />
      <h1>No tenés permisos para ver esta sección</h1>
      <p>
        Las métricas de la plataforma son solo para el staff de Discordia. Si
        creés que es un error, contactá a un administrador.
      </p>
    </div>
  );
}
