"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { MetricsPeriod } from "@/types/metrics.types";

import { useServerMetricsExport } from "./hooks/useServerMetricsExport";
import { periodLabel } from "./utils/metricsPeriodLabel";

interface ExportServerMetricsButtonProps {
  serverId: string;
  serverName: string;
  period: MetricsPeriod | null;
}

export function ExportServerMetricsButton({
  serverId,
  serverName,
  period,
}: ExportServerMetricsButtonProps) {
  const { isOpen, isExporting, error, request, cancel, confirm } =
    useServerMetricsExport(serverId, serverName, period);

  return (
    <>
      <Button
        size="sm"
        className="shrink-0"
        disabled={!period}
        onClick={request}
      >
        <Download size={12} aria-hidden="true" />
        <span>Exportar CSV</span>
      </Button>

      <ConfirmDialog
        open={isOpen && !!period}
        title={`¿Exportar las métricas de ${serverName || "este servidor"}?`}
        variant="primary"
        icon={Download}
        confirmLabel="Exportar CSV"
        isLoading={isExporting}
        error={error}
        onConfirm={confirm}
        onCancel={cancel}
      >
        {period ? (
          <>
            Vas a bajar los totales {periodLabel(period).toLowerCase()}:
            miembros activos, mensajes enviados y miembros nuevos.
          </>
        ) : null}
      </ConfirmDialog>
    </>
  );
}
