"use client";

import { Menu } from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";

import { useSidebarControls } from "./SidebarContext";

/** Botón de hamburguesa: abre y cierra el menú lateral. */
export function SidebarToggle() {
  const { isOpen, toggle } = useSidebarControls();

  return (
    <IconButton
      icon={Menu}
      iconSize={20}
      label={isOpen ? "Cerrar menú" : "Abrir menú"}
      onClick={toggle}
      isExpanded={isOpen}
    />
  );
}
