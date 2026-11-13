"use client";

import { ShieldOff } from "lucide-react";
import { useId, type ReactNode } from "react";

import { MetricCard } from "@/components/metrics/MetricCard";
import { MetricsPeriodBar } from "@/components/metrics/MetricsPeriodBar";
import { MetricsErrorState } from "@/components/metrics/MetricsStates";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { StateBox } from "@/components/ui/StateBox";
import type { ServerMetrics } from "@/types/metrics.types";

import { ExportServerMetricsButton } from "./ExportServerMetricsButton";
import { useServerMetrics } from "./hooks/useServerMetrics";
import { MemberGrowthCard } from "./MemberGrowthCard";
import { periodLabel } from "./utils/metricsPeriodLabel";

const CARDS_GRID = "grid grid-cols-1 gap-3 sm:grid-cols-3";

interface ServerMetricsSectionProps {
  serverId: string;
  serverName: string;
  header: ReactNode;
}

export function ServerMetricsSection({
  serverId,
  serverName,
  header,
}: ServerMetricsSectionProps) {
  const {
    periodKey,
    setPeriodKey,
    customRange,
    setCustomRange,
    customError,
    period,
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
      return <ServerNoActivity />;
    }
    return <ServerMetricCards metrics={metrics} />;
  }

  return (
    <>
      {header}

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <section aria-labelledby={headingId} className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 id={headingId} className="font-display text-sm font-semibold">
                Métricas de actividad
              </h3>
              <p className="text-content-muted mt-1 text-xs">
                Totales del servidor en el período elegido.
              </p>
            </div>
            {status === "forbidden" ? null : (
              <ExportServerMetricsButton
                serverId={serverId}
                serverName={serverName}
                period={period}
              />
            )}
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

          {customError || status === "forbidden" ? null : (
            <MemberGrowthCard
              serverId={serverId}
              period={period}
              showPeriodHint={metrics?.has_activity !== false}
            />
          )}
        </section>
      </div>
    </>
  );
}

function ServerNoActivity() {
  return (
    <Card role="status" className="bg-surface-input rounded-xl p-4">
      <p className="text-sm font-semibold">Sin actividad en este período</p>
      <p className="text-content-muted mt-0.5 text-xs">
        Nadie mandó mensajes, entró ni salió del servidor. Probá con un rango de
        fechas más amplio.
      </p>
    </Card>
  );
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
          value={metrics.active_members}
          hint="Mandaron mensajes, entraron o salieron del servidor"
          accentVar="--chart-1"
        />
        <MetricCard
          inset
          label="Mensajes enviados"
          value={metrics.messages_sent}
          hint="En todos los canales del servidor"
          accentVar="--success"
        />
        <MetricCard
          inset
          label="Miembros nuevos"
          value={metrics.new_members}
          hint="Se unieron al servidor"
          accentVar="--info"
        />
      </div>
    </div>
  );
}
