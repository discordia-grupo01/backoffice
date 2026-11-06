import { NextResponse } from "next/server";

import { unauthorizedResponse, upstreamFailureResponse } from "@/lib/apiRoute";
import { destroySession, getValidSession } from "@/services/auth/session";
import { apiRequest } from "@/lib/apiClient";

type SocketTicketResponse =
  { ok: true; ticket: string } | { ok: false; message: string };

export async function POST(): Promise<NextResponse<SocketTicketResponse>> {
  const session = await getValidSession();
  if (!session) return unauthorizedResponse();

  const result = await apiRequest<{ ticket: string }>(
    "/v1/notifications/socket-tickets",
    { token: session.token, method: "POST" },
  );
  if (!result.ok) {
    if (result.status === 401) {
      destroySession();
      return unauthorizedResponse();
    }
    return upstreamFailureResponse(result.status);
  }

  return NextResponse.json({ ok: true, ticket: result.data.ticket });
}
