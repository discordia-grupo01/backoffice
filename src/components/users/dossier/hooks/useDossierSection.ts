"use client";

import { usePagedList, type PageRequest } from "@/hooks/usePagedList";
import { getUserDossierPage } from "@/services/users/dossierClient";
import { PAGE_SIZE } from "@/utils/pagination";
import type {
  DossierSection,
  DossierSectionItems,
  PlatformUser,
} from "@/types/users.types";

const NO_FILTERS = {};

export function useDossierSection<S extends DossierSection>(
  user: PlatformUser,
  section: S,
) {
  return usePagedList<DossierSectionItems[S], object>({
    fetchPage: ({ limit, offset }: PageRequest<object>) =>
      getUserDossierPage(user, section, { limit, offset }),
    emptyFilters: NO_FILTERS,
    pageSize: PAGE_SIZE,
  });
}
