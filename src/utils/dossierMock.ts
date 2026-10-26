import { seeded } from "@/utils/seeded";
import type {
  DossierModerationAction,
  DossierReport,
} from "@/types/dossier.types";

/** Lo mínimo que los mocks de expediente necesitan de lo investigado (usuario o servidor). */
export interface MockDossierSubject {
  id: string;
  created_at: string;
  suspended_at?: string | null;
}

/** Elementos más recientes que trae el resumen de cada sección. */
export const DOSSIER_PREVIEW_SIZE = 3;

const MOCK_DELAY_MS = 450;

/** Demora de red simulada, para ver los estados de carga. */
export function mockDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export const HOUR_MS = 3_600_000;
export const DAY_MS = 24 * HOUR_MS;

export function startOfToday(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

export function pick<T>(list: readonly T[], seed: string): T {
  return list[Math.floor(seeded(seed) * list.length)];
}

/** Cantidad estable para una sección; un cuarto de las veces es 0, para ver los estados vacíos. */
export function countFor(
  subject: MockDossierSubject,
  section: string,
  max: number,
): number {
  const roll = seeded(`${subject.id}:${section}:count`);
  if (roll < 0.25) return 0;
  return 1 + Math.floor(((roll - 0.25) / 0.75) * max);
}

/** Momento `index` pasos hacia atrás desde `now`, con una hora variable y sin pasar la fecha de alta. */
export function backInTime(
  subject: MockDossierSubject,
  now: number,
  index: number,
  stepMs: number,
): string {
  const created = new Date(subject.created_at).getTime();
  const jitter = seeded(`${subject.id}:${index}:${stepMs}`) * stepMs * 0.8;
  return new Date(
    Math.max(created, now - index * stepMs - jitter),
  ).toISOString();
}

export function mockReports(
  subject: MockDossierSubject,
  now: number,
  reasons: readonly string[],
  max: number,
): DossierReport[] {
  const total = countFor(subject, "reports", max);
  return Array.from({ length: total }, (_, index) => ({
    id: `rep-${subject.id}-${index}`,
    reason: pick(reasons, `${subject.id}:report:${index}`),
    created_at: backInTime(subject, now, index * 4, DAY_MS),
  }));
}

/** Del más nuevo al más viejo, alternando suspensión y reactivación, y terminando en el estado actual. */
export function mockModerationHistory(
  subject: MockDossierSubject,
  now: number,
): DossierModerationAction[] {
  const isSuspended = Boolean(subject.suspended_at);
  const rounds = Math.floor(seeded(`${subject.id}:moderation`) * 3);
  const total = isSuspended ? rounds * 2 + 1 : rounds * 2;

  return Array.from({ length: total }, (_, index) => {
    const isSuspension = isSuspended ? index % 2 === 0 : index % 2 === 1;
    const appliedAt =
      index === 0 && subject.suspended_at
        ? subject.suspended_at
        : backInTime(subject, now, index * 20 + 3, DAY_MS);
    return {
      id: `mod-${subject.id}-${index}`,
      kind: isSuspension ? "suspension" : "reactivation",
      applied_at: appliedAt,
    };
  });
}
