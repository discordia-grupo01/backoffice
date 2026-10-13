"use client";

import { Menu } from "lucide-react";

import { SIDEBAR_ID } from "@/lib/sidebarIds";

import { useSidebarControls } from "./SidebarContext";

interface SidebarToggleProps {
  className: string;
  id?: string;
}

/** Botón de hamburguesa: abre y cierra el menú lateral. */
export function SidebarToggle({ className, id }: SidebarToggleProps) {
  const { isOpen, toggle } = useSidebarControls();
  const label = isOpen ? "Cerrar menú" : "Abrir menú";

  return (
    <button
      id={id}
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-expanded={isOpen}
      aria-controls={SIDEBAR_ID}
      className={className}
    >
      <Menu size={20} aria-hidden="true" />
    </button>
  );
}
