import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type {
  GlobalMetricsResponse,
  MetricsRange,
  ServerMetricsResponse,
} from "@/types/metrics.types";

export function getGlobalMetrics(
  token: string,
  range: MetricsRange,
): Promise<ApiResult<GlobalMetricsResponse>> {
  return apiRequest<GlobalMetricsResponse>("/v1/metrics/global", {
    token,
    params: range,
  });
}

export function getServerMetrics(
  token: string,
  serverId: string,
  range: MetricsRange,
): Promise<ApiResult<ServerMetricsResponse>> {
  return apiRequest<ServerMetricsResponse>(
    `/v1/servers/${encodeURIComponent(serverId)}/metrics`,
    { token, params: range },
  );
}
