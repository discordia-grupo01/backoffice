import { describe, expect, it } from "vitest";

import { summarizeGrowth } from "./memberGrowthSummary";

describe("summarizeGrowth", () => {
  it("toma los miembros del último día y el cambio desde el primero", () => {
    expect(
      summarizeGrowth([
        { date: "2026-11-01", members: 8 },
        { date: "2026-11-02", members: 11 },
        { date: "2026-11-03", members: 6 },
      ]),
    ).toEqual({ members: 6, change: -2, since: "2026-11-01" });
  });

  it("con un solo día no hay cambio que medir", () => {
    expect(summarizeGrowth([{ date: "2026-11-10", members: 8 }])).toEqual({
      members: 8,
      change: null,
      since: "2026-11-10",
    });
  });

  it("sin puntos no hay resumen", () => {
    expect(summarizeGrowth([])).toBeNull();
  });
});
