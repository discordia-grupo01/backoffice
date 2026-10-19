import {
  INVALID_DATA_MESSAGE,
  LOGIN_UNAVAILABLE,
} from "@discordia/client-shared";

import { NextResponse } from "next/server";

import { parseInteger, unauthorizedResponse } from "@/lib/apiRoute";
import { destroySession, getSession } from "@/services/auth/session";
import { listServers } from "@/services/servers/service";
import {
  MAX_PAGE_SIZE,
  PAGE_SIZE,
  SEARCH_MAX_LENGTH,
} from "@/utils/pagination";
import type { ServersPage } from "@/types/servers.types";

type ServersResponse =
  { ok: true; page: ServersPage } | { ok: false; message: string };

export async function GET(
  request: Request,
): Promise<NextResponse<ServersResponse>> {
  const session = getSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") ?? "").trim();
  const limit = parseInteger(searchParams.get("limit"), PAGE_SIZE);
  const offset = parseInteger(searchParams.get("offset"), 0);

  if (
    limit === null ||
    offset === null ||
    limit < 1 ||
    limit > MAX_PAGE_SIZE ||
    search.length > SEARCH_MAX_LENGTH
  ) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await listServers(session.token, { search, limit, offset });

  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    if (result.status === 403) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { ok: false, message: LOGIN_UNAVAILABLE },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, page: result.data });
}
