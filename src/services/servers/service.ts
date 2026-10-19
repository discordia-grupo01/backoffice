import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type { ServersPage, ServersQuery } from "@/types/servers.types";

/**
 * Listado de servidores para el staff.
 *
 *   GET /v1/admin/servers?search=&limit=&offset=
 *     -> 200 { servers, total, limit, offset } | 400 INVALID_QUERY | 401 | 403 FORBIDDEN
 */
export function listServers(
  token: string,
  { search, limit, offset }: ServersQuery,
): Promise<ApiResult<ServersPage>> {
  return apiRequest<ServersPage>("/v1/admin/servers", {
    token,
    params: { limit, offset, ...(search ? { search } : {}) },
  });
}
