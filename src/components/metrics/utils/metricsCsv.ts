import Papa from "papaparse";

import type { PlatformMetrics } from "@/types/metrics.types";

const BOM = "﻿";

export function metricsCsvFilename({ period }: PlatformMetrics): string {
  return `metricas-discordia_${period.from}_${period.to}.csv`;
}

/**
 * CSV de las métricas del período: una fila por punto de la serie y una última
 * con los totales. El BOM hace que Excel respete los acentos.
 */
export function buildMetricsCsv(metrics: PlatformMetrics): string {
  const dateHeader = metrics.granularity === "hour" ? "Hora" : "Fecha";

  const rows = [
    ...metrics.series.map((point) => [
      point.date.replace("T", " "),
      point.active_users,
      point.servers_created,
      point.messages_sent,
    ]),
    [
      "Total del período",
      metrics.totals.active_users,
      metrics.totals.servers_created,
      metrics.totals.messages_sent,
    ],
  ];

  const csv = Papa.unparse(
    {
      fields: [
        dateHeader,
        "Usuarios activos",
        "Servidores creados",
        "Mensajes enviados",
      ],
      data: rows,
    },
    { newline: "\r\n", escapeFormulae: true },
  );

  return BOM + csv;
}
