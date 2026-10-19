import { LayoutGrid, Table2, type LucideIcon } from "lucide-react";

import type { ViewMode } from "@/hooks/useViewMode";
import { cn } from "@/lib/cn";

const OPTIONS: { value: ViewMode; label: string; icon: LucideIcon }[] = [
  { value: "cards", label: "Ver como tarjetas", icon: LayoutGrid },
  { value: "table", label: "Ver como tabla", icon: Table2 },
];

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

/** Elegir tabla o tarjetas. Solo hay lugar para la tabla en pantallas anchas, así que en angostas no se muestra. */
export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Vista"
      className="bg-surface-sunken border-line hidden h-10 gap-0.5 rounded-lg border p-0.5 @3xl:inline-flex"
    >
      {OPTIONS.map(({ value: option, label, icon: Icon }) => (
        <button
          key={option}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
          className={cn(
            "text-content-muted flex w-9 cursor-pointer items-center justify-center rounded-md transition-colors",
            "hover:text-content focus-visible:ring-bo focus-visible:ring-2 focus-visible:outline-none",
            "aria-pressed:bg-bo/14 aria-pressed:text-content aria-pressed:shadow-[inset_0_0_0_1px_var(--bo-accent)]",
          )}
        >
          <Icon size={18} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
