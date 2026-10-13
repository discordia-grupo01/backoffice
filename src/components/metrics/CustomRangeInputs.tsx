import {
  CUSTOM_RANGE_MESSAGES,
  toIsoDate,
  type CustomRangeError,
} from "@/lib/metricsPeriod";
import type { MetricsPeriod } from "@/types/metrics.types";

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
    <div className="custom-range">
      <label className="range-field">
        <span>Desde</span>
        <input
          type="date"
          value={value.from}
          max={today}
          onChange={(event) => onChange({ ...value, from: event.target.value })}
        />
      </label>
      <label className="range-field">
        <span>Hasta</span>
        <input
          type="date"
          value={value.to}
          max={today}
          onChange={(event) => onChange({ ...value, to: event.target.value })}
        />
      </label>
      {error ? (
        <p role="alert" className="range-error">
          {CUSTOM_RANGE_MESSAGES[error]}
        </p>
      ) : null}
    </div>
  );
}
