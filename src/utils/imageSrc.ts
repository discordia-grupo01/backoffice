import { env } from "@/lib/env";

/**
 * Convierte la dirección de una imagen que manda admin (`avatar_url`,
 * `icon_url`) en algo que un `<img src>` puede cargar. Puede venir de dos
 * formas, según dónde guarde el archivo el servicio dueño:
 * - URL absoluta (Supabase Storage): se usa tal cual.
 * - Ruta del gateway (`/uploads/profile-images/...`, `/v1/servers/{id}/icon?v=...`):
 *   se le antepone la URL del gateway. Esas rutas no piden JWT.
 *
 * `null` si no hay imagen, así `Avatar` muestra la inicial sin pedir nada.
 */
export function imageSrc(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${env.apiUrl.replace(/\/+$/, "")}${value}`;
  return null;
}
