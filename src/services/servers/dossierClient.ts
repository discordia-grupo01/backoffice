import type { PagedResult } from "@/hooks/usePagedList";
import type { DossierSummaryResult } from "@/types/dossier.types";
import type {
  PlatformServer,
  ServerDossierSection,
  ServerDossierSectionItems,
  ServerDossierSummary,
} from "@/types/servers.types";
import { DOSSIER_PREVIEW_SIZE, mockDelay } from "@/utils/dossierMock";

import {
  buildMockServerDossierSection,
  buildMockServerDossierSummary,
} from "./mockServerDossier";

export async function getServerDossierSummary(
  server: PlatformServer,
): Promise<DossierSummaryResult<ServerDossierSummary>> {
  await mockDelay();
  return {
    ok: true,
    summary: buildMockServerDossierSummary(server, DOSSIER_PREVIEW_SIZE),
  };
}

export async function getServerDossierPage<S extends ServerDossierSection>(
  server: PlatformServer,
  section: S,
  { limit, offset }: { limit: number; offset: number },
): Promise<PagedResult<ServerDossierSectionItems[S]>> {
  await mockDelay();
  const items = buildMockServerDossierSection(server, section);
  return {
    ok: true,
    items: items.slice(offset, offset + limit),
    total: items.length,
  };
}
