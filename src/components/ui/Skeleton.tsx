import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

/** Bloque de carga con un brillo que lo recorre; el tamaño y la forma los define quien lo usa. */
export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "border-line bg-surface-raised animate-shimmer border motion-reduce:animate-none",
        "bg-[linear-gradient(90deg,transparent_0%,color-mix(in_srgb,var(--text)_9%,transparent)_50%,transparent_100%)] bg-[length:50%_100%] bg-[position:-100%_0] bg-no-repeat",
        className,
      )}
    />
  );
}
