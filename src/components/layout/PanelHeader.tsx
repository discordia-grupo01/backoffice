import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { SIDEBAR_TOGGLE_ID } from "@/lib/sidebarIds";

import { SidebarToggle } from "./SidebarToggle";

interface PanelHeaderProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export function PanelHeader({ title, subtitle, children }: PanelHeaderProps) {
  return (
    <header className="panel-header">
      <div className="panel-heading">
        <SidebarToggle
          id={SIDEBAR_TOGGLE_ID}
          className="menu-btn menu-btn-mobile"
        />
        <div>
          <h1 className="panel-title font-display">{title}</h1>
          <p className="panel-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="panel-actions">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
