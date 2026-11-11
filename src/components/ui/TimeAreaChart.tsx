"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompact, formatSeriesLabel } from "@/utils/chartFormat";
import type { MetricsGranularity } from "@/types/metrics.types";

import { ChartTooltip } from "./ChartTooltip";

interface TimeAreaChartProps<T extends { date: string }> {
  data: readonly T[];
  dataKey: Extract<keyof T, string>;
  granularity: MetricsGranularity;
  valueLabel: string;
  colorVar: string;
  fitToData?: boolean;
}

export function TimeAreaChart<T extends { date: string }>({
  data,
  dataKey,
  granularity,
  valueLabel,
  colorVar,
  fitToData = false,
}: TimeAreaChartProps<T>) {
  const gradientId = `area-${useId().replace(/:/g, "")}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data as T[]}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={`var(${colorVar})`}
              stopOpacity={0.35}
            />
            <stop
              offset="100%"
              stopColor={`var(${colorVar})`}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
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
        />
        <YAxis
          domain={fitToData ? ["auto", "auto"] : [0, "auto"]}
          allowDecimals={false}
          tickFormatter={formatCompact}
          tick={{ fill: "var(--text-3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: "var(--border-strong)" }}
          content={
            <ChartTooltip valueLabel={valueLabel} granularity={granularity} />
          }
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={`var(${colorVar})`}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
