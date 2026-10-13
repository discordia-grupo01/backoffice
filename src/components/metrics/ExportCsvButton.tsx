"use client";

import { Download } from "lucide-react";

import { downloadTextFile } from "@/lib/downloadFile";
import { buildMetricsCsv, metricsCsvFilename } from "@/lib/metricsCsv";
import type { PlatformMetrics } from "@/types/metrics.types";

export function ExportCsvButton({
  metrics,
}: {
  metrics: PlatformMetrics | null;
}) {
  function handleExport() {
    if (!metrics) return;
    downloadTextFile(
      metricsCsvFilename(metrics),
      buildMetricsCsv(metrics),
      "text/csv;charset=utf-8",
    );
  }

  return (
    <button
      type="button"
      className="btn-accent font-display"
      onClick={handleExport}
      disabled={!metrics}
    >
      <Download size={16} aria-hidden="true" />
      <span>Exportar CSV</span>
    </button>
  );
}
