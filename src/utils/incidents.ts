import type {
  IncidentInput,
  IncidentType,
  PlatformServiceId,
} from "@/types/status.types";

export const INCIDENT_TITLE_MAX = 160;
export const INCIDENT_DESCRIPTION_MAX = 5000;

export const PLATFORM_SERVICES: readonly {
  id: PlatformServiceId;
  label: string;
}[] = [
  { id: "identify", label: "Identidad y autenticación" },
  { id: "servers", label: "Servidores y canales" },
  { id: "messaging", label: "Mensajería" },
  { id: "notifications", label: "Notificaciones" },
  { id: "voice", label: "Voz" },
  { id: "admin", label: "Administración" },
  { id: "metrics", label: "Métricas" },
];

const INCIDENT_TYPES: readonly IncidentType[] = ["degraded", "maintenance"];

export function serviceLabel(id: string): string {
  return PLATFORM_SERVICES.find((service) => service.id === id)?.label ?? id;
}

function isServiceId(value: unknown): value is PlatformServiceId {
  return PLATFORM_SERVICES.some((service) => service.id === value);
}

export interface IncidentDraft {
  title: string;
  description: string;
  services: PlatformServiceId[];
  type: IncidentType;
}

export interface IncidentDraftErrors {
  title?: string;
  description?: string;
  services?: string;
}

export function validateIncidentDraft(
  draft: IncidentDraft,
): IncidentDraftErrors {
  const errors: IncidentDraftErrors = {};
  const title = draft.title.trim();
  const description = draft.description.trim();

  if (!title) errors.title = "Ingresá un título para el incidente.";
  else if ([...title].length > INCIDENT_TITLE_MAX)
    errors.title = `El título puede tener hasta ${INCIDENT_TITLE_MAX} caracteres.`;

  if (!description)
    errors.description =
      "Explicá qué está ocurriendo y cómo afecta a los usuarios.";
  else if ([...description].length > INCIDENT_DESCRIPTION_MAX)
    errors.description = `La descripción puede tener hasta ${INCIDENT_DESCRIPTION_MAX} caracteres.`;

  if (draft.services.length === 0)
    errors.services = "Seleccioná al menos un servicio afectado.";

  return errors;
}

export function hasDraftErrors(errors: IncidentDraftErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function draftToInput(draft: IncidentDraft): IncidentInput {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    affected_services: draft.services,
    platform_status: draft.type,
  };
}

/** Valida el body que llega al BFF; `null` si no es un incidente válido. */
export function toIncidentInput(body: unknown): IncidentInput | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;

  if (
    typeof raw.title !== "string" ||
    typeof raw.description !== "string" ||
    !Array.isArray(raw.affected_services) ||
    !raw.affected_services.every(isServiceId) ||
    !INCIDENT_TYPES.includes(raw.platform_status as IncidentType)
  ) {
    return null;
  }

  const draft: IncidentDraft = {
    title: raw.title,
    description: raw.description,
    services: [...new Set(raw.affected_services)],
    type: raw.platform_status as IncidentType,
  };
  return hasDraftErrors(validateIncidentDraft(draft))
    ? null
    : draftToInput(draft);
}
