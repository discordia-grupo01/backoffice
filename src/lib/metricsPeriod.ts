import type { MetricsPeriod, MetricsPeriodKey } from "@/types/metrics.types";

export const PERIOD_OPTIONS: { key: MetricsPeriodKey; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
  { key: "90d", label: "90 días" },
  { key: "custom", label: "Personalizado" },
];

const PRESET_DAYS: Record<Exclude<MetricsPeriodKey, "custom">, number> = {
  today: 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Parsea `YYYY-MM-DD` como fecha local (evita el corrimiento de zona horaria de `new Date(str)`). */
export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function presetPeriod(
  key: Exclude<MetricsPeriodKey, "custom">,
  now: Date = new Date(),
): MetricsPeriod {
  return {
    from: toIsoDate(addDays(now, -(PRESET_DAYS[key] - 1))),
    to: toIsoDate(now),
  };
}

export type CustomRangeError = "incomplete" | "inverted" | "future";

export const CUSTOM_RANGE_MESSAGES: Record<CustomRangeError, string> = {
  incomplete: "Elegí la fecha de inicio y la de fin.",
  inverted: "La fecha de inicio no puede ser posterior a la de fin.",
  future: "La fecha de fin no puede ser futura.",
};

export function validateCustomRange(
  range: { from: string; to: string },
  now: Date = new Date(),
): CustomRangeError | null {
  if (!range.from || !range.to) return "incomplete";
  if (range.from > range.to) return "inverted";
  if (range.to > toIsoDate(now)) return "future";
  return null;
}
