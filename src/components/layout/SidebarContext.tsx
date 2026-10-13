"use client";

import { createContext, useContext } from "react";

interface SidebarContextValue {
  /** El menú está visible según el modo actual (expandido en desktop, abierto en mobile). */
  isOpen: boolean;
  /** Desktop con el menú contraído a íconos. */
  isRail: boolean;
  toggle: () => void;
  closeMobile: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarControls(): SidebarContextValue {
  const value = useContext(SidebarContext);
  if (!value) throw new Error("useSidebarControls fuera de PanelShell");
  return value;
}
