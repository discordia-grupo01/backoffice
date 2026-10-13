"use client";

import { useCallback, useEffect, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

const COLLAPSED_KEY = "discordia:sidebar-collapsed";
const DESKTOP_QUERY = "(min-width: 768px)";

export function useSidebar() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
