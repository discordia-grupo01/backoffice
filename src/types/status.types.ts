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

/** Staff que publicó o resolvió un incidente. `name` es el nombre de usuario; los dos son `null` si admin no lo encontró. */
export interface IncidentAuthor {
  id: string;
  name: string | null;
  email: string | null;
}

/** Incidente del historial: el BFF cambia los ids de `created_by` y `resolved_by` por los datos del staff. */
export interface ResolvedIncident extends Incident {
  created_by: IncidentAuthor | null;
  resolved_by: IncidentAuthor | null;
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

export type IncidentTypeFilter = "all" | IncidentType;

export type IncidentServiceFilter = "all" | PlatformServiceId;

export interface IncidentHistoryQuery {
  search: string;
  type: IncidentTypeFilter;
  service: IncidentServiceFilter;
  /** ISO; sin valor trae el historial completo. */
  from?: string;
  limit: number;
  offset: number;
}

export interface IncidentHistoryPage {
  incidents: ResolvedIncident[];
  total: number;
}

export type IncidentHistoryResult =
  | { ok: true; page: IncidentHistoryPage }
  | { ok: false; status: number; message: string };

export type ServiceHealth = "healthy" | "unavailable" | "no_data";

export interface ServiceHealthCheck {
  service: PlatformServiceId;
  health: ServiceHealth;
  checked_at: string;
}

export type ServiceHealthResult =
  | { ok: true; checks: ServiceHealthCheck[] }
  | { ok: false; status: number; message: string };

export type ServiceHealthState =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "forbidden"; message: string }
  | { phase: "ready"; checks: ServiceHealthCheck[] };
