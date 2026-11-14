"use client";

import { AlertTriangle, SearchX, ShieldOff, X } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

import { userDossierHref } from "@/components/dossier/DossierCards";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Fact, FactGrid } from "@/components/ui/Fact";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { StateBox } from "@/components/ui/StateBox";
import { UserStatusBadge } from "@/components/users/UserStatusBadge";
import { publishRecoveryRequestsChange } from "@/lib/recoveryRequestsChange";
import type { RecoveryRequestDetail } from "@/types/recovery.types";
import { formatDate, formatDateTime } from "@/utils/formatDate";
import { imageSrc } from "@/utils/imageSrc";
import {
  previousRequestsText,
  requesterName,
  resolutionText,
} from "@/utils/recoveryText";

import { useRecoveryDecision } from "./hooks/useRecoveryDecision";
import {
  useRecoveryRequest,
  type RecoveryRequestStatus,
} from "./hooks/useRecoveryRequest";
import { useToast } from "./hooks/useToast";
import { RecoveryDecisionDialog } from "./RecoveryDecisionDialog";
import { RecoveryStatusBadge } from "./RecoveryStatusBadge";
import { RecoveryToast } from "./RecoveryToast";

const LINK_CLASS =
  "focus-visible:ring-bo inline-block rounded-md text-[13px] font-semibold text-[color-mix(in_srgb,var(--bo-accent)_65%,var(--text))] hover:underline focus-visible:ring-2 focus-visible:outline-none";

interface RecoveryRequestDialogProps {
  requestId: string | null;
  onClose: () => void;
}

export function RecoveryRequestDialog({
  requestId,
  onClose,
}: RecoveryRequestDialogProps) {
  const titleId = useId();
  const { status, request, reload, replace } = useRecoveryRequest(requestId);
  const { toast, visible, show } = useToast();
  const decision = useRecoveryDecision({
    onSettled: (result, message) => {
      show(message);
      if (result.ok) replace(result.request);
      else reload();
      publishRecoveryRequestsChange();
    },
  });
  const name = request ? requesterName(request) : "";

  return (
    <>
      <Dialog
        open={requestId !== null}
        onClose={onClose}
        labelledBy={titleId}
        className="sm:h-fit sm:max-h-[min(100dvh-3rem,46rem)] sm:w-[min(100vw-3rem,40rem)]"
      >
        <header className="border-line flex items-center gap-3 border-b px-5 py-4">
          {request ? (
            <Avatar
              name={name}
              src={imageSrc(request.user?.avatar_url)}
              size={44}
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="font-display truncate text-xl leading-tight font-semibold tracking-tight"
            >
              <span className="sr-only">Solicitud de recuperación de </span>
              {name}
            </h2>
            {request?.user ? (
              <p className="text-content-muted truncate font-mono text-xs">
                {request.user.email}
              </p>
            ) : null}
          </div>
          {request ? <RecoveryStatusBadge status={request.status} /> : null}
          <div className="-mr-1">
            <IconButton
              icon={X}
              label="Cerrar solicitud"
              showTooltip={false}
              onClick={onClose}
            />
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <RecoveryRequestBody
            status={status}
            request={request}
            onRetry={reload}
          />
        </div>

        {request?.status === "pending" ? (
          <footer className="border-line flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              className="sm:w-auto"
              onClick={() => decision.request("reject")}
            >
              Rechazar
            </Button>
            <Button
              className="sm:w-auto"
              onClick={() => decision.request("approve")}
            >
              Aprobar
            </Button>
          </footer>
        ) : null}

        <RecoveryToast toast={toast} visible={visible} />
      </Dialog>

      <RecoveryDecisionDialog
        decision={decision.pending}
        name={name}
        isSubmitting={decision.isSubmitting}
        onConfirm={() => {
          if (requestId) void decision.confirm(requestId);
        }}
        onCancel={decision.cancel}
      />
    </>
  );
}

function RecoveryRequestBody({
  status,
  request,
  onRetry,
}: {
  status: RecoveryRequestStatus;
  request: RecoveryRequestDetail | null;
  onRetry: () => void;
}) {
  if (request) return <RecoveryRequestDetails request={request} />;

  switch (status) {
    case "forbidden":
      return (
        <StateBox role="alert" icon={ShieldOff} title="No tenés permisos">
          Las solicitudes de recuperación son solo para el staff de Discordia.
        </StateBox>
      );
    case "not-found":
      return (
        <StateBox role="alert" icon={SearchX} title="Esta solicitud no existe">
          Puede que el enlace esté mal o que se haya eliminado la cuenta.
        </StateBox>
      );
    case "error":
      return (
        <StateBox
          role="alert"
          icon={AlertTriangle}
          title="No pudimos cargar la solicitud"
          action={
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={onRetry}
            >
              Reintentar
            </Button>
          }
        >
          Revisá tu conexión e intentá de nuevo.
        </StateBox>
      );
    default:
      return (
        <div
          aria-busy="true"
          aria-label="Cargando solicitud"
          className="space-y-5"
        >
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-[66px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      );
  }
}

function RecoveryRequestDetails({
  request,
}: {
  request: RecoveryRequestDetail;
}) {
  const resolution = resolutionText(request);

  return (
    <>
      <section>
        <h3 className="text-content-subtle mb-2 text-xs font-semibold tracking-wider uppercase">
          Mensaje del usuario
        </h3>
        <p
          className={
            request.message
              ? "border-line bg-surface-input text-content rounded-xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
              : "border-line bg-surface-input text-content-muted rounded-xl border px-4 py-3 text-sm"
          }
        >
          {request.message || "El usuario no dejó un mensaje"}
        </p>
      </section>

      <FactGrid className="grid-cols-1 sm:grid-cols-2">
        <Fact label="Enviada el">{formatDateTime(request.requested_at)}</Fact>
        <Fact label="Cuenta creada el">
          {request.user ? formatDate(request.user.created_at) : "Sin datos"}
        </Fact>
        <Fact label="Estado de la cuenta">
          {request.user ? (
            <UserStatusBadge status={request.user.status} />
          ) : (
            "Sin datos"
          )}
        </Fact>
        <Fact label="Solicitudes anteriores">
          {previousRequestsText(request.previous_requests)}
        </Fact>
      </FactGrid>

      <Link href={userDossierHref(request.user_id)} className={LINK_CLASS}>
        Ver expediente completo
      </Link>

      {resolution ? (
        <p className="border-line bg-surface-input text-content-muted rounded-xl border px-4 py-3 text-sm">
          {resolution}
        </p>
      ) : null}
    </>
  );
}
