"use client";

import type { ReactNode } from "react";

import { NoStaffAccess } from "@/components/metrics/MetricsStates";
import { useSidebar } from "@/hooks/useSidebar";
import { useStaffAccess } from "@/hooks/useStaffAccess";

import { Sidebar } from "./Sidebar";
import { SidebarContext } from "./SidebarContext";

/** Marco del panel: solo muestra su contenido a quien tiene rol de staff. */
export function PanelShell({ children }: { children: ReactNode }) {
  const access = useStaffAccess();
  const { isOpen, isRail, mobileOpen, toggle, closeMobile } = useSidebar();

  if (access === "checking")
    return <div className="panel-loading" aria-busy="true" />;
  if (access === "denied") return <NoStaffAccess />;

  return (
    <SidebarContext.Provider value={{ isOpen, isRail, toggle, closeMobile }}>
      <div
        className="panel-shell"
        data-rail={isRail}
        data-mobile-open={mobileOpen}
      >
        <Sidebar />
        <div
          className="sidebar-overlay"
          onClick={closeMobile}
          aria-hidden="true"
        />
        <main className="panel-main">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}
