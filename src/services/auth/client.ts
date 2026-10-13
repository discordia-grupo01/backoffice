import {
  type LoginResult,
  type LoginValues,
  REQUEST_FAILED_MESSAGE,
} from "@discordia/client-shared";

import { api } from "@/lib/browserApiClient";

/**
 * Llamadas del navegador hacia el BFF (`/api/auth/*`, mismo origen).
 * Nunca pega directo a identify-service.
 */

export async function loginRequest(
  credentials: LoginValues,
): Promise<LoginResult> {
  try {
    const { data } = await api.post<LoginResult>("/auth/login", credentials);
    return data;
  } catch {
    return { ok: false, message: REQUEST_FAILED_MESSAGE };
  }
}
