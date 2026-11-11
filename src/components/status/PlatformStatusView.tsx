"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { usePlatformStatusContext } from "@/contexts/PlatformStatusContext";

import { useIncidentForm } from "./hooks/useIncidentForm";
import { usePlatformStatus } from "./hooks/usePlatformStatus";
import { useResolveIncident } from "./hooks/useResolveIncident";
import { IncidentFormDialog } from "./IncidentFormDialog";
import { IncidentList } from "./IncidentList";
import { ServiceHealthPanel } from "./ServiceHealthPanel";
import { StatusErrorState, StatusSkeleton } from "./StatusStates";
import { StatusSummaryCard } from "./StatusSummaryCard";
import { findUnreportedFailures } from "./utils/serviceHealth";

export function PlatformStatusView() {
  const { load, data, retry, refresh, markForbidden } = usePlatformStatus();
  const [success, setSuccess] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const { health } = usePlatformStatusContext();

  const form = useIncidentForm({
    onPublished: () => {
      void refresh();
      setSuccess({
        title: "Incidente publicado",
        message: "Los usuarios ya ven el aviso en la app.",
      });
    },
    onForbidden: markForbidden,
  });

  const resolution = useResolveIncident({
    onResolved: () => {
      void refresh();
      setSuccess({
        title: "Incidente resuelto",
        message: "El aviso dejó de mostrarse a los usuarios.",
      });
    },
    onForbidden: markForbidden,
  });

  if (load === "forbidden" || health.phase === "forbidden") {
    return <NoStaffAccess />;
  }

  const unreported =
    health.phase === "ready" && data
      ? findUnreportedFailures(health.checks, data.incidents)
      : [];

  return (
    <>
      <PanelHeader
        title="Estado de la plataforma"
        subtitle="Publicá incidentes y supervisá los servicios de la plataforma"
      />

      <PanelBody>
        {load === "loading" || health.phase === "loading" ? (
          <StatusSkeleton />
        ) : load === "error" || !data ? (
          <StatusErrorState onRetry={retry} />
        ) : (
          <div className="space-y-5">
            <StatusSummaryCard
              status={data.status}
              activeCount={data.incidents.length}
              unreported={unreported}
              onPublishUnreported={() => form.open({ services: unreported })}
            />
            <IncidentList
              onPublish={() => form.open()}
              incidents={data.incidents}
              onResolve={resolution.request}
            />
            <ServiceHealthPanel state={health} unreported={unreported} />
          </div>
        )}
      </PanelBody>

      <IncidentFormDialog
        open={form.isOpen}
        draft={form.draft}
        errors={form.errors}
        isSubmitting={form.isSubmitting}
        error={form.error}
        onChange={form.update}
        onSubmit={form.submit}
        onClose={form.close}
      />

      <ConfirmDialog
        open={resolution.pending !== null}
        title={`¿Resolver “${resolution.pending?.title ?? ""}”?`}
        confirmLabel="Resolver"
        variant="positive"
        icon={CircleCheck}
        isLoading={resolution.isSubmitting}
        error={resolution.error}
        onConfirm={resolution.confirm}
        onCancel={resolution.cancel}
      >
        El aviso dejará de mostrarse a todos los usuarios.
      </ConfirmDialog>

      <SuccessDialog
        open={success !== null}
        title={success?.title ?? ""}
        onClose={() => setSuccess(null)}
      >
        {success?.message}
      </SuccessDialog>
    </>
  );
}
