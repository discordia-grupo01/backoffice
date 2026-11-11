import { describe, expect, it } from "vitest";

import { serverMetricsCsvFilename } from "./serverMetricsCsvFilename";

const PERIOD = { from: "2026-10-12", to: "2026-11-11" };

describe("serverMetricsCsvFilename", () => {
  it("incluye el servidor y el período", () => {
    expect(serverMetricsCsvFilename("Gamers", PERIOD)).toBe(
      "metricas-gamers_2026-10-12_2026-11-11.csv",
    );
  });

  it("saca acentos y caracteres que no van en un nombre de archivo", () => {
    expect(serverMetricsCsvFilename("  Café & Programación!! ", PERIOD)).toBe(
      "metricas-cafe-programacion_2026-10-12_2026-11-11.csv",
    );
  });

  it("usa un nombre genérico si el servidor no tiene nombre legible", () => {
    expect(serverMetricsCsvFilename("🎮🎮", PERIOD)).toBe(
      "metricas-servidor_2026-10-12_2026-11-11.csv",
    );
  });
});
