import { UserCheck, UserX, type LucideIcon } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { PlatformUser, SuspensionAction } from "@/types/users.types";

interface ActionCopy {
  title: (name: string) => string;
  body: string;
  confirmLabel: string;
  icon: LucideIcon;
  variant: "danger" | "success";
}

const COPY: Record<SuspensionAction, ActionCopy> = {
  suspend: {
    title: (name) => `¿Suspender a ${name}?`,
    body: "No va a poder iniciar sesión en Discordia, se cerrarán sus sesiones abiertas y su perfil dejará de estar visible para el resto.",
    confirmLabel: "Sí, suspender",
    icon: UserX,
    variant: "danger",
  },
  reactivate: {
    title: (name) => `¿Reactivar a ${name}?`,
    body: "Va a poder volver a iniciar sesión en Discordia y su perfil vuelve a estar visible para el resto.",
    confirmLabel: "Sí, reactivar",
    icon: UserCheck,
    variant: "success",
  },
};

interface UserSuspensionDialogProps {
  pending: { user: PlatformUser; action: SuspensionAction } | null;
  isSubmitting: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UserSuspensionDialog({
  pending,
  isSubmitting,
  error,
  onConfirm,
  onCancel,
}: UserSuspensionDialogProps) {
  const copy = COPY[pending?.action ?? "suspend"];

  return (
    <ConfirmDialog
      open={pending !== null}
      title={copy.title(pending?.user.name ?? "")}
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
