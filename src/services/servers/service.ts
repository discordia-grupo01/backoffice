import "server-only";

import { apiRequest, type ApiResult } from "@/lib/apiClient";
import type { DossierPage } from "@/types/dossier.types";
import type {
  PlatformServer,
  ServerDossierSection,
  ServerDossierSectionItems,
  ServerDossierSummary,
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

function dossierPath(serverId: string): string {
  return `/v1/admin/servers/${encodeURIComponent(serverId)}/dossier`;
}

export function getServerDossier(
  token: string,
  serverId: string,
): Promise<ApiResult<ServerDossierSummary>> {
  return apiRequest<ServerDossierSummary>(dossierPath(serverId), { token });
}

export function getServerDossierSection<S extends ServerDossierSection>(
  token: string,
  serverId: string,
  section: S,
  { limit, offset }: { limit: number; offset: number },
): Promise<ApiResult<DossierPage<ServerDossierSectionItems[S]>>> {
  return apiRequest<DossierPage<ServerDossierSectionItems[S]>>(
    `${dossierPath(serverId)}/${section}`,
    { token, params: { limit, offset } },
  );
}
