import { describe, expect, it } from "vitest";

import { historyPeriodStart } from "./historyPeriod";

describe("historyPeriodStart", () => {
  const now = Date.parse("2026-11-20T12:00:00Z");

  it("no pone fecha de inicio para el historial completo", () => {
    expect(historyPeriodStart("all", now)).toBeUndefined();
  });

  it("resta los días del período", () => {
    expect(historyPeriodStart("7d", now)).toBe("2026-11-13T12:00:00.000Z");
    expect(historyPeriodStart("30d", now)).toBe("2026-10-21T12:00:00.000Z");
  });
});
