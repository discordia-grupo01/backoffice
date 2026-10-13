export type MetricsPeriodKey = "today" | "7d" | "30d" | "90d" | "custom";

/** Fechas locales en formato `YYYY-MM-DD`, ambas inclusivas. */
export interface MetricsPeriod {
  from: string;
  to: string;
}

export type MetricsGranularity = "hour" | "day";

export interface MetricsTotals {
  active_users: number;
  servers_created: number;
  messages_sent: number;
}

/** `date` es `YYYY-MM-DD`, o `YYYY-MM-DDTHH:00` si la granularidad es horaria. */
export interface MetricsSeriesPoint extends MetricsTotals {
  date: string;
}

export interface PlatformMetrics {
  period: MetricsPeriod;
  granularity: MetricsGranularity;
  totals: MetricsTotals;
  series: MetricsSeriesPoint[];
}
