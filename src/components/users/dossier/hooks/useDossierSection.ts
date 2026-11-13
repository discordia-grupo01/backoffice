"use client";

import { type ChangeFilter } from "@discordia/client-shared";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { getUserDossierPage } from "@/services/users/dossierClient";
import { DOSSIER_PAGE_SIZE } from "@/utils/pagination";
import type { DossierSection, DossierSectionItems } from "@/types/users.types";

const NO_FILTERS = {};

const DOSSIER_CHANGE: ChangeFilter = {
  resources: ["backoffice"],
  kinds: ["dossier", "users", "reports"],
};

export function useDossierSection<S extends DossierSection>(
  userId: string,
  section: S,
) {
  return usePagedList<DossierSectionItems[S], object>({
    fetchPage: ({ limit, offset }: PageRequest<object>) =>
      getUserDossierPage(userId, section, { limit, offset }),
    emptyFilters: NO_FILTERS,
    pageSize: DOSSIER_PAGE_SIZE,
    refreshOn: DOSSIER_CHANGE,
  });
}
