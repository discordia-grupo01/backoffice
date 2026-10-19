import { describe, expect, it } from "vitest";

import { parseViewMode } from "./useViewMode";

describe("parseViewMode", () => {
  it("acepta las dos vistas", () => {
    expect(parseViewMode("table")).toBe("table");
    expect(parseViewMode("cards")).toBe("cards");
  });

  it("ignora cualquier otro valor", () => {
    expect(parseViewMode(null)).toBeNull();
    expect(parseViewMode("grid")).toBeNull();
  });
});
