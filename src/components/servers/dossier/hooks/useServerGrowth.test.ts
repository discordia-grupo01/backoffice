import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getServerGrowth } from "@/services/metrics/client";
import type { MetricsPeriod, ServerGrowth } from "@/types/metrics.types";

import { useServerGrowth } from "./useServerGrowth";

vi.mock("@/services/metrics/client", () => ({
  getServerGrowth: vi.fn(),
}));

const mockedGet = vi.mocked(getServerGrowth);

const PERIOD: MetricsPeriod = { from: "2026-11-04", to: "2026-11-10" };

const GROWTH: ServerGrowth = {
  period: PERIOD,
  points: [
    { date: "2026-11-04", members: 8 },
    { date: "2026-11-05", members: 11 },
  ],
};

describe("useServerGrowth", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("pide el crecimiento del servidor para el período", async () => {
    mockedGet.mockResolvedValue({ ok: true, growth: GROWTH });

    const { result } = renderHook(() => useServerGrowth("s1", PERIOD));

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.growth).toEqual(GROWTH);
    expect(mockedGet).toHaveBeenCalledWith("s1", PERIOD);
  });

  it("un 403 es falta de permisos, no un error", async () => {
    mockedGet.mockResolvedValue({ ok: false, status: 403, message: "x" });

    const { result } = renderHook(() => useServerGrowth("s1", PERIOD));

    await waitFor(() => expect(result.current.status).toBe("forbidden"));
  });

  it("reintenta después de un error", async () => {
    mockedGet.mockResolvedValueOnce({ ok: false, status: 502, message: "x" });
    mockedGet.mockResolvedValueOnce({ ok: true, growth: GROWTH });

    const { result } = renderHook(() => useServerGrowth("s1", PERIOD));
    await waitFor(() => expect(result.current.status).toBe("error"));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it("sin período no pide nada", () => {
    renderHook(() => useServerGrowth("s1", null));

    expect(mockedGet).not.toHaveBeenCalled();
  });
});
