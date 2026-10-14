"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatCompact,
  formatSeriesLabel,
} from "@/components/metrics/utils/metricsFormat";
import type { PlatformMetrics } from "@/types/metrics.types";

import { ChartTooltip } from "./ChartTooltip";

interface MetricBarChartProps {
  metrics: PlatformMetrics;
  dataKey: "servers_created" | "messages_sent";
  /** Cómo se nombra lo que se cuenta en el tooltip, p. ej. "mensajes". */
  valueLabel: string;
  /** Variable CSS del color de las barras, p. ej. `--success`. */
  colorVar: string;
}

export function MetricBarChart({
  metrics,
  dataKey,
  valueLabel,
  colorVar,
}: MetricBarChartProps) {
  const { series, granularity } = metrics;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) =>
            formatSeriesLabel(value, granularity, series.length)
          }
          tick={{ fill: "var(--text-3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={formatCompact}
          tick={{ fill: "var(--text-3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          cursor={{ fill: "var(--border)" }}
          content={
            <ChartTooltip valueLabel={valueLabel} granularity={granularity} />
          }
        />
        <Bar
          dataKey={dataKey}
          fill={`var(${colorVar})`}
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
