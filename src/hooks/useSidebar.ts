"use client";

import { useCallback, useEffect, useState } from "react";

import { SIDEBAR_ID, SIDEBAR_TOGGLE_ID } from "@/lib/sidebarIds";

const COLLAPSED_KEY = "discordia:sidebar-collapsed";
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Estado del menú lateral. En desktop se contrae a un riel de íconos (y se
 * recuerda); en mobile es un drawer que arranca cerrado.
 */
export function useSidebar() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "1");
    } catch {
      // Sin almacenamiento: arranca expandido.
    }
  }, []);

  const drawerOpen = mobileOpen && !isDesktop;

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document
      .getElementById(SIDEBAR_ID)
      ?.querySelector<HTMLElement>(".sidebar-close")
      ?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.getElementById(SIDEBAR_TOGGLE_ID)?.focus();
    };
  }, [drawerOpen]);

  const toggle = useCallback(() => {
    if (isDesktop) {
      setCollapsed((current) => {
        const next = !current;
        try {
          localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
        } catch {
          // No poder recordarlo no impide contraer el menú.
        }
        return next;
      });
    } else {
      setMobileOpen((current) => !current);
    }
  }, [isDesktop]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return {
    isOpen: isDesktop ? !collapsed : drawerOpen,
    isRail: isDesktop && collapsed,
    mobileOpen: drawerOpen,
    toggle,
    closeMobile,
  };
}
