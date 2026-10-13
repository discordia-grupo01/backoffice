export const APP_NAME = "Discordia";
export const BACKOFFICE_NAME = "Backoffice";

/**
 * Cookie httpOnly donde vive la sesion (JWT + datos del usuario). Distinta a la
 * de web-client: las cookies se comparten entre puertos de un mismo host, asi
 * que con el mismo nombre las dos apps se pisarian la sesion en localhost.
 */
export const SESSION_COOKIE = "discordia_backoffice_session";

/** Clave para almacenar el tema en el localStorage. */
export const THEME_STORAGE_KEY = "discordia:theme";

/** Rutas de la app. Centralizadas para no hardcodear strings sueltos. */
export const ROUTES = {
  root: "/",
  login: "/login",
  /** Landing despues de iniciar sesion: el dashboard de metricas. */
  home: "/dashboard",
  users: "/users",
} as const;
