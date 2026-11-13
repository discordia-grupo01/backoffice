import { INVALID_DATA_MESSAGE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import {
  parseInteger,
  unauthorizedResponse,
  upstreamFailureResponse,
} from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { listRecoveryRequests } from "@/services/recovery/service";
import {
  MAX_PAGE_SIZE,
  PAGE_SIZE,
  SEARCH_MAX_LENGTH,
} from "@/utils/pagination";
import type {
  RecoveryRequestsPage,
  RecoveryStatusFilter,
} from "@/types/recovery.types";

type RecoveryRequestsResponse =
  { ok: true; page: RecoveryRequestsPage } | { ok: false; message: string };

const STATUSES: readonly RecoveryStatusFilter[] = [
  "all",
  "pending",
  "approved",
  "rejected",
];

export async function GET(
  request: Request,
): Promise<NextResponse<RecoveryRequestsResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") ?? "").trim();
  const status = (searchParams.get("status") ?? "all") as RecoveryStatusFilter;
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

  const result = await listRecoveryRequests(session.token, {
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
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, page: result.data });
}
