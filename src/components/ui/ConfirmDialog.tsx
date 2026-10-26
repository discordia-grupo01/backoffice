"use client";

import { TriangleAlert, type LucideIcon } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { FormAlert } from "./FormAlert";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "success" | "primary";
  icon?: LucideIcon;
  isLoading?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ICON_TONES: Record<NonNullable<ConfirmDialogProps["variant"]>, string> = {
  danger: "bg-danger/15 text-danger",
  success: "bg-success/15 text-success",
  primary: "bg-bo/15 text-bo",
};

/** Pide confirmación antes de una acción. Mientras se procesa no se puede cerrar. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "danger",
  icon: Icon = TriangleAlert,
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
      className="h-fit w-[min(100vw-2rem,26.25rem)] rounded-2xl sm:h-fit sm:w-[min(100vw-3rem,26.25rem)]"
    >
      <div className="flex flex-col items-center gap-5 px-7 py-8 text-center">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-16 shrink-0 items-center justify-center rounded-2xl",
            ICON_TONES[variant],
          )}
        >
          <Icon size={28} />
        </span>
        <div>
          <h2
            id={titleId}
            className="font-display text-content mb-2 text-xl font-bold"
          >
            {title}
          </h2>
          <div className="text-content-muted text-sm leading-relaxed">
            {children}
          </div>
        </div>
        {error ? (
          <div className="w-full text-left">
            <FormAlert message={error} />
          </div>
        ) : null}
        <div className="flex w-full gap-3">
          <Button variant="secondary" disabled={isLoading} onClick={close}>
            {cancelLabel}
          </Button>
          <Button variant={variant} isLoading={isLoading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
