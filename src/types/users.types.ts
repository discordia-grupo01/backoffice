import type { DossierModerationAction, DossierReport } from "./dossier.types";
import type { RecoveryRequestStatus, StaffRef } from "./recovery.types";

/** `pending`: todavía no confirmó su email. */
export type UserStatus = "active" | "pending" | "suspended";

export type UserStatusFilter = "all" | UserStatus;

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  created_at: string;
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
export type DossierSection =
  "servers" | "activity" | "reports" | "moderation" | "recovery_requests";

export interface DossierMembership {
  server_id: string;
  /** `null` si admin todavía no conoce el servidor. */
  server_name: string | null;
  joined_at: string;
}

export type DossierActivityKind =
  "message_sent" | "joined_server" | "left_server";

export interface DossierActivity {
  id: string;
  kind: DossierActivityKind;
  /** Texto ya armado por el back, ej. "Envió un mensaje en #general de Gamers". */
  description: string;
  server_id: string;
  occurred_at: string;
}

export interface DossierRecoveryRequest {
  id: string;
  status: RecoveryRequestStatus;
  requested_at: string;
  resolved_at: string | null;
  resolved_by: StaffRef | null;
}

export interface DossierSectionItems {
  servers: DossierMembership;
  activity: DossierActivity;
  reports: DossierReport;
  moderation: DossierModerationAction;
  recovery_requests: DossierRecoveryRequest;
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
