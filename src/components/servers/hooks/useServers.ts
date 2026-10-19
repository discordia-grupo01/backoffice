"use client";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { getServers } from "@/services/servers/client";
import type { PlatformServer } from "@/types/servers.types";

export const SERVERS_LOAD_ERROR =
  "No pudimos cargar los servidores. Revisá tu conexión e intentá de nuevo.";

const NO_FILTERS = {};

async function fetchServers({
  search,
  limit,
  offset,
}: PageRequest<typeof NO_FILTERS>) {
  const result = await getServers({ search, limit, offset });
  return result.ok
    ? {
        ok: true as const,
        items: result.page.servers,
        total: result.page.total,
      }
    : result;
}

/** Listado de servidores con búsqueda por nombre. */
export function useServers() {
  const list = usePagedList<PlatformServer, typeof NO_FILTERS>({
    fetchPage: fetchServers,
    emptyFilters: NO_FILTERS,
  });

  return {
    ...list,
    servers: list.items,
    query: list.search,
    setQuery: list.setSearch,
  };
}
