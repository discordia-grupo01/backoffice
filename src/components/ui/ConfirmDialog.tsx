"use client";

import { useId, type ReactNode } from "react";

import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { FormAlert } from "./FormAlert";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "danger",
  isLoading = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const close = () => {
    if (!isLoading) onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      labelledBy={titleId}
      className="h-auto w-[min(100vw-2rem,28rem)] rounded-2xl sm:h-auto sm:w-[min(100vw-3rem,28rem)]"
    >
      <div className="space-y-4 p-5">
        <h2
          id={titleId}
          className="font-display text-lg leading-tight font-semibold tracking-tight"
        >
          {title}
        </h2>
        <div className="text-content-muted text-sm">{children}</div>
        <FormAlert message={error} />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            className="sm:w-auto"
            disabled={isLoading}
            onClick={close}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            className="sm:w-auto"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
