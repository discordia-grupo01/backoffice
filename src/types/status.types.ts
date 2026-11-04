export type PlatformStatus = "operational" | "degraded" | "maintenance";

export type IncidentType = Exclude<PlatformStatus, "operational">;

export type PlatformServiceId =
  | "identify"
  | "servers"
  | "messaging"
  | "notifications"
  | "voice"
  | "admin"
  | "metrics";

export interface Incident {
  id: string;
  title: string;
  description: string;
  affected_services: string[];
  platform_status: IncidentType;
  status: "active" | "resolved";
  created_at: string;
  resolved_at?: string;
}

export interface PlatformStatusResponse {
  status: PlatformStatus;
  incidents: Incident[];
}

export interface IncidentInput {
  title: string;
  description: string;
  affected_services: PlatformServiceId[];
  platform_status: IncidentType;
}

export type StatusResult =
  | { ok: true; data: PlatformStatusResponse }
  | { ok: false; status: number; message: string };

export type IncidentActionResult =
  { ok: true } | { ok: false; status: number; message: string };

export type ServiceHealth = "healthy" | "unavailable" | "no_data";

export interface ServiceHealthCheck {
  service: PlatformServiceId;
  health: ServiceHealth;
  checked_at: string;
}

export type ServiceHealthResult =
  { ok: true; checks: ServiceHealthCheck[] } | { ok: false; message: string };

export type ServiceHealthState =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "ready"; checks: ServiceHealthCheck[] };
