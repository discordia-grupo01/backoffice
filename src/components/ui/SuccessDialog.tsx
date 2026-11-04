"use client";

import { CircleCheck } from "lucide-react";
import { useId, type ReactNode } from "react";

import { Button } from "./Button";
import { Dialog } from "./Dialog";

interface SuccessDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  closeLabel?: string;
  onClose: () => void;
}

export function SuccessDialog({
  open,
  title,
  children,
  closeLabel = "Entendido",
  onClose,
}: SuccessDialogProps) {
  const titleId = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      className="h-fit w-[min(100vw-2rem,26.25rem)] rounded-2xl sm:h-fit sm:w-[min(100vw-3rem,26.25rem)]"
    >
      <div className="flex flex-col items-center gap-5 px-7 py-8 text-center">
        <span
          aria-hidden="true"
          className="bg-success/15 text-success flex size-16 shrink-0 items-center justify-center rounded-2xl"
        >
          <CircleCheck size={28} />
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
        <Button variant="secondary" onClick={onClose}>
          {closeLabel}
        </Button>
      </div>
    </Dialog>
  );
}
