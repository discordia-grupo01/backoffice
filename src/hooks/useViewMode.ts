"use client";

import { useEffect, useState } from "react";

import { VIEW_MODE_STORAGE_KEY } from "@/lib/constants";

export type ViewMode = "table" | "cards";

const DEFAULT_VIEW_MODE: ViewMode = "table";

export function parseViewMode(raw: string | null): ViewMode | null {
  return raw === "table" || raw === "cards" ? raw : null;
}

function readStoredViewMode(): ViewMode | null {
  try {
    return parseViewMode(localStorage.getItem(VIEW_MODE_STORAGE_KEY));
  } catch {
    return null;
  }
}

/** Vista elegida para los listados (tabla o tarjetas); se recuerda entre pantallas y visitas. */
export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>(DEFAULT_VIEW_MODE);

  useEffect(() => {
    setViewModeState(readStoredViewMode() ?? DEFAULT_VIEW_MODE);
  }, []);

  function setViewMode(next: ViewMode) {
    setViewModeState(next);
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, next);
    } catch {
      // No poder recordarla no impide cambiar la vista en esta sesion.
    }
  }

  return { viewMode, setViewMode };
}
