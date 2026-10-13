import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section";
}

/** Superficie con borde y fondo elevado; el padding y el radio los pone quien la usa. */
export function Card({ as: Tag = "div", className, ...props }: CardProps) {
  return (
    <Tag
      className={cn("border-line bg-surface-raised border", className)}
      {...props}
    />
  );
}
