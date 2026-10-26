import {
  backInTime,
  countFor,
  HOUR_MS,
  mockModerationHistory,
  mockReports,
  pick,
  startOfToday,
} from "@/utils/dossierMock";
import { seeded } from "@/utils/seeded";
import type {
  DossierModerationAction,
  DossierReport,
} from "@/types/dossier.types";
import type {
  DossierActivity,
  DossierMembership,
  DossierSection,
  DossierSectionItems,
  PlatformUser,
  UserDossierSummary,
} from "@/types/users.types";

const SERVER_NAMES = [
  "CommunityWorld",
  "GamersHub ES",
  "TechProgrammers",
  "DarkZone Network",
  "Lofi & Café",
  "Club de Lectura",
  "Speedrunners AR",
  "Diseño UX/UI",
  "Fútbol Total",
  "Pixel Art Studio",
  "Rol en Vivo",
  "Música Indie",
  "Ciencia de Datos",
  "Anime Latam",
  "Estudio Compartido",
  "Minecraft Builders",
  "Fotografía Analógica",
  "Cripto Charla",
  "Cocina sin Vueltas",
  "Ajedrez Online",
  "Viajeros",
  "Memes Selectos",
  "Programación Competitiva",
  "Series y Pelis",
];

const CHANNELS = ["general", "off-topic", "soporte", "memes", "anuncios"];

const REPORT_REASONS = [
  "Spam en canales públicos",
  "Acoso a otro miembro",
  "Lenguaje ofensivo reiterado",
  "Contenido no permitido",
  "Suplantación de identidad",
  "Enlaces sospechosos",
];

function memberships(user: PlatformUser): DossierMembership[] {
  const total = countFor(user, "servers", SERVER_NAMES.length - 1);
  const offset = Math.floor(seeded(`${user.id}:servers`) * SERVER_NAMES.length);
  return Array.from({ length: total }, (_, index) => {
    const position = (offset + index) % SERVER_NAMES.length;
    return {
      server_id: `srv-${position}`,
      server_name: SERVER_NAMES[position],
    };
  });
}

function activity(user: PlatformUser, now: number): DossierActivity[] {
  const servers = memberships(user);
  if (servers.length === 0) return [];

  // Una cuenta suspendida no puede entrar: su actividad termina el día de la suspensión.
  const lastSeen = user.suspended_at
    ? new Date(user.suspended_at).getTime()
    : now;
  const total = countFor(user, "activity", 38);
  return Array.from({ length: total }, (_, index) => {
    const seed = `${user.id}:activity:${index}`;
    const server = pick(servers, `${seed}:server`).server_name;
    const roll = seeded(seed);
    const description =
      roll < 0.7
        ? `Envió un mensaje en #${pick(CHANNELS, `${seed}:channel`)} de ${server}`
        : roll < 0.9
          ? "Inició sesión"
          : `Se unió a ${server}`;
    return {
      id: `act-${user.id}-${index}`,
      description,
      occurred_at: backInTime(user, lastSeen, index, 7 * HOUR_MS),
    };
  });
}

function reports(user: PlatformUser, now: number): DossierReport[] {
  if (memberships(user).length === 0) return [];
  return mockReports(
    user,
    now,
    REPORT_REASONS,
    user.status === "suspended" ? 12 : 4,
  );
}

function moderation(
  user: PlatformUser,
  now: number,
): DossierModerationAction[] {
  return mockModerationHistory(user, now);
}

type SectionBuilders = {
  [S in DossierSection]: (
    user: PlatformUser,
    now: number,
  ) => DossierSectionItems[S][];
};

const BUILDERS: SectionBuilders = {
  servers: memberships,
  activity,
  reports,
  moderation,
};

/** Todos los elementos de una sección, del más nuevo al más viejo. */
export function buildMockDossierSection<S extends DossierSection>(
  user: PlatformUser,
  section: S,
  now: number = startOfToday(),
): DossierSectionItems[S][] {
  return BUILDERS[section](user, now);
}

/** Respuesta simulada del expediente resumido: totales y los `previewSize` más recientes de cada sección. */
export function buildMockDossierSummary(
  user: PlatformUser,
  previewSize: number,
  now: number = startOfToday(),
): UserDossierSummary {
  const servers = memberships(user);
  const userActivity = activity(user, now);
  const userReports = reports(user, now);
  const userModeration = moderation(user, now);

  return {
    user,
    last_activity_at: userActivity[0]?.occurred_at ?? null,
    counts: {
      servers: servers.length,
      activity: userActivity.length,
      reports: userReports.length,
      moderation: userModeration.length,
    },
    latest: {
      servers: servers.slice(0, previewSize),
      activity: userActivity.slice(0, previewSize),
      reports: userReports.slice(0, previewSize),
      moderation: userModeration.slice(0, previewSize),
    },
  };
}
