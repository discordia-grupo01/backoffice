"use client";

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
import type { PlatformMetrics } from "@/types/metrics.types";

import { ChartTooltip } from "@/components/ui/ChartTooltip";

export function ActiveUsersAreaChart({
  metrics,
}: {
  metrics: PlatformMetrics;
}) {
  const { series, granularity } = metrics;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={series}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="activeUsersFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
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
          cursor={{ stroke: "var(--border-strong)" }}
          content={
            <ChartTooltip
              valueLabel="usuarios activos"
              granularity={granularity}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="active_users"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#activeUsersFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
