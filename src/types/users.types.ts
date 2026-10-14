export type UserStatus = "active" | "suspended";

export type UserStatusFilter = "all" | UserStatus;

/** Fila del listado de usuarios de la plataforma. */
export interface PlatformUser {
  id: string;
  displayName: string;
  /** Nombre de usuario con discriminador, p. ej. `luna_star#0091`. */
  username: string;
  email: string;
  /** Fecha de alta, `YYYY-MM-DD`. */
  registeredAt: string;
  status: UserStatus;
  reportsCount: number;
  serversCount: number;
}

export interface UserFilters {
  /** Texto libre: se compara contra nombre, usuario y email. */
  query: string;
  status: UserStatusFilter;
}
