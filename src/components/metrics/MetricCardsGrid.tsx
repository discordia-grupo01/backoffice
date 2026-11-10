import type { MetricsTotals } from "@/types/metrics.types";

import { MetricCard } from "./MetricCard";

export function MetricCardsGrid({ totals }: { totals: MetricsTotals }) {
  return (
    <section
      className="mb-5 grid grid-cols-1 gap-4 @3xl:grid-cols-3"
      aria-label="Métricas globales"
    >
      <MetricCard
        label="Usuarios activos"
        value={totals.active_users}
        hint="Mandaron mensajes o entraron o salieron de un servidor"
        accentVar="--chart-1"
      />
      <MetricCard
        label="Servidores creados"
        value={totals.servers_created}
        hint="Nuevos servidores en el período"
        accentVar="--info"
      />
      <MetricCard
        label="Mensajes enviados"
        value={totals.messages_sent}
        hint="Suma de todos los servidores de la plataforma"
        accentVar="--success"
      />
    </section>
  );
}
