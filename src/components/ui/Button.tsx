import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-bo-gradient text-on-bo shadow-[0_6px_20px_var(--bo-glow)] hover:brightness-110",
  secondary:
    "bg-surface-input text-content border border-line-strong hover:border-bo",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      isLoading = false,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        className={cn(
          "font-display inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
          "focus-visible:ring-bo focus-visible:ring-offset-surface-sunken focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
          VARIANTS[variant],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span
            className="size-5 animate-spin rounded-full border-2 border-current/30 border-t-current"
            aria-hidden="true"
          />
        ) : (
          children
        )}
      </button>
    );
  },
);
