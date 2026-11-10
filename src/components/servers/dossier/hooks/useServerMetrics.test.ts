import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getServerMetrics } from "@/services/metrics/client";
import type { ServerMetrics } from "@/types/metrics.types";

import { useServerMetrics } from "./useServerMetrics";

vi.mock("@/services/metrics/client", () => ({
  getServerMetrics: vi.fn(),
}));

const mockedGet = vi.mocked(getServerMetrics);

const METRICS: ServerMetrics = {
  period: { from: "2026-11-04", to: "2026-11-10" },
  active_members: 12,
  messages_sent: 340,
  new_members: 3,
  has_activity: true,
};

describe("useServerMetrics", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("pide las métricas del servidor para el período elegido", async () => {
    mockedGet.mockResolvedValue({ ok: true, metrics: METRICS });

    const { result } = renderHook(() => useServerMetrics("s1"));

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.metrics).toEqual(METRICS);
    expect(mockedGet).toHaveBeenCalledWith("s1", result.current.period);
  });

  it("un 403 es falta de permisos, no un error", async () => {
    mockedGet.mockResolvedValue({ ok: false, status: 403, message: "x" });

    const { result } = renderHook(() => useServerMetrics("s1"));

    await waitFor(() => expect(result.current.status).toBe("forbidden"));
  });

  it("reintenta después de un error", async () => {
    mockedGet.mockResolvedValueOnce({ ok: false, status: 502, message: "x" });
    mockedGet.mockResolvedValueOnce({ ok: true, metrics: METRICS });

    const { result } = renderHook(() => useServerMetrics("s1"));
    await waitFor(() => expect(result.current.status).toBe("error"));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it("no pide nada mientras el rango personalizado sea inválido", async () => {
    mockedGet.mockResolvedValue({ ok: true, metrics: METRICS });
    const { result } = renderHook(() => useServerMetrics("s1"));
    await waitFor(() => expect(result.current.status).toBe("success"));

    act(() => {
      result.current.setPeriodKey("custom");
      result.current.setCustomRange({ from: "", to: "" });
    });

    expect(result.current.customError).toBe("incomplete");
    expect(mockedGet).toHaveBeenCalledTimes(1);
  });
});
