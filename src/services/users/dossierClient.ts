import type { PagedResult } from "@/hooks/usePagedList";
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

const MOCK_DELAY_MS = 450;

/** Elementos más recientes que trae el resumen de cada sección. */
export const DOSSIER_PREVIEW_SIZE = 3;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export type DossierSummaryResult =
  | { ok: true; summary: UserDossierSummary }
  | { ok: false; status: number; message: string };

export async function getUserDossierSummary(
  user: PlatformUser,
): Promise<DossierSummaryResult> {
  await delay();
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
  await delay();
  const items = buildMockDossierSection(user, section);
  return {
    ok: true,
    items: items.slice(offset, offset + limit),
    total: items.length,
  };
}
