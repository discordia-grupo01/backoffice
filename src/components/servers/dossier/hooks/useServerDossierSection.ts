"use client";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { getServerDossierPage } from "@/services/servers/dossierClient";
import { DOSSIER_PAGE_SIZE } from "@/utils/pagination";
import type {
  ServerDossierSection,
  ServerDossierSectionItems,
} from "@/types/servers.types";

const NO_FILTERS = {};

export function useServerDossierSection<S extends ServerDossierSection>(
  serverId: string,
  section: S,
) {
  return usePagedList<ServerDossierSectionItems[S], object>({
    fetchPage: ({ limit, offset }: PageRequest<object>) =>
      getServerDossierPage(serverId, section, { limit, offset }),
    emptyFilters: NO_FILTERS,
    pageSize: DOSSIER_PAGE_SIZE,
  });
}
