import { PERIOD_OPTIONS } from "@/utils/metricsPeriod";
import type { MetricsPeriodKey } from "@/types/metrics.types";

interface PeriodSelectorProps {
  value: MetricsPeriodKey;
  onChange: (key: MetricsPeriodKey) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Período">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          className="border-line-strong text-content-muted hover:bg-surface-input focus-visible:outline-bo aria-pressed:border-bo aria-pressed:bg-bo/14 aria-pressed:text-content cursor-pointer rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 aria-pressed:font-semibold min-[481px]:text-xs"
          aria-pressed={option.key === value}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
