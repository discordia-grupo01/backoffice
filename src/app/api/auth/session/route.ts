import { NextResponse } from "next/server";

import { getValidSession } from "@/services/auth/session";

export async function GET(): Promise<NextResponse<{ ok: boolean }>> {
  const session = await getValidSession();
  return NextResponse.json({ ok: session !== null }, { status: 200 });
}
