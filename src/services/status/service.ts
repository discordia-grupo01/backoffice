import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type {
  Incident,
  IncidentHistoryQuery,
  IncidentInput,
  PlatformStatusResponse,
} from "@/types/status.types";

export function getPlatformStatus(
  token: string,
): Promise<ApiResult<PlatformStatusResponse>> {
  return apiRequest<PlatformStatusResponse>("/v1/status", { token });
}

/** Como llega de metrics: `created_by` y `resolved_by` son ids y faltan en los incidentes viejos. */
export interface RawIncident extends Incident {
  created_by?: string;
  resolved_by?: string;
}

export interface RawIncidentHistoryPage {
  incidents: RawIncident[];
  total: number;
}

export function listIncidentHistory(
  token: string,
  { search, type, service, from, limit, offset }: IncidentHistoryQuery,
): Promise<ApiResult<RawIncidentHistoryPage>> {
  return apiRequest<RawIncidentHistoryPage>("/v1/metrics/incidents", {
    token,
    params: {
      limit,
      offset,
      ...(search ? { search } : {}),
      ...(type !== "all" ? { type } : {}),
      ...(service !== "all" ? { service } : {}),
      ...(from ? { from } : {}),
    },
  });
}

export function createIncident(
  token: string,
  input: IncidentInput,
): Promise<ApiResult<Incident>> {
  return apiRequest<Incident>("/v1/metrics/incidents", {
    token,
    method: "POST",
    data: input,
  });
}

export function resolveIncident(
  token: string,
  incidentId: string,
): Promise<ApiResult<unknown>> {
  return apiRequest<unknown>(
    `/v1/metrics/incidents/${encodeURIComponent(incidentId)}/resolve`,
    { token, method: "POST" },
  );
}

export interface ServiceHealthResponse {
  services: Array<{
    name: string;
    status: "unknown" | "operational" | "degraded";
    last_checked_at?: string;
    consecutive_failures?: number;
  }>;
}

export function getServiceHealth(
  token: string,
): Promise<ApiResult<ServiceHealthResponse>> {
  return apiRequest<ServiceHealthResponse>("/v1/health/services", { token });
}
