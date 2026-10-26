import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type { PlatformUser, UsersPage, UsersQuery } from "@/types/users.types";

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

export function suspendUser(
  token: string,
  userId: string,
): Promise<ApiResult<PlatformUser>> {
  return apiRequest<PlatformUser>(
    `/v1/admin/users/${encodeURIComponent(userId)}/suspension`,
    { method: "POST", token },
  );
}
