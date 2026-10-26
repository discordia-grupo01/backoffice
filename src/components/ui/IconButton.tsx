"use client";

import type { LucideIcon } from "lucide-react";

import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";

interface IconButtonProps {
  icon: LucideIcon;
  /** Va como `aria-label` y como texto del tooltip. */
  label: string;
  onClick?: () => void;
  /** Resalta el boton cuando lo que controla esta activo. */
  isActive?: boolean;
  /** Sin accion todavia: se ve apagado y no responde. */
  disabled?: boolean;
  /** `true` cuando el boton muestra/oculta algo, para lectores de pantalla. */
  isPressed?: boolean;
  /** `true` cuando el boton abre/cierra un panel (ej: el menu lateral). */
  isExpanded?: boolean;
  /** Tamano del icono. */
  iconSize?: number;
  /** `"end"` alinea el tooltip a la derecha del boton, para que no se salga de la pantalla. */
  tooltipAlign?: "center" | "end";
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  isPressed,
  isExpanded,
  iconSize = 18,
  tooltipAlign,
}: IconButtonProps) {
  return (
    <Tooltip label={label} align={tooltipAlign}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={isPressed}
        aria-expanded={isExpanded}
        className={cn(
          "flex size-8 items-center justify-center rounded-lg transition-colors",
          "focus-visible:ring-bo focus-visible:ring-2 focus-visible:outline-none",
          disabled
            ? "text-content-subtle cursor-not-allowed opacity-50"
            : "hover:bg-surface-hover cursor-pointer",
          !disabled && isActive
            ? "text-bo bg-bo/15"
            : "text-content-subtle hover:text-content",
        )}
      >
        <Icon size={iconSize} aria-hidden="true" />
      </button>
    </Tooltip>
  );
}
