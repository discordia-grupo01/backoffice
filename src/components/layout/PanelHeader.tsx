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
    <header className="border-line bg-surface-sunken flex h-16 shrink-0 items-center justify-between gap-3 border-b px-3 min-[481px]:px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0 md:hidden">
          <SidebarToggle />
        </div>
        <div className="min-w-0">
          <h1 className="font-display truncate text-xl leading-tight font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-content-muted hidden truncate text-[13px] leading-snug sm:block">
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
