import { INVALID_DATA_MESSAGE } from "@discordia/client-shared";

import { NextResponse } from "next/server";

import { unauthorizedResponse } from "@/lib/apiRoute";
import { getValidSession } from "@/services/auth/session";
import { resolveRecoveryRequest } from "@/services/recovery/service";
import type { RecoveryDecision } from "@/types/recovery.types";

import {
  recoveryRequestResponse,
  type RecoveryRequestResponse,
} from "../response";

type RouteContext = { params: { id: string; decision: string } };

function isDecision(value: string): value is RecoveryDecision {
  return value === "approve" || value === "reject";
}

export async function POST(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<RecoveryRequestResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  if (!isDecision(params.decision)) {
    return NextResponse.json(
      { ok: false, message: INVALID_DATA_MESSAGE },
      { status: 400 },
    );
  }

  return recoveryRequestResponse(
    await resolveRecoveryRequest(session.token, params.id, params.decision),
  );
}
