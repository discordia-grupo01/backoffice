import { describe, expect, it } from "vitest";

import type { PlatformUser } from "@/types/users.types";

import {
  buildMockDossierSection,
  buildMockDossierSummary,
} from "./mockUserDossier";

const NOW = new Date("2026-10-26T00:00:00Z").getTime();

function userWith(id: string, patch: Partial<PlatformUser> = {}): PlatformUser {
  return {
    id,
    name: `Usuario ${id}`,
    email: `${id}@example.com`,
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    suspended_at: null,
    ...patch,
  };
}

const IDS = Array.from({ length: 40 }, (_, index) => `user-${index}`);

describe("buildMockDossierSummary", () => {
  it("cuenta lo mismo que trae cada pestaña", () => {
    for (const id of IDS) {
      const user = userWith(id);
      const { counts } = buildMockDossierSummary(user, 3, NOW);
      expect(counts.servers).toBe(
        buildMockDossierSection(user, "servers", NOW).length,
      );
      expect(counts.reports).toBe(
        buildMockDossierSection(user, "reports", NOW).length,
      );
    }
  });

  it("devuelve lo mismo para el mismo usuario", () => {
    const user = userWith("user-7");
    expect(buildMockDossierSummary(user, 3, NOW)).toEqual(
      buildMockDossierSummary(user, 3, NOW),
    );
  });

  it("deja algunas cuentas sin servidores para ver el estado vacío", () => {
    const empty = IDS.filter(
      (id) =>
        buildMockDossierSummary(userWith(id), 3, NOW).counts.servers === 0,
    );
    expect(empty.length).toBeGreaterThan(0);
  });
});

describe("buildMockDossierSummary: lo más reciente", () => {
  it("trae como mucho `previewSize` por sección, empezando por el más nuevo", () => {
    for (const id of IDS) {
      const user = userWith(id);
      const { latest } = buildMockDossierSummary(user, 3, NOW);
      const activity = buildMockDossierSection(user, "activity", NOW);
      expect(latest.activity).toEqual(activity.slice(0, 3));
      expect(latest.servers.length).toBeLessThanOrEqual(3);
    }
  });
});

describe("buildMockDossierSection: moderación", () => {
  it("una cuenta suspendida tiene como última acción la suspensión, con su fecha", () => {
    for (const id of IDS) {
      const suspendedAt = "2026-10-01T12:00:00Z";
      const user = userWith(id, {
        status: "suspended",
        suspended_at: suspendedAt,
      });
      const [latest] = buildMockDossierSection(user, "moderation", NOW);
      expect(latest.kind).toBe("suspension");
      expect(latest.applied_at).toBe(suspendedAt);
    }
  });

  it("una cuenta activa nunca termina en suspensión", () => {
    for (const id of IDS) {
      const [latest] = buildMockDossierSection(userWith(id), "moderation", NOW);
      if (latest) expect(latest.kind).toBe("reactivation");
    }
  });
});

describe("buildMockDossierSection: fechas", () => {
  it("nada es anterior a la fecha de registro", () => {
    const user = userWith("user-3", { created_at: "2026-10-20T00:00:00Z" });
    const created = new Date(user.created_at).getTime();
    for (const item of buildMockDossierSection(user, "activity", NOW)) {
      expect(new Date(item.occurred_at).getTime()).toBeGreaterThanOrEqual(
        created,
      );
    }
  });
});

describe("buildMockDossierSummary: última actividad", () => {
  it("es la fecha de la actividad más reciente, o null si no tiene", () => {
    for (const id of IDS) {
      const user = userWith(id);
      const { last_activity_at } = buildMockDossierSummary(user, 3, NOW);
      const [latest] = buildMockDossierSection(user, "activity", NOW);
      expect(last_activity_at).toBe(latest?.occurred_at ?? null);
    }
  });
});
