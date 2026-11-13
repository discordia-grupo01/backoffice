import { cn } from "@/lib/cn";
import type { CustomRangeError } from "@/utils/metricsPeriod";
import type { MetricsPeriod, MetricsPeriodKey } from "@/types/metrics.types";

import { CustomRangeInputs } from "./CustomRangeInputs";
import { PeriodSelector } from "./PeriodSelector";

interface MetricsPeriodBarProps {
  periodKey: MetricsPeriodKey;
  onPeriodChange: (key: MetricsPeriodKey) => void;
  customRange: MetricsPeriod;
  onCustomRangeChange: (range: MetricsPeriod) => void;
  customError: CustomRangeError | null;
  className?: string;
}

export function MetricsPeriodBar({
  periodKey,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
  customError,
  className,
}: MetricsPeriodBarProps) {
  return (
    <div
      className={cn(
        "border-line bg-surface-raised flex flex-col gap-3 rounded-[14px] border p-3 min-[481px]:px-4 min-[481px]:py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4",
        className,
      )}
    >
      <span className="text-content-muted hidden text-xs font-semibold sm:inline">
        Período:
      </span>
      <PeriodSelector value={periodKey} onChange={onPeriodChange} />
      {periodKey === "custom" ? (
        <CustomRangeInputs
          value={customRange}
          error={customError}
          onChange={onCustomRangeChange}
        />
      ) : null}
    </div>
  );
}
