"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { downloadTextFile } from "@/utils/downloadFile";
import {
  buildMetricsCsv,
  metricsCsvFilename,
} from "@/components/metrics/utils/metricsCsv";
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
    <Button
      className="w-auto gap-1.5 rounded-lg px-3 py-1.5 text-xs max-[480px]:flex-1"
      onClick={handleExport}
      disabled={!metrics}
    >
      <Download size={12} aria-hidden="true" />
      <span>Exportar CSV</span>
    </Button>
  );
}
