import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type { UsersPage, UsersQuery } from "@/types/users.types";

/**
 * Listado de usuarios para el staff.
 *
 *   GET /v1/admin/users?search=&status=&limit=&offset=
 *     -> 200 { users, total, limit, offset } | 400 INVALID_QUERY | 401 | 403 FORBIDDEN
 */
export function listUsers(
  token: string,
  { search, status, limit, offset }: UsersQuery,
): Promise<ApiResult<UsersPage>> {
  return apiRequest<UsersPage>("/v1/admin/users", {
    token,
    params: {
      limit,
      offset,
      ...(search ? { search } : {}),
      ...(status !== "all" ? { status } : {}),
    },
  });
}
