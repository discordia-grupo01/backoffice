import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type { ServersPage, ServersQuery } from "@/types/servers.types";

export function listServers(
  token: string,
  { search, limit, offset }: ServersQuery,
): Promise<ApiResult<ServersPage>> {
  return apiRequest<ServersPage>("/v1/admin/servers", {
    token,
    params: { limit, offset, ...(search ? { search } : {}) },
  });
}

export function deleteServer(
  token: string,
  serverId: string,
  confirmName: string,
): Promise<ApiResult<unknown>> {
  return apiRequest<unknown>(
    `/v1/admin/servers/${encodeURIComponent(serverId)}`,
    { method: "DELETE", token, data: { confirm_name: confirmName } },
  );
}
