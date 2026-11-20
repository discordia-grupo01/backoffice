import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const getUserDossierMock = vi.hoisted(() => vi.fn());
vi.mock("@/services/users/service", () => ({
  getUserDossier: getUserDossierMock,
}));

import { withIncidentAuthors } from "./incidentAuthors";
import type { RawIncident } from "./service";

const ANA = "a2a37e81-1cb1-4fcf-bf6f-e16fca0dd623";
const BETO = "b2a37e81-1cb1-4fcf-bf6f-e16fca0dd623";

function incident(overrides: Partial<RawIncident>): RawIncident {
  return {
    id: "i1",
    title: "Demoras",
    description: "Mensajes lentos",
    affected_services: ["messaging"],
    platform_status: "degraded",
    status: "resolved",
    created_at: "2026-11-18T21:10:00Z",
    resolved_at: "2026-11-18T22:05:00Z",
    ...overrides,
  };
}

describe("withIncidentAuthors", () => {
  beforeEach(() => {
    getUserDossierMock.mockReset();
    getUserDossierMock.mockImplementation(async (_token: string, id: string) =>
      id === ANA
        ? { ok: true, data: { user: { name: "ana", email: "ana@x.com" } } }
        : { ok: false, status: 404, message: "" },
    );
  });

  it("pide una sola vez a cada staff y completa nombre y email", async () => {
    const [first, second] = await withIncidentAuthors("token", [
      incident({ id: "i1", created_by: ANA, resolved_by: ANA }),
      incident({ id: "i2", created_by: ANA, resolved_by: BETO }),
    ]);

    expect(getUserDossierMock).toHaveBeenCalledTimes(2);
    expect(first.created_by).toEqual({
      id: ANA,
      name: "ana",
      email: "ana@x.com",
    });
    expect(second.resolved_by).toEqual({ id: BETO, name: null, email: null });
  });

  it("deja en null los incidentes viejos sin autores", async () => {
    const [old] = await withIncidentAuthors("token", [incident({})]);

    expect(getUserDossierMock).not.toHaveBeenCalled();
    expect(old.created_by).toBeNull();
    expect(old.resolved_by).toBeNull();
  });
});
