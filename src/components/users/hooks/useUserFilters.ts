"use client";

import { useMemo, useState } from "react";

import {
  EMPTY_USER_FILTERS,
  filterUsers,
  hasActiveFilters,
} from "@/utils/userFilters";
import type {
  PlatformUser,
  UserFilters,
  UserStatusFilter,
} from "@/types/users.types";

/** Estado de la búsqueda y del filtro por estado, y los usuarios que los cumplen. */
export function useUserFilters(users: readonly PlatformUser[]) {
  const [filters, setFilters] = useState<UserFilters>(EMPTY_USER_FILTERS);

  const filteredUsers = useMemo(
    () => filterUsers(users, filters),
    [users, filters],
  );

  return {
    filters,
    filteredUsers,
    hasActiveFilters: hasActiveFilters(filters),
    setQuery: (query: string) => setFilters((prev) => ({ ...prev, query })),
    setStatus: (status: UserStatusFilter) =>
      setFilters((prev) => ({ ...prev, status })),
    clear: () => setFilters(EMPTY_USER_FILTERS),
  };
}
