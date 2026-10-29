import type { DossierModerationAction, DossierReport } from "./dossier.types";

export interface PlatformServer {
  id: string;
  name: string;
  owner_id: string;
  /** `null` si el perfil del dueño todavía no llegó a la réplica del back. */
  owner_name: string | null;
  member_count: number;
  created_at: string;
  /** Cuándo se suspendió; ausente o `null` si está activo. El back todavía no lo devuelve (US 69). */
  suspended_at?: string | null;
}

export interface ServersQuery {
  search: string;
  limit: number;
  offset: number;
}

export interface ServersPage {
  servers: PlatformServer[];
  total: number;
  limit: number;
  offset: number;
}

export type ServersResult =
  | { ok: true; page: ServersPage }
  | { ok: false; status: number; message: string };

/** Secciones del expediente de un servidor que se listan y paginan. */
export type ServerDossierSection = "reports" | "moderation";

export interface ServerDossierSectionItems {
  reports: DossierReport;
  moderation: DossierModerationAction;
}

/** Mensajes enviados en el servidor en un día (`date` en `YYYY-MM-DD`). */
export interface ServerMessagingDay {
  date: string;
  messages: number;
}

/** Expediente resumido de un servidor: datos, mensajería reciente y, por sección, el total y lo más reciente. */
export interface ServerDossierSummary {
  server: PlatformServer;
  /** Últimos 7 días, del más viejo al más nuevo. */
  messaging: ServerMessagingDay[];
  counts: Record<ServerDossierSection, number>;
  latest: { [S in ServerDossierSection]: ServerDossierSectionItems[S][] };
}
