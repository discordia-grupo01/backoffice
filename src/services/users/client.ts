import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import type { UsersPage, UsersQuery, UsersResult } from "@/types/users.types";

interface UsersBody {
  ok?: boolean;
  message?: string;
  page?: UsersPage;
}

export async function getUsers(query: UsersQuery): Promise<UsersResult> {
  try {
    const { data, status } = await api.get<UsersBody>("/users", {
      params: {
        search: query.search,
        status: query.status,
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
