import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import type {
  ServiceHealthCheck,
  ServiceHealthResult,
} from "@/types/status.types";

interface HealthResponse {
  ok?: boolean;
  message?: string;
  data?: { services?: Array<Record<string, unknown>> };
}

const PLATFORM_SERVICE_IDS = new Set<ServiceHealthCheck["service"]>([
  "identify",
  "servers",
  "messaging",
  "notifications",
  "voice",
  "admin",
  "metrics",
]);

function mapHealthCheck(
  value: Record<string, unknown>,
): ServiceHealthCheck | null {
  if (
    typeof value.name !== "string" ||
    !PLATFORM_SERVICE_IDS.has(value.name as ServiceHealthCheck["service"]) ||
    typeof value.status !== "string"
  ) {
    return null;
  }
  const health =
    value.status === "operational"
      ? "healthy"
      : value.status === "degraded"
        ? "unavailable"
        : "no_data";
  const checkedAt =
    typeof value.last_checked_at === "string"
      ? value.last_checked_at
      : new Date().toISOString();
  return {
    service: value.name as ServiceHealthCheck["service"],
    health,
    checked_at: checkedAt,
  };
}

export async function getServiceHealth(): Promise<ServiceHealthResult> {
  try {
    const { data, status } = await api.get<HealthResponse>("/health");
    const services = data?.data?.services;
    if (status !== 200 || !Array.isArray(services)) {
      return {
        ok: false,
        status,
        message: data?.message ?? REQUEST_FAILED_MESSAGE,
      };
    }
    return {
      ok: true,
      checks: services
        .map(mapHealthCheck)
        .filter((check): check is ServiceHealthCheck => check !== null),
    };
  } catch {
    return { ok: false, status: 0, message: REQUEST_FAILED_MESSAGE };
  }
}
