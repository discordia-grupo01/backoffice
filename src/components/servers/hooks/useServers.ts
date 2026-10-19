"use client";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { getServers } from "@/services/servers/client";
import type { PlatformServer } from "@/types/servers.types";

export const SERVERS_LOAD_ERROR =
  "No pudimos cargar los servidores. Revisá tu conexión e intentá de nuevo.";

/** 12 se reparte exacto en 1, 2 y 3 columnas: la grilla nunca termina con una fila incompleta. */
export const SERVERS_PAGE_SIZE = 12;

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
    pageSize: SERVERS_PAGE_SIZE,
  });

  return {
    ...list,
    servers: list.items,
    query: list.search,
    setQuery: list.setSearch,
  };
}
