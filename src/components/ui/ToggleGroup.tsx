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

/**
 * Control segmentado: las opciones comparten una misma pastilla y la activa
 * se resalta.
 */
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
      className={cn(
        "bg-surface-sunken border-line inline-flex h-10 gap-0.5 rounded-lg border p-0.5",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "text-content-muted flex-1 cursor-pointer rounded-md px-3.5 text-center text-[13px] font-medium whitespace-nowrap transition-colors",
            "hover:text-content focus-visible:ring-bo focus-visible:ring-2 focus-visible:outline-none",
            "aria-pressed:bg-bo/14 aria-pressed:text-content aria-pressed:font-semibold aria-pressed:shadow-[inset_0_0_0_1px_var(--bo-accent)]",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
