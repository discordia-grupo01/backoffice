import { describe, expect, it } from "vitest";

import { parseMetricsRange } from "./apiRoute";

function params(values: Record<string, string>) {
  return new URLSearchParams(values);
}

describe("parseMetricsRange", () => {
  it("devuelve el rango si los dos son instantes y from va antes", () => {
    const range = {
      from: "2026-11-04T03:00:00.000Z",
      to: "2026-11-10T15:00:00.000Z",
    };
    expect(parseMetricsRange(params(range))).toEqual(range);
  });

  it("rechaza si falta alguno", () => {
    expect(parseMetricsRange(params({ from: "2026-11-04T03:00:00Z" }))).toBe(
      null,
    );
  });

  it("rechaza fechas que no se pueden leer", () => {
    expect(
      parseMetricsRange(params({ from: "ayer", to: "2026-11-10T15:00:00Z" })),
    ).toBeNull();
  });

  it("rechaza si from no va antes que to", () => {
    const same = "2026-11-10T15:00:00Z";
    expect(parseMetricsRange(params({ from: same, to: same }))).toBeNull();
  });
});
