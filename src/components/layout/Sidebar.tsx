"use client";

import { LayoutDashboard, Server, Users, X } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/lib/constants";
import { SIDEBAR_ID } from "@/lib/sidebarIds";

import { BrandLogo } from "./BrandLogo";
import { useSidebarControls } from "./SidebarContext";
import { SidebarToggle } from "./SidebarToggle";

const UPCOMING_ITEMS = [
  { label: "Usuarios", icon: Users },
  { label: "Servidores", icon: Server },
] as const;

export function Sidebar() {
  const { isRail, closeMobile } = useSidebarControls();

  return (
    <aside id={SIDEBAR_ID} className="sidebar" aria-label="Menú lateral">
      <div className="sidebar-brand">
        <div className="sidebar-logo-box">
          <BrandLogo className="sidebar-logo" />
        </div>
        <SidebarToggle className="icon-btn square sidebar-toggle" />
        <button
          type="button"
          onClick={closeMobile}
          aria-label="Cerrar menú"
          className="icon-btn square sidebar-close"
        >
          <X size={18} />
        </button>
      </div>

      <nav aria-label="Navegación principal">
        <p className="nav-heading">Navegación</p>
        <Link
          href={ROUTES.home}
          className="nav-item"
          aria-current="page"
          title={isRail ? "Dashboard" : undefined}
          onClick={closeMobile}
        >
          <LayoutDashboard size={20} aria-hidden="true" />
          <span className="nav-label">Dashboard</span>
        </Link>
        {UPCOMING_ITEMS.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="nav-item"
            aria-disabled="true"
            title={isRail ? `${label} (pronto)` : undefined}
          >
            <Icon size={20} aria-hidden="true" />
            <span className="nav-label">{label}</span>
            <span className="nav-soon">Pronto</span>
          </span>
        ))}
      </nav>
    </aside>
  );
}
