export type MetricsPeriodKey = "today" | "7d" | "30d" | "90d" | "custom";

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
  has_activity: boolean;
}

export interface MetricsRange {
  from: string;
  to: string;
}

export interface GlobalMetricsPoint extends MetricsTotals {
  start: string;
}

export interface GlobalMetricsResponse extends MetricsTotals {
  from: string;
  to: string;
  has_activity: boolean;
  granularity: MetricsGranularity;
  series: GlobalMetricsPoint[];
}

export type MetricsResult =
  | { ok: true; metrics: PlatformMetrics }
  | { ok: false; status: number; message: string };
