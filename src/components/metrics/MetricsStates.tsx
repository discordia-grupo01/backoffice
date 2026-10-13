import { AlertTriangle, BarChart3, ShieldOff } from "lucide-react";

import { METRICS_LOAD_ERROR } from "@/components/metrics/hooks/usePlatformMetrics";

export function MetricsEmptyState() {
  return (
    <div className="state-box">
      <BarChart3 size={32} aria-hidden="true" />
      <h2>No hubo actividad en este período</h2>
      <p>Probá con un rango de fechas más amplio.</p>
    </div>
  );
}

export function MetricsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="state-box" role="alert">
      <AlertTriangle size={32} aria-hidden="true" />
      <h2>Algo salió mal</h2>
      <p>{METRICS_LOAD_ERROR}</p>
      <button type="button" className="btn-secondary" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  );
}

export function NoStaffAccess() {
  return (
    <div className="state-box state-box-full" role="alert">
      <ShieldOff size={36} aria-hidden="true" />
      <h1>No tenés permisos para ver esta sección</h1>
      <p>
        Las métricas de la plataforma son solo para el staff de Discordia. Si
        creés que es un error, contactá a un administrador.
      </p>
    </div>
  );
}
