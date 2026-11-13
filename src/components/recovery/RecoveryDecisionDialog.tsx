import { ShieldCheck, ShieldX, type LucideIcon } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { RecoveryDecision } from "@/types/recovery.types";

interface DecisionCopy {
  title: (name: string) => string;
  body: string;
  confirmLabel: string;
  icon: LucideIcon;
  variant: "positive" | "danger";
}

const COPY: Record<RecoveryDecision, DecisionCopy> = {
  approve: {
    title: (name) => `¿Aprobar la recuperación de ${name}?`,
    body: "Se va a desactivar la verificación en dos pasos de esta cuenta y se invalidarán sus códigos de recuperación. El usuario va a poder iniciar sesión sin segundo factor y le vamos a avisar por email.",
    confirmLabel: "Sí, aprobar",
    icon: ShieldCheck,
    variant: "positive",
  },
  reject: {
    title: (name) => `¿Rechazar la solicitud de ${name}?`,
    body: "La verificación en dos pasos de esta cuenta se mantiene activa. Le vamos a avisar al usuario por email que no pudimos validar su solicitud.",
    confirmLabel: "Sí, rechazar",
    icon: ShieldX,
    variant: "danger",
  },
};

interface RecoveryDecisionDialogProps {
  decision: RecoveryDecision | null;
  name: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RecoveryDecisionDialog({
  decision,
  name,
  isSubmitting,
  onConfirm,
  onCancel,
}: RecoveryDecisionDialogProps) {
  const copy = COPY[decision ?? "approve"];

  return (
    <ConfirmDialog
      open={decision !== null}
      title={copy.title(name)}
      confirmLabel={copy.confirmLabel}
      icon={copy.icon}
      variant={copy.variant}
      isLoading={isSubmitting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {copy.body}
    </ConfirmDialog>
  );
}
