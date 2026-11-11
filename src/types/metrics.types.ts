export type MetricsStatus = "loading" | "success" | "error" | "forbidden";

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

export interface ServerMetricsCounts {
  active_members: number;
  messages_sent: number;
  new_members: number;
}

export interface ServerMetricsResponse extends ServerMetricsCounts {
  from: string;
  to: string;
  has_activity: boolean;
}

export interface ServerMetrics extends ServerMetricsCounts {
  period: MetricsPeriod;
  has_activity: boolean;
}

export type ServerMetricsResult =
  | { ok: true; metrics: ServerMetrics }
  | { ok: false; status: number; message: string };

export interface ServerGrowthResponse {
  from: string;
  to: string;
  has_activity: boolean;
  points: { start: string; members: number }[];
}

export interface ServerGrowthPoint {
  date: string;
  members: number;
}

export interface ServerGrowth {
  period: MetricsPeriod;
  points: ServerGrowthPoint[];
}

export type ServerGrowthResult =
  | { ok: true; growth: ServerGrowth }
  | { ok: false; status: number; message: string };

export type ServerMetricsExportResult =
  { ok: true; csv: string } | { ok: false; status: number; message: string };
