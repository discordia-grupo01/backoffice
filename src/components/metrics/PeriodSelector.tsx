import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { PERIOD_OPTIONS } from "@/utils/metricsPeriod";
import type { MetricsPeriodKey } from "@/types/metrics.types";

interface PeriodSelectorProps {
  value: MetricsPeriodKey;
  onChange: (key: MetricsPeriodKey) => void;
}

const OPTIONS = PERIOD_OPTIONS.map(({ key, label }) => ({
  value: key,
  label,
}));

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <ToggleGroup
      label="Período"
      options={OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
