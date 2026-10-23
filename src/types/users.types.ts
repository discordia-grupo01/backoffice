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
