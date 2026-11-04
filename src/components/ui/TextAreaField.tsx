import { useId, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  /** Texto a la derecha del label (ej: contador de caracteres). */
  hint?: string;
  error?: string;
}

/** Versión multilínea de `TextField`, con el mismo estilo. */
export function TextAreaField({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: TextAreaFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label
          htmlFor={inputId}
          className="text-content-subtle block text-xs font-semibold tracking-wider uppercase"
        >
          {label}
        </label>
        {hint ? (
          <span className="text-content-subtle font-mono text-xs tabular-nums">
            {hint}
          </span>
        ) : null}
      </div>
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "bg-surface-input text-content placeholder:text-content-subtle w-full resize-none rounded-xl border px-4 py-3 text-sm transition-colors outline-none",
          "focus:border-bo",
          error ? "border-danger" : "border-line",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-danger mt-1.5 text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
