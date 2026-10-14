"use client";

import { useEffect, useState } from "react";

import { THEME_STORAGE_KEY } from "@/lib/constants";

export type ThemeName = "dark" | "light";

function readStoredTheme(): ThemeName | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(readStoredTheme() ?? (current === "light" ? "light" : "dark"));
  }, []);

  function toggleTheme() {
    const next: ThemeName = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // No poder recordarlo no impide cambiarlo en esta sesion.
    }
  }

  return { theme, toggleTheme };
}
