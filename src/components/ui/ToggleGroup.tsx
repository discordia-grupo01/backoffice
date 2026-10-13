import { cn } from "@/lib/cn";

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleGroupProps<T extends string> {
  options: readonly ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Grupo de botones donde uno está activo, para elegir un filtro. */
export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: ToggleGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "border-line-strong text-content-muted cursor-pointer rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors min-[481px]:text-xs",
            "hover:bg-surface-input focus-visible:ring-bo focus-visible:ring-2 focus-visible:outline-none",
            "aria-pressed:border-bo aria-pressed:bg-bo/14 aria-pressed:text-content aria-pressed:font-semibold",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
