import type { PagedResult } from "@/hooks/usePagedList";
import type { DossierSummaryResult } from "@/types/dossier.types";
import { DOSSIER_PREVIEW_SIZE, mockDelay } from "@/utils/dossierMock";
import type {
  DossierSection,
  DossierSectionItems,
  PlatformUser,
  UserDossierSummary,
} from "@/types/users.types";

import {
  buildMockDossierSection,
  buildMockDossierSummary,
} from "./mockUserDossier";

export async function getUserDossierSummary(
  user: PlatformUser,
): Promise<DossierSummaryResult<UserDossierSummary>> {
  await mockDelay();
  return {
    ok: true,
    summary: buildMockDossierSummary(user, DOSSIER_PREVIEW_SIZE),
  };
}

export async function getUserDossierPage<S extends DossierSection>(
  user: PlatformUser,
  section: S,
  { limit, offset }: { limit: number; offset: number },
): Promise<PagedResult<DossierSectionItems[S]>> {
  await mockDelay();
  const items = buildMockDossierSection(user, section);
  return {
    ok: true,
    items: items.slice(offset, offset + limit),
    total: items.length,
  };
}
