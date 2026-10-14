"use client";

import type { ReactNode } from "react";

import { NoStaffAccess } from "@/components/metrics/MetricsStates";
import { useSidebar } from "./hooks/useSidebar";
import { useStaffAccess } from "./hooks/useStaffAccess";

import { Sidebar } from "./Sidebar";
import { SidebarContext } from "./SidebarContext";

/** Marco del panel: solo muestra su contenido a quien tiene rol de staff. */
export function PanelShell({ children }: { children: ReactNode }) {
  const access = useStaffAccess();
  const { isOpen, isRail, mobileOpen, toggle, closeMobile } = useSidebar();

  if (access === "checking")
    return <div className="min-h-dvh" aria-busy="true" />;
  if (access === "denied") return <NoStaffAccess />;

  return (
    <SidebarContext.Provider value={{ isOpen, isRail, toggle, closeMobile }}>
      <div
        className="panel-shell group/shell bg-surface text-content flex min-h-dvh"
        data-rail={isRail}
        data-mobile-open={mobileOpen}
      >
        <Sidebar />
        <div
          className="pointer-events-none fixed inset-0 z-40 bg-[rgba(8,14,22,0.55)] opacity-0 backdrop-blur-[2px] transition-opacity duration-250 ease-in-out group-data-[mobile-open=true]/shell:pointer-events-auto group-data-[mobile-open=true]/shell:opacity-100 motion-reduce:transition-none md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}
