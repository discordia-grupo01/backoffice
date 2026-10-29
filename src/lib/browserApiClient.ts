import axios from "axios";

/**
 * Instancia de axios compartida por todos los `services/<x>/client.ts`.
 * Le pega al BFF (`/api/*`, mismo origen), nunca al Gateway.
 */
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  validateStatus: () => true,
});

const SESSION_CHECK_EXEMPT_PREFIX = "/auth/";
const SESSION_CHECK_TTL_MS = 2_000;

let pendingSessionCheck: Promise<void> | null = null;
let lastCheckedAt = 0;

function ensureFreshSession(): Promise<void> {
  if (pendingSessionCheck) return pendingSessionCheck;

  if (Date.now() - lastCheckedAt < SESSION_CHECK_TTL_MS) {
    return Promise.resolve();
  }

  pendingSessionCheck = api
    .get("/auth/session")
    .then(
      () => undefined,
      () => undefined,
    )
    .finally(() => {
      lastCheckedAt = Date.now();
      pendingSessionCheck = null;
    });
  return pendingSessionCheck;
}

api.interceptors.request.use(async (config) => {
  const url = config.url ?? "";
  if (!url.startsWith(SESSION_CHECK_EXEMPT_PREFIX)) {
    await ensureFreshSession();
  }
  return config;
});
