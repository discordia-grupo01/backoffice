import { describe, expect, it } from "vitest";

import { offsetOfPage, resultsLabel } from "./pagination";

describe("offsetOfPage", () => {
  it("la primera página empieza en 0", () => {
    expect(offsetOfPage(1, 15)).toBe(0);
  });

  it("avanza de a un tamaño de página", () => {
    expect(offsetOfPage(3, 15)).toBe(30);
  });
});

describe("resultsLabel", () => {
  it("cuenta los resultados si entran en una página", () => {
    expect(resultsLabel(1, 10, 0)).toBe("0 resultados");
    expect(resultsLabel(1, 10, 1)).toBe("1 resultado");
    expect(resultsLabel(1, 10, 10)).toBe("10 resultados");
  });

  it("muestra el rango de la página si hay más de una", () => {
    expect(resultsLabel(1, 10, 26)).toBe("1-10 de 26");
    expect(resultsLabel(3, 10, 26)).toBe("21-26 de 26");
  });
});
