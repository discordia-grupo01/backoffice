import { INVALID_DATA_MESSAGE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import {
  parseInteger,
  unauthorizedResponse,
  upstreamFailureResponse,
} from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { withIncidentAuthors } from "@/services/status/incidentAuthors";
import { createIncident, listIncidentHistory } from "@/services/status/service";
import type {
  IncidentHistoryPage,
  IncidentHistoryQuery,
  IncidentServiceFilter,
  IncidentTypeFilter,
} from "@/types/status.types";
import {
  INCIDENT_TYPES,
  isServiceId,
  toIncidentInput,
} from "@/utils/incidents";
import {
  MAX_PAGE_SIZE,
  PAGE_SIZE,
  SEARCH_MAX_LENGTH,
} from "@/utils/pagination";

type HistoryResponse =
  { ok: true; page: IncidentHistoryPage } | { ok: false; message: string };

type CreateResponse = { ok: true } | { ok: false; message: string };

function toHistoryQuery(params: URLSearchParams): IncidentHistoryQuery | null {
  const search = (params.get("search") ?? "").trim();
  const type = (params.get("type") ?? "all") as IncidentTypeFilter;
  const service = (params.get("service") ?? "all") as IncidentServiceFilter;
  const from = params.get("from") ?? "";
  const limit = parseInteger(params.get("limit"), PAGE_SIZE);
  const offset = parseInteger(params.get("offset"), 0);

  if (
    limit === null ||
    offset === null ||
    limit < 1 ||
    limit > MAX_PAGE_SIZE ||
    [...search].length > SEARCH_MAX_LENGTH ||
    (type !== "all" && !INCIDENT_TYPES.includes(type)) ||
    (service !== "all" && !isServiceId(service)) ||
    (from !== "" && Number.isNaN(Date.parse(from)))
  ) {
    return null;
  }

  return {
    search,
    type,
    service,
    from: from ? new Date(from).toISOString() : undefined,
    limit,
    offset,
  };
}

export async function GET(
  request: Request,
): Promise<NextResponse<HistoryResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const query = toHistoryQuery(new URL(request.url).searchParams);
  if (!query) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await listIncidentHistory(session.token, query);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  const incidents = await withIncidentAuthors(
    session.token,
    result.data.incidents,
  );
  return NextResponse.json({
    ok: true,
    page: { incidents, total: result.data.total },
  });
}

export async function POST(
  request: Request,
): Promise<NextResponse<CreateResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const input = toIncidentInput(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await createIncident(session.token, input);

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
