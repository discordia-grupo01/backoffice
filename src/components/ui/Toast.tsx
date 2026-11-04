"use client";

import { CircleCheck, X } from "lucide-react";
import { useEffect } from "react";

const TOAST_DURATION_MS = 3500;

/** Aviso breve de éxito abajo a la derecha; se cierra solo. */
export function Toast({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClose, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="border-success/40 bg-surface-raised text-content shadow-raised fixed inset-x-3 bottom-3 z-[70] flex items-center gap-3 rounded-xl border p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-sm"
    >
      <span className="bg-success/15 text-success-readable flex size-7 shrink-0 items-center justify-center rounded-full">
        <CircleCheck size={16} aria-hidden="true" />
      </span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar aviso"
        className="text-content-muted hover:text-content cursor-pointer"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
