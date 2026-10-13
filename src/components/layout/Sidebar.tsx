"use client";

import { LayoutDashboard, Server, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { IconButton } from "@/components/ui/IconButton";
import { ROUTES } from "@/lib/constants";

import { useSidebarControls } from "./SidebarContext";
import { SidebarItem } from "./SidebarItem";
import { SidebarToggle } from "./SidebarToggle";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.home },
  { label: "Usuarios", icon: Users, href: ROUTES.users },
] as const;

const UPCOMING_ITEMS = [{ label: "Servidores", icon: Server }] as const;

function isCurrentPath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const { isRail, closeMobile } = useSidebarControls();
  const pathname = usePathname();

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
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            isCurrent={isCurrentPath(pathname, item.href)}
            isRail={isRail}
            onNavigate={closeMobile}
          />
        ))}
        {UPCOMING_ITEMS.map((item) => (
          <SidebarItem key={item.label} {...item} isRail={isRail} />
        ))}
      </nav>
    </aside>
  );
}
