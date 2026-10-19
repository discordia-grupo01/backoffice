import {
  INVALID_DATA_MESSAGE,
  LOGIN_UNAVAILABLE,
} from "@discordia/client-shared";

import { NextResponse } from "next/server";

import { parseInteger, unauthorizedResponse } from "@/lib/apiRoute";
import { destroySession, getSession } from "@/services/auth/session";
import { listUsers } from "@/services/users/service";
import {
  MAX_PAGE_SIZE,
  PAGE_SIZE,
  SEARCH_MAX_LENGTH,
} from "@/utils/pagination";
import type { UsersPage, UserStatusFilter } from "@/types/users.types";

type UsersResponse =
  { ok: true; page: UsersPage } | { ok: false; message: string };

const STATUSES: readonly UserStatusFilter[] = ["all", "active", "suspended"];

export async function GET(
  request: Request,
): Promise<NextResponse<UsersResponse>> {
  const session = getSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") ?? "").trim();
  const status = (searchParams.get("status") ?? "all") as UserStatusFilter;
  const limit = parseInteger(searchParams.get("limit"), PAGE_SIZE);
  const offset = parseInteger(searchParams.get("offset"), 0);

  if (
    limit === null ||
    offset === null ||
    limit < 1 ||
    limit > MAX_PAGE_SIZE ||
    !STATUSES.includes(status) ||
    search.length > SEARCH_MAX_LENGTH
  ) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  const result = await listUsers(session.token, {
    search,
    status,
    limit,
    offset,
  });

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
