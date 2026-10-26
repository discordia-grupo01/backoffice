export type UserStatus = "active" | "suspended";

export type UserStatusFilter = "all" | UserStatus;

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  created_at: string;
  /** Cuándo se suspendió; `null` si está activo. */
  suspended_at: string | null;
}

export interface UsersQuery {
  search: string;
  status: UserStatusFilter;
  limit: number;
  offset: number;
}

export interface UsersPage {
  users: PlatformUser[];
  total: number;
  limit: number;
  offset: number;
}

export type UsersResult =
  | { ok: true; page: UsersPage }
  | { ok: false; status: number; message: string };

/** Secciones del expediente de un usuario. */
export type DossierSection = "servers" | "activity" | "reports" | "moderation";

export interface DossierMembership {
  server_id: string;
  server_name: string;
}

export interface DossierActivity {
  id: string;
  /** Texto ya armado por el back, ej. "Envió un mensaje en #general". */
  description: string;
  occurred_at: string;
}

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

export interface DossierSectionItems {
  servers: DossierMembership;
  activity: DossierActivity;
  reports: DossierReport;
  moderation: DossierModerationAction;
}

export interface UserDossierSummary {
  user: PlatformUser;
  last_activity_at: string | null;
  counts: Record<DossierSection, number>;
  latest: { [S in DossierSection]: DossierSectionItems[S][] };
}

export type SuspensionAction = "suspend" | "reactivate";

export type SuspensionResult =
  | { ok: true; user: PlatformUser }
  | { ok: false; status: number; code: string; message: string };
