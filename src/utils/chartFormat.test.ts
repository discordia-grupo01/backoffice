import { describe, expect, it } from "vitest";

import { formatMetricValue } from "./chartFormat";

describe("formatMetricValue", () => {
  it("muestra completo hasta 999.999.999", () => {
    expect(formatMetricValue(999_999_999)).toEqual({
      display: "999.999.999",
      exact: null,
    });
  });

  it("abrevia desde mil millones y guarda el número exacto", () => {
    expect(formatMetricValue(1_284_930_000)).toEqual({
      display: "1285\u00a0M",
      exact: "1.284.930.000",
    });
  });

  it("aguanta el máximo que puede mandar el back (int64)", () => {
    const max = JSON.parse("9223372036854775807") as number;
    const { display, exact } = formatMetricValue(max);

    expect(display).toBe("9.223.372\u00a0B");
    expect(exact).toBe("9.223.372.036.854.776.000");
  });
});
