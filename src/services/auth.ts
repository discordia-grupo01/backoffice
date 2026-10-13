import { env } from "@/lib/env";

export type LoginResult = { ok: true } | { ok: false; message: string };

export const INVALID_CREDENTIALS = "Correo o contraseña incorrectos.";
export const LOGIN_UNAVAILABLE =
  "No pudimos conectar con el servidor. Intentá de nuevo en unos minutos.";

export interface LoginValues {
  email: string;
  password: string;
}

export type LoginErrors = Partial<Record<keyof LoginValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  if (!email.trim()) errors.email = "Ingresá tu correo electrónico.";
  else if (!EMAIL_PATTERN.test(email.trim()))
    errors.email = "El correo electrónico no es válido.";
  if (!password) errors.password = "Ingresá tu contraseña.";
  return errors;
}

export async function loginRequest(values: LoginValues): Promise<LoginResult> {
  try {
    const res = await fetch(`${env.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.status === 400 || res.status === 401) {
      return { ok: false, message: INVALID_CREDENTIALS };
    }
    if (!res.ok) return { ok: false, message: LOGIN_UNAVAILABLE };
    return { ok: true };
  } catch {
    return { ok: false, message: LOGIN_UNAVAILABLE };
  }
}
