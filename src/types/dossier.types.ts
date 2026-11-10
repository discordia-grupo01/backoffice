/** Piezas comunes a los expedientes de usuario y de servidor. */

export type DossierReportKind = "user" | "message";

export type DossierReportStatus = "pending" | "resolved" | "dismissed";

export interface DossierReport {
  id: string;
  reason: string;
  created_at: string;
  kind: DossierReportKind;
  status: DossierReportStatus;
  resolved_at: string | null;
  server_id: string;
  /** `null` si admin todavía no conoce el servidor. */
  server_name: string | null;
  reported_user_id: string | null;
  reported_user_name: string | null;
}

/** Las de `platform` las aplica el staff; las de `server`, los moderadores de un servidor. */
export type DossierModerationKind =
  | "suspension"
  | "reactivation"
  | "deletion_requested"
  | "ban"
  | "unban"
  | "kick"
  | "mute"
  | "unmute";

export type DossierModerationScope = "platform" | "server";

export interface DossierModerationAction {
  id: string;
  kind: DossierModerationKind;
  applied_at: string;
  scope: DossierModerationScope;
  server_id: string | null;
  server_name: string | null;
  target_user_id: string | null;
  target_user_name: string | null;
}

/** Página de una sección del expediente, tal como la devuelve el back. */
export interface DossierPage<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export type DossierSummaryResult<T> =
  { ok: true; summary: T } | { ok: false; status: number; message: string };
