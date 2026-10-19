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
