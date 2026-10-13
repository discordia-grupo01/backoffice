import type { PlatformUser, UserFilters } from "@/types/users.types";

export const EMPTY_USER_FILTERS: UserFilters = { query: "", status: "all" };

/** Minusculas y sin tildes, para que "jose" encuentre a "José". */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function matchesQuery(user: PlatformUser, query: string): boolean {
  if (query === "") return true;
  return normalize(
    `${user.displayName} ${user.username} ${user.email}`,
  ).includes(query);
}

/** Usuarios que cumplen la búsqueda (nombre, usuario o email) y el estado elegido. */
export function filterUsers(
  users: readonly PlatformUser[],
  { query, status }: UserFilters,
): PlatformUser[] {
  const normalizedQuery = normalize(query);
  return users.filter(
    (user) =>
      (status === "all" || user.status === status) &&
      matchesQuery(user, normalizedQuery),
  );
}

export function hasActiveFilters({ query, status }: UserFilters): boolean {
  return query.trim() !== "" || status !== "all";
}
