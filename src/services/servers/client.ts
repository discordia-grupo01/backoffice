import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import type {
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
