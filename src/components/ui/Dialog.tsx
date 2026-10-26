"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "bg-surface-raised text-content border-line shadow-raised m-auto max-h-none max-w-none overflow-hidden border p-0",
        "h-dvh w-full sm:h-[min(100dvh-3rem,46rem)] sm:w-[min(100vw-3rem,52rem)] sm:rounded-2xl",
        "backdrop:bg-[rgba(8,14,22,0.6)] backdrop:backdrop-blur-[2px]",
        "open:flex open:flex-col",
        "transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none starting:open:translate-y-2 starting:open:opacity-0",
        className,
      )}
    >
      {open ? children : null}
    </dialog>
  );
}
