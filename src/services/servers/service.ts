import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type {
  PlatformServer,
  ServersPage,
  ServersQuery,
} from "@/types/servers.types";

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

function suspensionPath(serverId: string) {
  return `/v1/admin/servers/${encodeURIComponent(serverId)}/suspension`;
}

export function suspendServer(
  token: string,
  serverId: string,
): Promise<ApiResult<PlatformServer>> {
  return apiRequest<PlatformServer>(suspensionPath(serverId), {
    method: "POST",
    token,
  });
}

export function reactivateServer(
  token: string,
  serverId: string,
): Promise<ApiResult<PlatformServer>> {
  return apiRequest<PlatformServer>(suspensionPath(serverId), {
    method: "DELETE",
    token,
  });
}
