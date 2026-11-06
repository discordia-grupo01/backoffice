import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type {
  Incident,
  IncidentInput,
  PlatformStatusResponse,
} from "@/types/status.types";

export function getPlatformStatus(
  token: string,
): Promise<ApiResult<PlatformStatusResponse>> {
  return apiRequest<PlatformStatusResponse>("/v1/status", { token });
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
