import { REQUEST_FAILED_MESSAGE } from "@discordia/client-shared";

import type { PagedResult } from "@/hooks/usePagedList";
import { api } from "@/lib/browserApiClient";
import type { DossierPage, DossierSummaryResult } from "@/types/dossier.types";
import type {
  DossierSection,
  DossierSectionItems,
  PlatformUser,
  UserDossierSummary,
} from "@/types/users.types";

function dossierPath(user: PlatformUser): string {
  return `/users/${encodeURIComponent(user.id)}/dossier`;
}

interface SummaryBody {
  ok?: boolean;
  message?: string;
  summary?: UserDossierSummary;
}

export async function getUserDossierSummary(
  user: PlatformUser,
): Promise<DossierSummaryResult<UserDossierSummary>> {
  try {
    const { data, status } = await api.get<SummaryBody>(dossierPath(user));
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

export async function getUserDossierPage<S extends DossierSection>(
  user: PlatformUser,
  section: S,
  { limit, offset }: { limit: number; offset: number },
): Promise<PagedResult<DossierSectionItems[S]>> {
  try {
    const { data, status } = await api.get<SectionBody<DossierSectionItems[S]>>(
      `${dossierPath(user)}/${section}`,
      { params: { limit, offset } },
    );
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
