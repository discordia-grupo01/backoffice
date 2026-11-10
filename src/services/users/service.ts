import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type { DossierPage } from "@/types/dossier.types";
import type {
  DossierSection,
  DossierSectionItems,
  PlatformUser,
  UserDossierSummary,
  UsersPage,
  UsersQuery,
} from "@/types/users.types";

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

function suspensionPath(userId: string): string {
  return `/v1/admin/users/${encodeURIComponent(userId)}/suspension`;
}

export function suspendUser(
  token: string,
  userId: string,
): Promise<ApiResult<PlatformUser>> {
  return apiRequest<PlatformUser>(suspensionPath(userId), {
    method: "POST",
    token,
  });
}

export function reactivateUser(
  token: string,
  userId: string,
): Promise<ApiResult<PlatformUser>> {
  return apiRequest<PlatformUser>(suspensionPath(userId), {
    method: "DELETE",
    token,
  });
}

function dossierPath(userId: string): string {
  return `/v1/admin/users/${encodeURIComponent(userId)}/dossier`;
}

export function getUserDossier(
  token: string,
  userId: string,
): Promise<ApiResult<UserDossierSummary>> {
  return apiRequest<UserDossierSummary>(dossierPath(userId), { token });
}

export function getUserDossierSection<S extends DossierSection>(
  token: string,
  userId: string,
  section: S,
  { limit, offset }: { limit: number; offset: number },
): Promise<ApiResult<DossierPage<DossierSectionItems[S]>>> {
  return apiRequest<DossierPage<DossierSectionItems[S]>>(
    `${dossierPath(userId)}/${section}`,
    { token, params: { limit, offset } },
  );
}
