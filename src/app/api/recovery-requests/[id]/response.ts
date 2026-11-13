import { LOGIN_UNAVAILABLE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/apiClient";
import { unauthorizedResponse } from "@/lib/apiRoute";
import { destroySession } from "@/services/auth/session";
import type { RecoveryRequestDetail } from "@/types/recovery.types";

export type RecoveryRequestResponse =
  | { ok: true; request: RecoveryRequestDetail }
  | { ok: false; code?: string; message: string };

// Se reenvían con su `code` para que la pantalla explique el motivo; el resto llega como 502.
const FORWARDED_STATUSES = [403, 404, 409];

export function recoveryRequestResponse(
  result: ApiResult<RecoveryRequestDetail>,
): NextResponse<RecoveryRequestResponse> {
  if (result.ok) return NextResponse.json({ ok: true, request: result.data });

  if (result.status === 401) {
    destroySession();
    return unauthorizedResponse();
  }
  if (FORWARDED_STATUSES.includes(result.status)) {
    return NextResponse.json(
      { ok: false, code: String(result.code), message: result.message },
      { status: result.status },
    );
  }
  return NextResponse.json(
    { ok: false, code: "UNAVAILABLE", message: LOGIN_UNAVAILABLE },
    { status: 502 },
  );
}
