import { formatInteger } from "@/components/metrics/utils/metricsFormat";
import type { MetricsTotals } from "@/types/metrics.types";

import { MetricCard } from "./MetricCard";

export function MetricCardsGrid({ totals }: { totals: MetricsTotals }) {
  return (
    <section className="metric-grid" aria-label="Métricas globales">
      <MetricCard
        label="Usuarios activos"
        value={formatInteger(totals.active_users)}
        hint="Enviaron al menos un mensaje en el período"
        accentVar="--chart-1"
      />
      <MetricCard
        label="Servidores creados"
        value={formatInteger(totals.servers_created)}
        hint="Nuevos servidores en el período"
        accentVar="--info"
      />
      <MetricCard
        label="Mensajes enviados"
        value={formatInteger(totals.messages_sent)}
        hint="Suma de todos los servidores de la plataforma"
        accentVar="--success"
      />
    </section>
  );
}
