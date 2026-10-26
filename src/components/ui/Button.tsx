import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant =
  "primary" | "secondary" | "caution" | "positive" | "danger" | "success";
type Size = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-bo-gradient text-on-bo shadow-[0_6px_20px_var(--bo-glow)] hover:brightness-110",
  secondary:
    "bg-surface-input text-content border border-line-strong hover:border-bo",
  caution:
    "bg-warning/15 text-warning-readable border border-transparent hover:border-warning",
  positive:
    "bg-success/15 text-success-readable border border-transparent hover:border-success",
  danger:
    "bg-[color-mix(in_srgb,var(--danger)_82%,black)] text-white hover:brightness-110",
  success:
    "bg-[color-mix(in_srgb,var(--success)_78%,black)] text-white hover:brightness-110",
};

const SIZES: Record<Size, string> = {
  md: "w-full rounded-xl px-4 py-3 text-sm",
  sm: "w-auto gap-1.5 rounded-lg px-3 py-1.5 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
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
          "font-display inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all",
          "focus-visible:ring-bo focus-visible:ring-offset-surface-sunken focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
          SIZES[size],
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
