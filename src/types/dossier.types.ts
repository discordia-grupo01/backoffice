/** Piezas comunes a los expedientes de usuario y de servidor. */

export interface DossierReport {
  id: string;
  reason: string;
  created_at: string;
}

export type DossierModerationKind = "suspension" | "reactivation";

export interface DossierModerationAction {
  id: string;
  kind: DossierModerationKind;
  applied_at: string;
}

export type DossierSummaryResult<T> =
  { ok: true; summary: T } | { ok: false; status: number; message: string };
