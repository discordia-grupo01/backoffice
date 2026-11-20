export type HistoryPeriod = "all" | "7d" | "30d" | "90d";

const PERIOD_DAYS: Record<Exclude<HistoryPeriod, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export const HISTORY_PERIOD_OPTIONS: readonly {
  value: HistoryPeriod;
  label: string;
}[] = [
  { value: "all", label: "Todo el historial" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "90d", label: "Últimos 90 días" },
];

/** Desde cuándo pedir incidentes; `undefined` para el historial completo. */
export function historyPeriodStart(
  period: HistoryPeriod,
  now = Date.now(),
): string | undefined {
  if (period === "all") return undefined;
  return new Date(now - PERIOD_DAYS[period] * 24 * 60 * 60_000).toISOString();
}
