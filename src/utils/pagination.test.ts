import { describe, expect, it } from "vitest";

import { offsetOfPage, rangeLabel, totalLabel } from "./pagination";

describe("offsetOfPage", () => {
  it("la primera página empieza en 0", () => {
    expect(offsetOfPage(1, 15)).toBe(0);
  });

  it("avanza de a un tamaño de página", () => {
    expect(offsetOfPage(3, 15)).toBe(30);
  });
});

describe("totalLabel", () => {
  it("cuenta los resultados en singular o plural", () => {
    expect(totalLabel(0)).toBe("0 resultados");
    expect(totalLabel(1)).toBe("1 resultado");
    expect(totalLabel(26)).toBe("26 resultados");
  });
});

describe("rangeLabel", () => {
  it("muestra el rango de la página actual", () => {
    expect(rangeLabel(1, 10, 26)).toBe("1-10 de 26");
    expect(rangeLabel(3, 10, 26)).toBe("21-26 de 26");
  });
});
