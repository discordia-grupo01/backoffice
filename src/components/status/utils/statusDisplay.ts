import type { IncidentType, PlatformStatus } from "@/types/status.types";

interface Tone {
  label: string;
  soft: string;
  solid: string;
}

export const PLATFORM_STATUS_DISPLAY: Record<
  PlatformStatus,
  Tone & {
    headline: string;
    surface: string;
    text: string;
    ring: string;
  }
> = {
  operational: {
    label: "Operativo",
    headline: "Todos los sistemas operativos",
    soft: "bg-success/15 text-success-readable",
    solid: "bg-success",
    surface: "bg-success/8 border-success/30",
    ring: "ring-success/20",
    text: "text-success-readable",
  },
  degraded: {
    label: "Degradado",
    headline: "Servicio degradado",
    soft: "bg-warning/15 text-warning-readable",
    solid: "bg-warning",
    surface: "bg-warning/8 border-warning/30",
    ring: "ring-warning/20",
    text: "text-warning-readable",
  },
  maintenance: {
    label: "En mantenimiento",
    headline: "En mantenimiento",
    soft: "bg-info/15 text-info",
    solid: "bg-info",
    surface: "bg-info/8 border-info/30",
    ring: "ring-info/20",
    text: "text-info",
  },
};

export const SERVICE_DOWN_DISPLAY = {
  soft: "bg-danger/15 text-danger-readable",
  solid: "bg-danger",
  surface: "bg-danger/8 border-danger/30",
  text: "text-danger-readable",
  ring: "ring-danger/20",
};

export const INCIDENT_TYPE_DISPLAY: Record<IncidentType, Tone> = {
  degraded: {
    label: "Degradación",
    soft: PLATFORM_STATUS_DISPLAY.degraded.soft,
    solid: PLATFORM_STATUS_DISPLAY.degraded.solid,
  },
  maintenance: {
    label: "Mantenimiento",
    soft: PLATFORM_STATUS_DISPLAY.maintenance.soft,
    solid: PLATFORM_STATUS_DISPLAY.maintenance.solid,
  },
};

export function activeIncidentsLabel(count: number): string {
  if (count === 0) return "Sin incidentes activos";
  return `${count} ${count === 1 ? "incidente activo" : "incidentes activos"}`;
}

/** `hace 25 min`, `hace 3 h`; relativo a `now`. */
export function formatSince(isoDate: string, now = Date.now()): string {
  const minutes = Math.max(
    0,
    Math.floor((now - new Date(isoDate).getTime()) / 60_000),
  );
  if (minutes < 1) return "recién";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.floor(hours / 24)} d`;
}

export function userNoticeLabel(count: number): string {
  if (count === 0) return "Los usuarios no ven ningún aviso.";
  return count === 1
    ? "Los usuarios ven el aviso en la app."
    : "Los usuarios ven los avisos en la app.";
}
