import { formatInteger, formatSeriesTooltipLabel } from "@/lib/metricsFormat";
import type { MetricsGranularity } from "@/types/metrics.types";

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value?: number; payload?: { date: string } }[];
  valueLabel: string;
  granularity: MetricsGranularity;
}

export function ChartTooltip({
  active,
  payload,
  valueLabel,
  granularity,
}: ChartTooltipProps) {
  const item = payload?.[0];
  if (!active || !item?.payload || item.value === undefined) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-date">
        {formatSeriesTooltipLabel(item.payload.date, granularity)}
      </p>
      <p>
        <strong>{formatInteger(item.value)}</strong> {valueLabel}
      </p>
    </div>
  );
}
