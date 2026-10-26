import { formatInteger, formatSeriesTooltipLabel } from "@/utils/chartFormat";
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
    <div className="border-line-strong bg-surface-raised shadow-raised rounded-[10px] border px-3 py-2 text-[13px]">
      <p className="text-content-subtle mb-0.5 text-xs first-letter:uppercase">
        {formatSeriesTooltipLabel(item.payload.date, granularity)}
      </p>
      <p>
        <strong>{formatInteger(item.value)}</strong> {valueLabel}
      </p>
    </div>
  );
}
