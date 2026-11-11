"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "@/components/ui/ChartTooltip";
import { formatCompact, formatSeriesLabel } from "@/utils/chartFormat";
import type { ServerGrowthPoint } from "@/types/metrics.types";

function yDomain([min, max]: [number, number]): [number, number] {
  const padding = Math.max(1, Math.ceil((max - min) * 0.15));
  return [Math.max(0, min - padding), max + padding];
}

export function MemberGrowthChart({ points }: { points: ServerGrowthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={points}
        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) =>
            formatSeriesLabel(value, "day", points.length)
          }
          tick={{ fill: "var(--text-3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
          interval={points.length <= 7 ? 0 : "preserveEnd"}
        />
        <YAxis
          domain={yDomain}
          allowDecimals={false}
          tickFormatter={formatCompact}
          tick={{ fill: "var(--text-3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickCount={4}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: "var(--border-strong)" }}
          content={<ChartTooltip valueLabel="miembros" granularity="day" />}
        />
        <Line
          type="linear"
          dataKey="members"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--bg-input)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
