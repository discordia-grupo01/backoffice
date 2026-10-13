import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { SidebarToggle } from "./SidebarToggle";

interface PanelHeaderProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export function PanelHeader({ title, subtitle, children }: PanelHeaderProps) {
  return (
    <header className="border-line bg-surface-sunken flex min-h-16 items-center justify-between gap-3 border-b px-3 py-2.5 min-[481px]:px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0 md:hidden">
          <SidebarToggle />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">{title}</h1>
          <p className="text-content-subtle mt-0.5 hidden font-mono text-xs sm:block">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
