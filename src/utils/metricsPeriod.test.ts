import { describe, expect, it } from "vitest";

import {
  periodToRange,
  presetPeriod,
  validateCustomRange,
} from "./metricsPeriod";

const NOW = new Date(2026, 9, 12, 22, 30);

describe("presetPeriod", () => {
  it("hoy es un solo día", () => {
    expect(presetPeriod("today", NOW)).toEqual({
      from: "2026-10-12",
      to: "2026-10-12",
    });
  });

  it("7 días incluye hoy", () => {
    expect(presetPeriod("7d", NOW)).toEqual({
      from: "2026-10-06",
      to: "2026-10-12",
    });
  });

  it("90 días cruza meses", () => {
    expect(presetPeriod("90d", NOW).from).toBe("2026-07-15");
  });
});

describe("validateCustomRange", () => {
  it("acepta un rango válido", () => {
    expect(
      validateCustomRange({ from: "2026-10-01", to: "2026-10-12" }, NOW),
    ).toBeNull();
  });

  it("pide ambas fechas", () => {
    expect(validateCustomRange({ from: "", to: "2026-10-12" }, NOW)).toBe(
      "incomplete",
    );
  });

  it("rechaza inicio posterior al fin", () => {
    expect(
      validateCustomRange({ from: "2026-10-10", to: "2026-10-01" }, NOW),
    ).toBe("inverted");
  });

  it("rechaza fin futuro", () => {
    expect(
      validateCustomRange({ from: "2026-10-01", to: "2026-10-13" }, NOW),
    ).toBe("future");
  });
});

describe("validateCustomRange con el tope del back", () => {
  it("acepta 366 días", () => {
    expect(
      validateCustomRange({ from: "2025-10-12", to: "2026-10-12" }, NOW),
    ).toBeNull();
  });

  it("rechaza más de 366 días", () => {
    expect(
      validateCustomRange({ from: "2025-10-11", to: "2026-10-12" }, NOW),
    ).toBe("too_long");
  });
});

describe("periodToRange", () => {
  it("arranca a la medianoche local del primer día", () => {
    const range = periodToRange({ from: "2026-10-06", to: "2026-10-12" }, NOW);

    expect(range.from).toBe(new Date(2026, 9, 6).toISOString());
  });

  it("si el período termina hoy, corta en ahora", () => {
    const range = periodToRange({ from: "2026-10-06", to: "2026-10-12" }, NOW);

    expect(range.to).toBe(NOW.toISOString());
  });

  it("si termina antes de hoy, corta a la medianoche siguiente", () => {
    const range = periodToRange({ from: "2026-10-01", to: "2026-10-03" }, NOW);

    expect(range.to).toBe(new Date(2026, 9, 4).toISOString());
  });
});
