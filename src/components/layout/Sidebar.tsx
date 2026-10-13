"use client";

import { LayoutDashboard, Server, Users, X } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/constants";

import { useSidebarControls } from "./SidebarContext";
import { SidebarToggle } from "./SidebarToggle";

const UPCOMING_ITEMS = [
  { label: "Usuarios", icon: Users },
  { label: "Servidores", icon: Server },
] as const;

const NAV_ITEM =
  "relative mb-1 flex h-11 items-center gap-3 overflow-hidden rounded-lg px-3.5 text-sm font-medium whitespace-nowrap text-content-muted transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bo";

export function Sidebar() {
  const { isRail, closeMobile } = useSidebarControls();

  return (
    <aside
      className="border-line bg-surface-sunken invisible fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] -translate-x-full flex-col border-r transition-[translate,visibility] delay-[0s,0.25s] duration-250 ease-in-out group-data-[mobile-open=true]/shell:visible group-data-[mobile-open=true]/shell:translate-x-0 group-data-[mobile-open=true]/shell:shadow-[8px_0_32px_rgba(0,0,0,0.35)] group-data-[mobile-open=true]/shell:delay-0 motion-reduce:transition-none md:visible md:sticky md:z-30 md:h-dvh md:w-[260px] md:shrink-0 md:translate-x-0 md:shadow-none md:transition-[width] md:delay-0 md:duration-300 md:group-data-[rail=true]/shell:w-[72px]"
      aria-label="Menú lateral"
    >
      <div className="border-line relative flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[padding] duration-300 ease-in-out motion-reduce:transition-none md:group-data-[rail=true]/shell:px-5">
        <div className="w-[140px] shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-in-out motion-reduce:transition-none md:group-data-[rail=true]/shell:w-0 md:group-data-[rail=true]/shell:opacity-0">
          <BrandLogo className="h-auto w-[140px] max-w-none" />
        </div>
        <div className="hidden md:flex">
          <SidebarToggle />
        </div>
        <div className="md:hidden">
          <IconButton icon={X} label="Cerrar menú" onClick={closeMobile} />
        </div>
      </div>

      <nav
        aria-label="Navegación principal"
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4"
      >
        <p className="text-content-subtle mx-3.5 mb-2 overflow-hidden text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-opacity duration-300 motion-reduce:transition-none md:group-data-[rail=true]/shell:opacity-0">
          Navegación
        </p>
        <Link
          href={ROUTES.home}
          className={cn(
            NAV_ITEM,
            "bg-bo/14 text-content hover:bg-surface-input rounded-l-none shadow-[inset_3px_0_0_var(--bo-accent)]",
          )}
          aria-current="page"
          title={isRail ? "Dashboard" : undefined}
          onClick={closeMobile}
        >
          <LayoutDashboard size={20} className="shrink-0" aria-hidden="true" />
          <span className="transition-opacity duration-300 motion-reduce:transition-none md:group-data-[rail=true]/shell:opacity-0">
            Dashboard
          </span>
        </Link>
        {UPCOMING_ITEMS.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className={cn(NAV_ITEM, "text-content-subtle cursor-not-allowed")}
            aria-disabled="true"
            title={isRail ? `${label} (pronto)` : undefined}
          >
            <Icon size={20} className="shrink-0" aria-hidden="true" />
            <span className="transition-opacity duration-300 motion-reduce:transition-none md:group-data-[rail=true]/shell:opacity-0">
              {label}
            </span>
            <span className="border-line-strong ml-auto rounded-full border px-1.5 py-0.5 font-mono text-xs font-semibold transition-opacity duration-300 motion-reduce:transition-none md:group-data-[rail=true]/shell:opacity-0">
              Pronto
            </span>
          </span>
        ))}
      </nav>
    </aside>
  );
}
