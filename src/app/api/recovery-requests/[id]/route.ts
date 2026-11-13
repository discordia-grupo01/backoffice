import { NextResponse } from "next/server";

import { unauthorizedResponse } from "@/lib/apiRoute";
import { getValidSession } from "@/services/auth/session";
import { getRecoveryRequest } from "@/services/recovery/service";

import {
  recoveryRequestResponse,
  type RecoveryRequestResponse,
} from "./response";

type RouteContext = { params: { id: string } };

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<NextResponse<RecoveryRequestResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  return recoveryRequestResponse(
    await getRecoveryRequest(session.token, params.id),
  );
}
