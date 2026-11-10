import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMetricsPeriod } from "./useMetricsPeriod";

describe("useMetricsPeriod", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 10, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("arranca en 7 días", () => {
    const { result } = renderHook(() => useMetricsPeriod());

    expect(result.current.periodKey).toBe("7d");
    expect(result.current.period).toEqual({
      from: "2026-11-04",
      to: "2026-11-10",
    });
  });

  it("con un preset no valida el rango personalizado", () => {
    const { result } = renderHook(() => useMetricsPeriod());

    act(() => result.current.setCustomRange({ from: "", to: "" }));

    expect(result.current.customError).toBeNull();
    expect(result.current.period).not.toBeNull();
  });

  it("con un rango personalizado inválido no hay período", () => {
    const { result } = renderHook(() => useMetricsPeriod());

    act(() => {
      result.current.setPeriodKey("custom");
      result.current.setCustomRange({ from: "2026-11-09", to: "2026-11-01" });
    });

    expect(result.current.customError).toBe("inverted");
    expect(result.current.period).toBeNull();
  });

  it("con un rango personalizado válido lo usa tal cual", () => {
    const { result } = renderHook(() => useMetricsPeriod());
    const range = { from: "2026-11-01", to: "2026-11-05" };

    act(() => {
      result.current.setPeriodKey("custom");
      result.current.setCustomRange(range);
    });

    expect(result.current.customError).toBeNull();
    expect(result.current.period).toEqual(range);
  });
});
