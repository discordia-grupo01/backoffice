import { describe, expect, it } from "vitest";

import { buildMetricsCsv, metricsCsvFilename } from "./metricsCsv";
import type { PlatformMetrics } from "@/types/metrics.types";

const METRICS: PlatformMetrics = {
  period: { from: "2026-10-11", to: "2026-10-12" },
  granularity: "day",
  totals: { active_users: 150, servers_created: 30, messages_sent: 3000 },
  series: [
    {
      date: "2026-10-11",
      active_users: 100,
      servers_created: 10,
      messages_sent: 1000,
    },
    {
      date: "2026-10-12",
      active_users: 120,
      servers_created: 20,
      messages_sent: 2000,
    },
  ],
};

describe("buildMetricsCsv", () => {
  it("arma encabezado, una fila por día y el total", () => {
    const lines = buildMetricsCsv(METRICS).replace("﻿", "").split("\r\n");

    expect(lines).toEqual([
      "Fecha,Usuarios activos,Servidores creados,Mensajes enviados",
      "2026-10-11,100,10,1000",
      "2026-10-12,120,20,2000",
      "Total del período,150,30,3000",
    ]);
  });

  it("empieza con BOM para que Excel respete los acentos", () => {
    expect(buildMetricsCsv(METRICS).startsWith("﻿")).toBe(true);
  });

  it("usa 'Hora' cuando la serie es horaria", () => {
    const hourly = {
      ...METRICS,
      granularity: "hour" as const,
      series: [{ ...METRICS.series[0], date: "2026-10-12T09:00" }],
    };
    const [header, row] = buildMetricsCsv(hourly)
      .replace("﻿", "")
      .split("\r\n");

    expect(header.startsWith("Hora,")).toBe(true);
    expect(row.startsWith("2026-10-12 09:00,")).toBe(true);
  });
});

describe("metricsCsvFilename", () => {
  it("incluye el período", () => {
    expect(metricsCsvFilename(METRICS)).toBe(
      "metricas-discordia_2026-10-11_2026-10-12.csv",
    );
  });
});
