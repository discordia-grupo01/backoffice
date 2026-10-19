"use client";

import { LayoutDashboard, LogOut, Server, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { BrandMark } from "@/components/ui/BrandMark";
import { IconButton } from "@/components/ui/IconButton";
import { ROUTES } from "@/lib/constants";
import { logoutRequest } from "@/services/auth/client";

import { useSidebarControls } from "./SidebarContext";
import { SidebarItem } from "./SidebarItem";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutRequest();
    window.location.href = ROUTES.login;
  }

  return (
    <aside
      className="border-line bg-surface-sunken invisible fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] -translate-x-full flex-col border-r transition-[translate,visibility] delay-[0s,0.25s] duration-250 ease-in-out group-data-[mobile-open=true]/shell:visible group-data-[mobile-open=true]/shell:translate-x-0 group-data-[mobile-open=true]/shell:shadow-[8px_0_32px_rgba(0,0,0,0.35)] group-data-[mobile-open=true]/shell:delay-0 motion-reduce:transition-none md:visible md:sticky md:z-30 md:h-dvh md:w-[260px] md:shrink-0 md:translate-x-0 md:shadow-none md:transition-[width] md:delay-0 md:duration-300 md:group-data-[rail=true]/shell:w-[72px]"
      aria-label="Menú lateral"
    >
      <div className="border-line relative flex h-16 shrink-0 items-center justify-between overflow-hidden border-b pr-4 pl-[19px]">
        <div className="pointer-events-none w-[140px] shrink-0 transition-opacity duration-300 motion-reduce:transition-none md:group-data-[rail=true]/shell:opacity-0">
          <BrandLogo className="h-auto w-[140px] max-w-none" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-[19px] hidden -translate-y-1/2 opacity-0 transition-opacity duration-300 motion-reduce:transition-none md:block md:group-data-[rail=true]/shell:opacity-100"
        >
          <BrandMark className="h-[37px] w-auto max-w-none" />
        </div>
        <div className="md:hidden">
          <IconButton icon={X} label="Cerrar menú" onClick={closeMobile} />
        </div>
      </div>

      <nav
        aria-label="Navegación principal"
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4"
      >
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

      <div className="border-line shrink-0 border-t px-3 py-3">
        <SidebarItem
          label="Cerrar sesión"
          icon={LogOut}
          isRail={isRail}
          onClick={handleLogout}
          disabled={isLoggingOut}
        />
      </div>
    </aside>
  );
}
