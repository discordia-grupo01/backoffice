import { PERIOD_OPTIONS } from "@/utils/metricsPeriod";
import type { MetricsPeriodKey } from "@/types/metrics.types";

interface PeriodSelectorProps {
  value: MetricsPeriodKey;
  onChange: (key: MetricsPeriodKey) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="period-selector" role="group" aria-label="Período">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          className="period-btn"
          aria-pressed={option.key === value}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
