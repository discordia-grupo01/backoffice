import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone = "success" | "warning" | "danger";

const TONES: Record<BadgeTone, string> = {
  success: "bg-success/15 text-success-readable",
  warning: "bg-warning/15 text-warning-readable",
  danger: "bg-danger/15 text-danger-readable",
};

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
