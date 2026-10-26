import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";
import type {
  PlatformUser,
  SuspensionResult,
  UsersPage,
  UsersQuery,
  UsersResult,
} from "@/types/users.types";

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

interface SuspensionBody {
  ok?: boolean;
  code?: string;
  message?: string;
  user?: PlatformUser;
}

async function sendSuspension(
  method: "post" | "delete",
  userId: string,
): Promise<SuspensionResult> {
  try {
    const { data, status } = await api.request<SuspensionBody>({
      method,
      url: `/users/${encodeURIComponent(userId)}/suspension`,
    });

    if (status === 200 && data.ok && data.user) {
      return { ok: true, user: data.user };
    }
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

export function suspendUser(userId: string): Promise<SuspensionResult> {
  return sendSuspension("post", userId);
}

export function reactivateUser(userId: string): Promise<SuspensionResult> {
  return sendSuspension("delete", userId);
}
