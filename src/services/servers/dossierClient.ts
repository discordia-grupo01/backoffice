import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import type { PagedResult } from "@/hooks/usePagedList";
import { api } from "@/lib/browserApiClient";
import type { DossierPage, DossierSummaryResult } from "@/types/dossier.types";
import type {
  ServerDossierSection,
  ServerDossierSectionItems,
  ServerDossierSummary,
} from "@/types/servers.types";

function dossierPath(serverId: string): string {
  return `/servers/${encodeURIComponent(serverId)}/dossier`;
}

interface SummaryBody {
  ok?: boolean;
  message?: string;
  summary?: ServerDossierSummary;
}

export async function getServerDossierSummary(
  serverId: string,
): Promise<DossierSummaryResult<ServerDossierSummary>> {
  try {
    const { data, status } = await api.get<SummaryBody>(dossierPath(serverId));
    if (status === 200 && data.ok && data.summary) {
      return { ok: true, summary: data.summary };
    }
    return {
      ok: false,
      status,
      message: data?.message ?? REQUEST_FAILED_MESSAGE,
    };
  } catch {
    return { ok: false, status: 0, message: REQUEST_FAILED_MESSAGE };
  }
}

interface SectionBody<T> {
  ok?: boolean;
  message?: string;
  page?: DossierPage<T>;
}

export async function getServerDossierPage<S extends ServerDossierSection>(
  serverId: string,
  section: S,
  { limit, offset }: { limit: number; offset: number },
): Promise<PagedResult<ServerDossierSectionItems[S]>> {
  try {
    const { data, status } = await api.get<
      SectionBody<ServerDossierSectionItems[S]>
    >(`${dossierPath(serverId)}/${section}`, { params: { limit, offset } });
    if (status === 200 && data.ok && data.page) {
      return { ok: true, items: data.page.items, total: data.page.total };
    }
    return {
      ok: false,
      status,
      message: data?.message ?? REQUEST_FAILED_MESSAGE,
    };
  } catch {
    return { ok: false, status: 0, message: REQUEST_FAILED_MESSAGE };
  }
}
