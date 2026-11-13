"use client";

import { useState } from "react";

import { ROUTES } from "@/lib/constants";
import { exportServerMetrics } from "@/services/metrics/client";
import type { MetricsPeriod } from "@/types/metrics.types";

import { downloadTextFile } from "../../utils/downloadFile";
import { serverMetricsCsvFilename } from "../utils/serverMetricsCsvFilename";

const FORBIDDEN_ERROR = "No tenés permisos de staff para exportar métricas.";
const GENERIC_ERROR = "No pudimos exportar las métricas. Intentá de nuevo.";

export function useServerMetricsExport(
  serverId: string,
  serverName: string,
  period: MetricsPeriod | null,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function request() {
    if (!period) return;
    setError(undefined);
    setIsOpen(true);
  }

  function cancel() {
    if (isExporting) return;
    setIsOpen(false);
  }

  async function confirm() {
    if (!period || isExporting) return;
    setIsExporting(true);
    setError(undefined);

    const result = await exportServerMetrics(serverId, period);
    setIsExporting(false);

    if (result.ok) {
      downloadTextFile(
        serverMetricsCsvFilename(serverName, period),
        result.csv,
        "text/csv;charset=utf-8",
      );
      setIsOpen(false);
      return;
    }
    if (result.status === 401) {
      window.location.href = ROUTES.login;
      return;
    }
    setError(result.status === 403 ? FORBIDDEN_ERROR : GENERIC_ERROR);
  }

  return { isOpen, isExporting, error, request, cancel, confirm };
}
