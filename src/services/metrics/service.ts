import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type {
  GlobalMetricsResponse,
  MetricsRange,
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
