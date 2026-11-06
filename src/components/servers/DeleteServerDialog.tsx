import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { TextField } from "@/components/ui/TextField";
import type { PlatformServer } from "@/types/servers.types";

import type { ServerDeletionResult } from "./hooks/useServerDeletion";

interface DeleteServerDialogProps {
  pending: PlatformServer | null;
  confirmName: string;
  canConfirm: boolean;
  isSubmitting: boolean;
  error?: string;
  onConfirmNameChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteServerDialog({
  pending,
  confirmName,
  canConfirm,
  isSubmitting,
  error,
  onConfirmNameChange,
  onConfirm,
  onCancel,
}: DeleteServerDialogProps) {
  return (
    <ConfirmDialog
      open={pending !== null}
      title={`¿Eliminar ${pending?.name ?? ""}?`}
      confirmLabel="Sí, eliminar"
      icon={Trash2}
      variant="danger"
      isLoading={isSubmitting}
      isConfirmDisabled={!canConfirm}
      error={error}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      Se van a borrar para siempre sus canales, mensajes y roles, y sus miembros
      pierden el acceso. No se puede deshacer.
      <div className="mt-5 text-left">
        <TextField
          label="Escribí el nombre del servidor"
          value={confirmName}
          autoComplete="off"
          autoFocus
          disabled={isSubmitting}
          onChange={(event) => onConfirmNameChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canConfirm) onConfirm();
          }}
        />
      </div>
    </ConfirmDialog>
  );
}

export function DeleteServerResultDialog({
  result,
  onClose,
}: {
  result: ServerDeletionResult | null;
  onClose: () => void;
}) {
  const isAlreadyDeleted = result?.outcome === "alreadyDeleted";
  const name = result?.server.name ?? "";

  return (
    <SuccessDialog
      open={result !== null}
      variant={isAlreadyDeleted ? "info" : "success"}
      title={
        isAlreadyDeleted
          ? "Este servidor ya fue eliminado"
          : "Eliminación en curso"
      }
      onClose={onClose}
    >
      {isAlreadyDeleted
        ? `${name} ya no existe en la plataforma.`
        : `${name} se va a eliminar en unos segundos.`}
    </SuccessDialog>
  );
}
