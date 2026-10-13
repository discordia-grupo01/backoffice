import { DateField } from "@/components/ui/DateField";
import {
  CUSTOM_RANGE_MESSAGES,
  toIsoDate,
  type CustomRangeError,
} from "@/utils/metricsPeriod";
import type { MetricsPeriod } from "@/types/metrics.types";

const RANGE_FIELD = "*:justify-between sm:*:justify-start";

interface CustomRangeInputsProps {
  value: MetricsPeriod;
  error: CustomRangeError | null;
  onChange: (range: MetricsPeriod) => void;
}

export function CustomRangeInputs({
  value,
  error,
  onChange,
}: CustomRangeInputsProps) {
  const today = toIsoDate(new Date());

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
      <div className={RANGE_FIELD}>
        <DateField
          label="Desde"
          value={value.from}
          max={today}
          onChange={(event) => onChange({ ...value, from: event.target.value })}
        />
      </div>
      <div className={RANGE_FIELD}>
        <DateField
          label="Hasta"
          value={value.to}
          max={today}
          onChange={(event) => onChange({ ...value, to: event.target.value })}
        />
      </div>
      {error ? (
        <p role="alert" className="text-danger basis-full text-xs">
          {CUSTOM_RANGE_MESSAGES[error]}
        </p>
      ) : null}
    </div>
  );
}
