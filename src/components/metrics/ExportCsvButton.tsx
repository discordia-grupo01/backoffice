"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
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
    <>
      <div className="sm:hidden">
        <IconButton
          icon={Download}
          label="Exportar CSV"
          onClick={handleExport}
          disabled={!metrics}
        />
      </div>
      <Button
        size="sm"
        className="hidden sm:inline-flex"
        onClick={handleExport}
        disabled={!metrics}
      >
        <Download size={12} aria-hidden="true" />
        <span>Exportar CSV</span>
      </Button>
    </>
  );
}
