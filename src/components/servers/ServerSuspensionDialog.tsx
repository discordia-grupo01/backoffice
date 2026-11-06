import { ShieldCheck, ShieldOff, type LucideIcon } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type {
  PlatformServer,
  ServerSuspensionAction,
} from "@/types/servers.types";

interface ActionCopy {
  title: (name: string) => string;
  body: string;
  confirmLabel: string;
  icon: LucideIcon;
  variant: "caution" | "positive";
}

const COPY: Record<ServerSuspensionAction, ActionCopy> = {
  suspend: {
    title: (name) => `¿Suspender ${name}?`,
    body: "Los miembros no podrán acceder, pero el contenido se conserva.",
    confirmLabel: "Suspender servidor",
    icon: ShieldOff,
    variant: "caution",
  },
  reactivate: {
    title: (name) => `¿Reactivar ${name}?`,
    body: "Los miembros recuperarán el acceso.",
    confirmLabel: "Reactivar servidor",
    icon: ShieldCheck,
    variant: "positive",
  },
};

interface ServerSuspensionDialogProps {
  pending: { server: PlatformServer; action: ServerSuspensionAction } | null;
  isSubmitting: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ServerSuspensionDialog({
  pending,
  isSubmitting,
  error,
  onConfirm,
  onCancel,
}: ServerSuspensionDialogProps) {
  const copy = COPY[pending?.action ?? "suspend"];

  return (
    <ConfirmDialog
      open={pending !== null}
      title={copy.title(pending?.server.name ?? "")}
      confirmLabel={copy.confirmLabel}
      icon={copy.icon}
      variant={copy.variant}
      isLoading={isSubmitting}
      error={error}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {copy.body}
    </ConfirmDialog>
  );
}
