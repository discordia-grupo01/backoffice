import type { BadgeTone } from "@/components/ui/Badge";
import type {
  Incident,
  PlatformServiceId,
  ServiceHealth,
  ServiceHealthCheck,
} from "@/types/status.types";

export const SERVICE_HEALTH_DISPLAY: Record<
  ServiceHealth,
  { label: string; tone: BadgeTone }
> = {
  healthy: { label: "Saludable", tone: "success" },
  unavailable: { label: "No disponible", tone: "danger" },
  no_data: { label: "Sin datos", tone: "neutral" },
};

export function findUnreportedFailures(
  checks: readonly ServiceHealthCheck[],
  incidents: readonly Incident[],
): PlatformServiceId[] {
  const reported = new Set(
    incidents.flatMap((incident) => incident.affected_services),
  );
  return checks
    .filter(
      (check) => check.health === "unavailable" && !reported.has(check.service),
    )
    .map((check) => check.service);
}

function joinNames(labels: readonly string[]): string {
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} y ${labels.at(-1)}`;
}

export function unreportedFailuresHeadline(labels: readonly string[]): string {
  return labels.length === 1
    ? `${labels[0]} no está disponible`
    : `${joinNames(labels)} no están disponibles`;
}

export function unreportedFailuresHint(activeCount: number): string {
  if (activeCount === 0) {
    return "Los usuarios todavía no ven ningún aviso. Publicá un incidente para avisarles.";
  }
  const notice =
    activeCount === 1 ? "el aviso publicado" : "los avisos publicados";
  return `Los usuarios ven ${notice}, pero no saben de esta falla. Publicá un incidente para avisarles.`;
}

export function servicesDownLabel(count: number): string {
  return count === 1
    ? "1 servicio no disponible"
    : `${count} servicios no disponibles`;
}

export function checkedAgoLabel(isoDate: string, now = Date.now()): string {
  const seconds = Math.max(
    0,
    Math.floor((now - new Date(isoDate).getTime()) / 1000),
  );
  if (seconds < 60) return `hace ${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  return `hace ${Math.floor(minutes / 60)} h`;
}
