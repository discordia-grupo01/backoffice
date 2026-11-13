import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { exportServerMetrics } from "@/services/metrics/client";
import type { MetricsPeriod } from "@/types/metrics.types";

import { downloadTextFile } from "../../utils/downloadFile";
import { useServerMetricsExport } from "./useServerMetricsExport";

vi.mock("@/services/metrics/client", () => ({
  exportServerMetrics: vi.fn(),
}));
vi.mock("../../utils/downloadFile", () => ({
  downloadTextFile: vi.fn(),
}));

const mockedExport = vi.mocked(exportServerMetrics);
const mockedDownload = vi.mocked(downloadTextFile);

const PERIOD: MetricsPeriod = { from: "2026-10-12", to: "2026-11-11" };
const CSV = "from,to,active_members,messages_sent,new_members\n";

function renderExport(period: MetricsPeriod | null = PERIOD) {
  return renderHook(() => useServerMetricsExport("s1", "Gamers", period));
}

describe("useServerMetricsExport", () => {
  beforeEach(() => {
    mockedExport.mockReset();
    mockedDownload.mockReset();
  });

  it("no pide nada hasta que se confirma", () => {
    const { result } = renderExport();

    act(() => result.current.request());

    expect(result.current.isOpen).toBe(true);
    expect(mockedExport).not.toHaveBeenCalled();
  });

  it("al confirmar descarga el CSV del back y cierra", async () => {
    mockedExport.mockResolvedValue({ ok: true, csv: CSV });
    const { result } = renderExport();

    act(() => result.current.request());
    await act(() => result.current.confirm());

    expect(mockedExport).toHaveBeenCalledWith("s1", PERIOD);
    expect(mockedDownload).toHaveBeenCalledWith(
      "metricas-gamers_2026-10-12_2026-11-11.csv",
      CSV,
      "text/csv;charset=utf-8",
    );
    expect(result.current.isOpen).toBe(false);
  });

  it("con un 403 avisa que faltan permisos y no descarga", async () => {
    mockedExport.mockResolvedValue({ ok: false, status: 403, message: "x" });
    const { result } = renderExport();

    act(() => result.current.request());
    await act(() => result.current.confirm());

    expect(result.current.isOpen).toBe(true);
    expect(result.current.error).toMatch(/permisos/);
    expect(mockedDownload).not.toHaveBeenCalled();
  });

  it("con otro error deja reintentar", async () => {
    mockedExport.mockResolvedValueOnce({
      ok: false,
      status: 502,
      message: "x",
    });
    mockedExport.mockResolvedValueOnce({ ok: true, csv: CSV });
    const { result } = renderExport();

    act(() => result.current.request());
    await act(() => result.current.confirm());
    expect(result.current.error).toMatch(/Intentá de nuevo/);

    await act(() => result.current.confirm());
    expect(mockedDownload).toHaveBeenCalledTimes(1);
    expect(result.current.isOpen).toBe(false);
  });

  it("sin período válido no abre la confirmación", () => {
    const { result } = renderExport(null);

    act(() => result.current.request());

    expect(result.current.isOpen).toBe(false);
  });
});
