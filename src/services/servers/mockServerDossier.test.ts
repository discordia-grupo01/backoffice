import { describe, expect, it } from "vitest";

import type { PlatformServer } from "@/types/servers.types";

import {
  buildMockServerDossierSection,
  buildMockServerDossierSummary,
  MESSAGING_DAYS,
} from "./mockServerDossier";

const NOW = new Date(2026, 9, 26).getTime();

function serverWith(
  id: string,
  patch: Partial<PlatformServer> = {},
): PlatformServer {
  return {
    id,
    name: `Servidor ${id}`,
    owner_id: "owner-1",
    owner_name: "Dueña",
    member_count: 120,
    created_at: "2025-01-10T10:00:00Z",
    suspended_at: null,
    ...patch,
  };
}

const IDS = Array.from({ length: 40 }, (_, index) => `srv-${index}`);

describe("buildMockServerDossierSummary: mensajería", () => {
  it("trae los últimos 7 días, del más viejo a hoy", () => {
    const { messaging } = buildMockServerDossierSummary(
      serverWith("srv-1"),
      3,
      NOW,
    );
    expect(messaging).toHaveLength(MESSAGING_DAYS);
    expect(messaging.at(-1)?.date).toBe("2026-10-26");
    expect(messaging[0].date).toBe("2026-10-20");
  });

  it("no hay mensajes antes de que existiera el servidor", () => {
    const server = serverWith("srv-2", {
      created_at: new Date(2026, 9, 24, 12).toISOString(),
    });
    const { messaging } = buildMockServerDossierSummary(server, 3, NOW);
    const before = messaging.filter((day) => day.date < "2026-10-24");
    expect(before.every((day) => day.messages === 0)).toBe(true);
  });

  it("no hay mensajes desde el día de la suspensión", () => {
    const server = serverWith("srv-3", {
      suspended_at: new Date(2026, 9, 23, 9).toISOString(),
    });
    const { messaging } = buildMockServerDossierSummary(server, 3, NOW);
    const after = messaging.filter((day) => day.date >= "2026-10-23");
    expect(after.every((day) => day.messages === 0)).toBe(true);
  });
});

describe("buildMockServerDossierSummary: secciones", () => {
  it("cuenta lo mismo que trae cada sección y adelanta como mucho `previewSize`", () => {
    for (const id of IDS) {
      const server = serverWith(id);
      const { counts, latest } = buildMockServerDossierSummary(server, 3, NOW);
      const all = buildMockServerDossierSection(server, "reports", NOW);
      expect(counts.reports).toBe(all.length);
      expect(latest.reports).toEqual(all.slice(0, 3));
    }
  });

  it("un servidor suspendido tiene como última acción la suspensión, con su fecha", () => {
    const suspendedAt = "2026-10-01T12:00:00Z";
    for (const id of IDS) {
      const server = serverWith(id, { suspended_at: suspendedAt });
      const [latest] = buildMockServerDossierSection(server, "moderation", NOW);
      expect(latest.kind).toBe("suspension");
      expect(latest.applied_at).toBe(suspendedAt);
    }
  });
});
