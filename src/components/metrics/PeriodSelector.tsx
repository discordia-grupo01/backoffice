import { Select } from "@/components/ui/Select";
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

/** Pastilla de opciones en pantallas anchas; en angostas, un selector desplegable. */
export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  function handleSelect(next: string) {
    const option = OPTIONS.find((item) => item.value === next);
    if (option) onChange(option.value);
  }

  return (
    <>
      <div className="sm:hidden">
        <Select
          label="Período"
          options={OPTIONS}
          value={value}
          onChange={handleSelect}
        />
      </div>
      <div className="hidden sm:block">
        <ToggleGroup
          label="Período"
          options={OPTIONS}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
}
