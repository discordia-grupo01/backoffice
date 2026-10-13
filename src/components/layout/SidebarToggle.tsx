"use client";

import { Menu } from "lucide-react";

import { useSidebarControls } from "./SidebarContext";

interface SidebarToggleProps {
  className: string;
}

/** Botón de hamburguesa: abre y cierra el menú lateral. */
export function SidebarToggle({ className }: SidebarToggleProps) {
  const { isOpen, toggle } = useSidebarControls();
  const label = isOpen ? "Cerrar menú" : "Abrir menú";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-expanded={isOpen}
      className={className}
    >
      <Menu size={20} aria-hidden="true" />
    </button>
  );
}
