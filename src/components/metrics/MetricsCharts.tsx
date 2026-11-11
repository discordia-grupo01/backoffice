import { TimeAreaChart } from "@/components/ui/TimeAreaChart";
import { TimeBarChart } from "@/components/ui/TimeBarChart";
import type { PlatformMetrics } from "@/types/metrics.types";

import { ChartCard } from "./ChartCard";

export function MetricsCharts({ metrics }: { metrics: PlatformMetrics }) {
  const unit = metrics.granularity === "hour" ? "por hora" : "por día";

  return (
    <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
      <ChartCard
        wide
        title="Usuarios activos"
        subtitle={`Usuarios con actividad, ${unit}`}
      >
        <TimeAreaChart
          data={metrics.series}
          granularity={metrics.granularity}
          dataKey="active_users"
          valueLabel="usuarios activos"
          colorVar="--chart-1"
        />
      </ChartCard>
      <ChartCard
        title="Servidores creados"
        subtitle={`Nuevos servidores, ${unit}`}
      >
        <TimeBarChart
          data={metrics.series}
          granularity={metrics.granularity}
          dataKey="servers_created"
          valueLabel="servidores"
          colorVar="--info"
        />
      </ChartCard>
      <ChartCard
        title="Mensajes enviados"
        subtitle={`Todos los servidores, ${unit}`}
      >
        <TimeBarChart
          data={metrics.series}
          granularity={metrics.granularity}
          dataKey="messages_sent"
          valueLabel="mensajes"
          colorVar="--success"
        />
      </ChartCard>
    </div>
  );
}
