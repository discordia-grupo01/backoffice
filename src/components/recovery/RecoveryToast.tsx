import { cn } from "@/lib/cn";

import type { ToastMessage, ToastTone } from "./utils/decisionToast";

const DOT: Record<ToastTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function RecoveryToast({
  toast,
  visible,
}: {
  toast: ToastMessage | null;
  visible: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "bg-surface-raised border-line-strong pointer-events-none absolute left-1/2 z-10 flex max-w-[calc(100%-2rem)] min-w-[200px] -translate-x-1/2 items-center gap-2.5 rounded-xl border px-4 py-2.5 shadow-xl transition-all duration-300 motion-reduce:transition-none",
        visible ? "bottom-5 opacity-100" : "-bottom-16 opacity-0",
      )}
    >
      {toast ? (
        <>
          <span
            aria-hidden="true"
            className={cn("size-2 shrink-0 rounded-full", DOT[toast.tone])}
          />
          <p className="text-content font-display text-sm font-semibold">
            {toast.message}
          </p>
        </>
      ) : null}
    </div>
  );
}
