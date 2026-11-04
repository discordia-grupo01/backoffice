import { describe, expect, it } from "vitest";

import { activeIncidentsLabel, formatSince } from "./statusDisplay";

describe("activeIncidentsLabel", () => {
  it("usa singular, plural y el caso vacío", () => {
    expect(activeIncidentsLabel(0)).toBe("Sin incidentes activos");
    expect(activeIncidentsLabel(1)).toBe("1 incidente activo");
    expect(activeIncidentsLabel(3)).toBe("3 incidentes activos");
  });
});

describe("formatSince", () => {
  const now = Date.parse("2026-11-03T12:00:00Z");

  it("muestra minutos, horas y días", () => {
    expect(formatSince("2026-11-03T11:59:40Z", now)).toBe("recién");
    expect(formatSince("2026-11-03T11:35:00Z", now)).toBe("hace 25 min");
    expect(formatSince("2026-11-03T09:00:00Z", now)).toBe("hace 3 h");
    expect(formatSince("2026-11-01T12:00:00Z", now)).toBe("hace 2 d");
  });
});
