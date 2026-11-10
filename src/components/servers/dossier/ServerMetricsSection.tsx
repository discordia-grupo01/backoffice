"use client";

import { ShieldOff } from "lucide-react";
import { useId, type ReactNode, type Ref } from "react";

import { DossierBackButton } from "@/components/dossier/DossierBackButton";
import { MetricCard } from "@/components/metrics/MetricCard";
import { MetricsPeriodBar } from "@/components/metrics/MetricsPeriodBar";
import {
  MetricsEmptyState,
  MetricsErrorState,
} from "@/components/metrics/MetricsStates";
import { Skeleton } from "@/components/ui/Skeleton";
import { StateBox } from "@/components/ui/StateBox";
import { formatInteger } from "@/utils/chartFormat";
import { formatDate } from "@/utils/formatDate";
import { parseIsoDate } from "@/utils/metricsPeriod";
import type { MetricsPeriod, ServerMetrics } from "@/types/metrics.types";

import { useServerMetrics } from "./hooks/useServerMetrics";

const CARDS_GRID = "grid grid-cols-1 gap-3 sm:grid-cols-3";

interface ServerMetricsSectionProps {
  serverId: string;
  header: ReactNode;
  onBack: () => void;
  backRef: Ref<HTMLButtonElement>;
}

export function ServerMetricsSection({
  serverId,
  header,
  onBack,
  backRef,
}: ServerMetricsSectionProps) {
  const {
    periodKey,
    setPeriodKey,
    customRange,
    setCustomRange,
    customError,
    status,
    metrics,
    retry,
  } = useServerMetrics(serverId);
  const headingId = useId();

  function renderBody() {
    if (customError) return null;
    if (status === "forbidden") {
      return (
        <StateBox role="alert" icon={ShieldOff} title="No tenés permisos">
          Las métricas son solo para el staff de Discordia. Si creés que es un
          error, contactá a un administrador.
        </StateBox>
      );
    }
    if (status === "error") return <MetricsErrorState onRetry={retry} />;
    if (status === "loading" || !metrics) {
      return (
        <div
          aria-busy="true"
          aria-label="Cargando métricas"
          className={CARDS_GRID}
        >
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-[132px] rounded-xl" />
          ))}
        </div>
      );
    }
    if (!metrics.has_activity) {
      return (
        <MetricsEmptyState title="Este servidor no tuvo actividad en el período elegido" />
      );
    }
    return <ServerMetricCards metrics={metrics} />;
  }

  return (
    <>
      {header}

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <DossierBackButton ref={backRef} onClick={onBack} />

        <section aria-labelledby={headingId} className="mt-5 space-y-4">
          <div>
            <h3 id={headingId} className="font-display text-sm font-semibold">
              Métricas de actividad
            </h3>
            <p className="text-content-muted mt-1 text-xs">
              Totales del servidor en el período elegido.
            </p>
          </div>

          <MetricsPeriodBar
            className="bg-surface-input"
            periodKey={periodKey}
            onPeriodChange={setPeriodKey}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
            customError={customError}
          />

          {renderBody()}
        </section>
      </div>
    </>
  );
}

function formatDay(isoDate: string): string {
  return formatDate(parseIsoDate(isoDate).toISOString());
}

function periodLabel({ from, to }: MetricsPeriod): string {
  if (from === to) return `El ${formatDay(from)}`;
  return `Del ${formatDay(from)} al ${formatDay(to)}`;
}

function ServerMetricCards({ metrics }: { metrics: ServerMetrics }) {
  return (
    <div className="space-y-2">
      <p className="text-content-muted text-xs tabular-nums">
        {periodLabel(metrics.period)}
      </p>
      <div className={CARDS_GRID}>
        <MetricCard
          inset
          label="Miembros activos"
          value={formatInteger(metrics.active_members)}
          hint="Mandaron mensajes, entraron o salieron del servidor"
          accentVar="--chart-1"
        />
        <MetricCard
          inset
          label="Mensajes enviados"
          value={formatInteger(metrics.messages_sent)}
          hint="En todos los canales del servidor"
          accentVar="--success"
        />
        <MetricCard
          inset
          label="Miembros nuevos"
          value={formatInteger(metrics.new_members)}
          hint="Se unieron al servidor"
          accentVar="--info"
        />
      </div>
    </div>
  );
}
