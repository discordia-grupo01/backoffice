"use client";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { getUsers } from "@/services/users/client";
import type { PlatformUser, UserStatusFilter } from "@/types/users.types";

export type { PagedListStatus as UsersStatus } from "@/hooks/usePagedList";

export const USERS_LOAD_ERROR =
  "No pudimos cargar los usuarios. Revisá tu conexión e intentá de nuevo.";

interface UserListFilters {
  status: UserStatusFilter;
}

const EMPTY_FILTERS: UserListFilters = { status: "all" };

async function fetchUsers({
  search,
  filters,
  limit,
  offset,
}: PageRequest<UserListFilters>) {
  const result = await getUsers({
    search,
    status: filters.status,
    limit,
    offset,
  });
  return result.ok
    ? { ok: true as const, items: result.page.users, total: result.page.total }
    : result;
}

/** Listado de usuarios: búsqueda por nombre o email y filtro por estado. */
export function useUsers() {
  const list = usePagedList<PlatformUser, UserListFilters>({
    fetchPage: fetchUsers,
    emptyFilters: EMPTY_FILTERS,
  });

  return {
    ...list,
    users: list.items,
    query: list.search,
    setQuery: list.setSearch,
    statusFilter: list.filters.status,
    setStatusFilter: (status: UserStatusFilter) => list.setFilters({ status }),
  };
}
