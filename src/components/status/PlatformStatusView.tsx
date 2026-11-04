"use client";

import { CircleCheck } from "lucide-react";
import { useCallback, useState } from "react";

import { NoStaffAccess } from "@/components/layout/NoStaffAccess";
import { PanelBody } from "@/components/layout/PanelBody";
import { PanelHeader } from "@/components/layout/PanelHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";

import { useIncidentForm } from "./hooks/useIncidentForm";
import { usePlatformStatus } from "./hooks/usePlatformStatus";
import { useResolveIncident } from "./hooks/useResolveIncident";
import { IncidentFormDialog } from "./IncidentFormDialog";
import { IncidentList } from "./IncidentList";
import { PlatformStatusPill } from "./PlatformStatusPill";
import { StatusErrorState, StatusSkeleton } from "./StatusStates";
import { StatusSummaryCard } from "./StatusSummaryCard";

export function PlatformStatusView() {
  const { load, data, retry, refresh, markForbidden } = usePlatformStatus();
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const form = useIncidentForm({
    onPublished: () => {
      void refresh();
      setToast("Incidente publicado. Los usuarios ya ven el aviso.");
    },
    onForbidden: markForbidden,
  });

  const resolution = useResolveIncident({
    onResolved: () => {
      void refresh();
      setToast("Incidente resuelto. El aviso dejó de mostrarse.");
    },
    onForbidden: markForbidden,
  });

  if (load === "forbidden") return <NoStaffAccess />;

  return (
    <>
      <PanelHeader
        title="Estado de la plataforma"
        subtitle="Disponibilidad e incidentes"
      >
        {load === "success" && data ? (
          <PlatformStatusPill status={data.status} />
        ) : null}
      </PanelHeader>

      <PanelBody>
        <p className="text-content-muted mb-5 text-sm">
          Comunicá incidencias y supervisá la disponibilidad de Discordia.
        </p>

        {load === "loading" ? (
          <StatusSkeleton />
        ) : load === "error" || !data ? (
          <StatusErrorState onRetry={retry} />
        ) : (
          <div className="space-y-5">
            <StatusSummaryCard
              status={data.status}
              activeCount={data.incidents.length}
              onPublish={form.open}
            />
            <IncidentList
              incidents={data.incidents}
              onResolve={resolution.request}
            />
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

      <Toast message={toast} onClose={closeToast} />
    </>
  );
}
