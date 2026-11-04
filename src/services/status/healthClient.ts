import type { ServiceHealthResult } from "@/types/status.types";
import { mockDelay } from "@/utils/dossierMock";

import { buildMockServiceHealth } from "./mockServiceHealth";

/** Datos simulados hasta que el back exponga los health checks. */
export async function getServiceHealth(): Promise<ServiceHealthResult> {
  await mockDelay();
  return { ok: true, checks: buildMockServiceHealth() };
}
