import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import type {
  DeleteServerResult,
  ServersPage,
  ServersQuery,
  ServersResult,
} from "@/types/servers.types";

interface ServersBody {
  ok?: boolean;
  message?: string;
  page?: ServersPage;
}

export async function getServers(query: ServersQuery): Promise<ServersResult> {
  try {
    const { data, status } = await api.get<ServersBody>("/servers", {
      params: {
        search: query.search,
        limit: query.limit,
        offset: query.offset,
      },
    });

    if (status === 200 && data.ok && data.page) {
      return { ok: true, page: data.page };
    }
    return {
      ok: false,
      status,
      message: data?.message ?? REQUEST_FAILED_MESSAGE,
    };
  } catch {
    return { ok: false, status: 0, message: REQUEST_FAILED_MESSAGE };
  }
}

interface DeleteServerBody {
  ok?: boolean;
  code?: string;
  message?: string;
}

export async function deleteServer(
  serverId: string,
  confirmName: string,
): Promise<DeleteServerResult> {
  try {
    const { data, status } = await api.delete<DeleteServerBody>(
      `/servers/${encodeURIComponent(serverId)}`,
      { data: { confirm_name: confirmName } },
    );

    if (status === 202 && data?.ok) return { ok: true };
    return {
      ok: false,
      status,
      code: data?.code ?? "UNKNOWN_ERROR",
      message: data?.message ?? REQUEST_FAILED_MESSAGE,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      code: "NETWORK_ERROR",
      message: REQUEST_FAILED_MESSAGE,
    };
  }
}
