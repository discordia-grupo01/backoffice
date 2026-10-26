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

import { formatCompact, formatSeriesLabel } from "@/utils/chartFormat";
import type { MetricsGranularity } from "@/types/metrics.types";

import { ChartTooltip } from "./ChartTooltip";

interface TimeBarChartProps<T extends { date: string }> {
  /** Un punto por día u hora, en orden. */
  data: readonly T[];
  dataKey: Extract<keyof T, string>;
  granularity: MetricsGranularity;
  /** Cómo se nombra lo que se cuenta en el tooltip, p. ej. "mensajes". */
  valueLabel: string;
  /** Variable CSS del color de las barras, p. ej. `--success`. */
  colorVar: string;
}

/** Barras de una cantidad a lo largo del tiempo, con el valor exacto en el tooltip. */
export function TimeBarChart<T extends { date: string }>({
  data,
  dataKey,
  granularity,
  valueLabel,
  colorVar,
}: TimeBarChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data as T[]}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) =>
            formatSeriesLabel(value, granularity, data.length)
          }
          tick={{ fill: "var(--text-3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
          interval={data.length <= 7 ? 0 : "preserveEnd"}
        />
        <YAxis
          allowDecimals={false}
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
