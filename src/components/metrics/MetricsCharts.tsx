import type { PlatformMetrics } from "@/types/metrics.types";

import { ActiveUsersAreaChart } from "./ActiveUsersAreaChart";
import { ChartCard } from "./ChartCard";
import { MetricBarChart } from "./MetricBarChart";

/** Mismo orden que las tarjetas: usuarios, servidores, mensajes. */
export function MetricsCharts({ metrics }: { metrics: PlatformMetrics }) {
  const unit = metrics.granularity === "hour" ? "por hora" : "por día";

  return (
    <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
      <ChartCard
        wide
        title="Usuarios activos"
        subtitle={`Usuarios que enviaron mensajes, ${unit}`}
      >
        <ActiveUsersAreaChart metrics={metrics} />
      </ChartCard>
      <ChartCard
        title="Servidores creados"
        subtitle={`Nuevos servidores, ${unit}`}
      >
        <MetricBarChart
          metrics={metrics}
          dataKey="servers_created"
          valueLabel="servidores"
          colorVar="--info"
        />
      </ChartCard>
      <ChartCard
        title="Mensajes enviados"
        subtitle={`Todos los servidores, ${unit}`}
      >
        <MetricBarChart
          metrics={metrics}
          dataKey="messages_sent"
          valueLabel="mensajes"
          colorVar="--success"
        />
      </ChartCard>
    </div>
  );
}
