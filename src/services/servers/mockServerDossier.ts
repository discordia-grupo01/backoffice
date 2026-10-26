import {
  mockModerationHistory,
  mockReports,
  startOfToday,
} from "@/utils/dossierMock";
import { addDays, toIsoDate } from "@/utils/metricsPeriod";
import { seeded } from "@/utils/seeded";
import type {
  PlatformServer,
  ServerDossierSection,
  ServerDossierSectionItems,
  ServerDossierSummary,
  ServerMessagingDay,
} from "@/types/servers.types";

export const MESSAGING_DAYS = 7;

const REPORT_REASONS = [
  "Contenido de odio publicado por un miembro",
  "Spam coordinado en varios canales",
  "Acoso entre miembros",
  "Contenido no permitido en un canal público",
  "Enlaces de phishing compartidos",
  "Raid organizado desde el servidor",
];

/**
 * Mensajes por día de la última semana. Sale del tamaño del servidor, con un
 * pico ocasional para que se vea cómo luce algo raro. No hay mensajes antes de
 * que existiera ni mientras está suspendido.
 */
function messaging(server: PlatformServer, now: number): ServerMessagingDay[] {
  const today = new Date(now);
  const created = toIsoDate(new Date(server.created_at));
  const suspended = server.suspended_at
    ? toIsoDate(new Date(server.suspended_at))
    : null;
  const base = Math.max(3, Math.round(server.member_count * 1.8));
  const spikeDay = Math.floor(seeded(`${server.id}:spike`) * MESSAGING_DAYS);
  const hasSpike = seeded(`${server.id}:has-spike`) < 0.4;

  return Array.from({ length: MESSAGING_DAYS }, (_, index) => {
    const date = toIsoDate(addDays(today, index - (MESSAGING_DAYS - 1)));
    if (date < created || (suspended && date >= suspended)) {
      return { date, messages: 0 };
    }
    const noise = 0.5 + seeded(`${server.id}:messages:${date}`);
    const spike = hasSpike && index === spikeDay ? 4 : 1;
    return { date, messages: Math.round(base * noise * spike) };
  });
}

function reports(server: PlatformServer, now: number) {
  return mockReports(server, now, REPORT_REASONS, server.suspended_at ? 10 : 5);
}

type SectionBuilders = {
  [S in ServerDossierSection]: (
    server: PlatformServer,
    now: number,
  ) => ServerDossierSectionItems[S][];
};

const BUILDERS: SectionBuilders = {
  reports,
  moderation: mockModerationHistory,
};

export function buildMockServerDossierSection<S extends ServerDossierSection>(
  server: PlatformServer,
  section: S,
  now: number = startOfToday(),
): ServerDossierSectionItems[S][] {
  return BUILDERS[section](server, now);
}

export function buildMockServerDossierSummary(
  server: PlatformServer,
  previewSize: number,
  now: number = startOfToday(),
): ServerDossierSummary {
  const serverReports = reports(server, now);
  const serverModeration = mockModerationHistory(server, now);

  return {
    server,
    messaging: messaging(server, now),
    counts: {
      reports: serverReports.length,
      moderation: serverModeration.length,
    },
    latest: {
      reports: serverReports.slice(0, previewSize),
      moderation: serverModeration.slice(0, previewSize),
    },
  };
}
