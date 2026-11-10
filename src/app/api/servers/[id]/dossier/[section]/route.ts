import { INVALID_DATA_MESSAGE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import {
  parseInteger,
  unauthorizedResponse,
  upstreamFailureResponse,
} from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { getServerDossierSection } from "@/services/servers/service";
import { DOSSIER_PAGE_SIZE, MAX_PAGE_SIZE } from "@/utils/pagination";
import type { DossierPage } from "@/types/dossier.types";
import type {
  ServerDossierSection,
  ServerDossierSectionItems,
} from "@/types/servers.types";

type SectionResponse =
  | {
      ok: true;
      page: DossierPage<ServerDossierSectionItems[ServerDossierSection]>;
    }
  | { ok: false; message: string };

type RouteContext = { params: { id: string; section: string } };

const SECTIONS: readonly ServerDossierSection[] = ["reports", "moderation"];

function isSection(value: string): value is ServerDossierSection {
  return (SECTIONS as readonly string[]).includes(value);
}

export async function GET(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse<SectionResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const limit = parseInteger(searchParams.get("limit"), DOSSIER_PAGE_SIZE);
  const offset = parseInteger(searchParams.get("offset"), 0);

  if (
    !isSection(params.section) ||
    limit === null ||
    offset === null ||
    limit < 1 ||
    limit > MAX_PAGE_SIZE
  ) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await getServerDossierSection(
    session.token,
    params.id,
    params.section,
    { limit, offset },
  );

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, page: result.data });
}
