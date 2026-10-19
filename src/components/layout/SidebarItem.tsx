"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/cn";

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  href?: string;
  /** Sin `href`: convierte el ítem en un botón que ejecuta una acción. */
  onClick?: () => void;
  disabled?: boolean;
  isCurrent?: boolean;
  isRail: boolean;
  onNavigate?: () => void;
}

const ITEM =
  "relative mb-1 flex h-11 items-center gap-3 overflow-hidden rounded-lg px-3.5 text-sm font-medium whitespace-nowrap text-content-muted transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bo";

const RAIL_FADE =
  "transition-opacity duration-300 motion-reduce:transition-none md:group-data-[rail=true]/shell:opacity-0";

export function SidebarItem({
  label,
  icon: Icon,
  href,
  onClick,
  disabled = false,
  isCurrent = false,
  isRail,
  onNavigate,
}: SidebarItemProps) {
  const content = (
    <>
      <Icon size={20} className="shrink-0" aria-hidden="true" />
      <span className={RAIL_FADE}>{label}</span>
    </>
  );

  if (!href && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          ITEM,
          "hover:bg-surface-input w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
        )}
        title={isRail ? label : undefined}
      >
        {content}
      </button>
    );
  }

  if (!href) {
    return (
      <span
        className={cn(ITEM, "text-content-subtle cursor-not-allowed")}
        aria-disabled="true"
        title={isRail ? `${label} (pronto)` : undefined}
      >
        {content}
        <span
          className={cn(
            "border-line-strong ml-auto rounded-full border px-1.5 py-0.5 font-mono text-xs font-semibold",
            RAIL_FADE,
          )}
        >
          Pronto
        </span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        ITEM,
        "hover:bg-surface-input",
        isCurrent &&
          "bg-bo/14 text-content rounded-l-none shadow-[inset_3px_0_0_var(--bo-accent)]",
      )}
      aria-current={isCurrent ? "page" : undefined}
      title={isRail ? label : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
