import type { DossierModerationAction, DossierReport } from "./dossier.types";

export interface PlatformServer {
  id: string;
  name: string;
  /** Dirección del ícono tal como la guarda servers; pasar por `imageSrc`. */
  icon_url: string | null;
  owner_id: string;
  owner_name: string | null;
  member_count: number;
  created_at: string;
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

export type ServerSuspensionAction = "suspend" | "reactivate";

export type ServerSuspensionResult =
  | { ok: true; server: PlatformServer }
  | { ok: false; status: number; code: string; message: string };

export type DeleteServerResult =
  { ok: true } | { ok: false; status: number; code: string; message: string };

export type ServerDossierSection = "reports" | "moderation";

export type ServerDossierView = ServerDossierSection | "metrics";

export interface ServerDossierSectionItems {
  reports: DossierReport;
  moderation: DossierModerationAction;
}

export interface ServerMessagingDay {
  date: string;
  messages: number;
}

export interface ServerDossierSummary {
  server: PlatformServer;
  messaging: ServerMessagingDay[];
  counts: Record<ServerDossierSection, number>;
  latest: { [S in ServerDossierSection]: ServerDossierSectionItems[S][] };
}
