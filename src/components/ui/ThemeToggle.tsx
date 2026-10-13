"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const goingToLight = theme === "dark";
  const label = goingToLight ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="icon-btn square"
    >
      {goingToLight ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
