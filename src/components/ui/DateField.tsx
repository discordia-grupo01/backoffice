import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface DateFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
}

/** Campo de fecha compacto, con la etiqueta a la izquierda. */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  function DateField({ label, id, className, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="text-content-subtle flex items-center gap-2 text-xs">
        <label htmlFor={inputId}>{label}</label>
        <input
          ref={ref}
          id={inputId}
          type="date"
          className={cn(
            "border-line-strong bg-surface-input text-content rounded-lg border px-2 py-1.5 text-xs",
            "focus-visible:ring-bo focus-visible:ring-2 focus-visible:outline-none",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
