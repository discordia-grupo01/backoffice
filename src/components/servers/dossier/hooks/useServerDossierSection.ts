"use client";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { getServerDossierPage } from "@/services/servers/dossierClient";
import { PAGE_SIZE } from "@/utils/pagination";
import type {
  PlatformServer,
  ServerDossierSection,
  ServerDossierSectionItems,
} from "@/types/servers.types";

const NO_FILTERS = {};

export function useServerDossierSection<S extends ServerDossierSection>(
  server: PlatformServer,
  section: S,
) {
  return usePagedList<ServerDossierSectionItems[S], object>({
    fetchPage: ({ limit, offset }: PageRequest<object>) =>
      getServerDossierPage(server, section, { limit, offset }),
    emptyFilters: NO_FILTERS,
    pageSize: PAGE_SIZE,
  });
}
