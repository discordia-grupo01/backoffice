"use client";

import { getInitial } from "@discordia/client-shared";
import { useState } from "react";

import { cn } from "@/lib/cn";

interface AvatarProps {
  name: string;
  /**
   * URL de la imagen. Si es `null`/`undefined`, o si la imagen no carga (404,
   * archivo borrado del storage...), se muestra la inicial en vez del ícono de
   * "imagen rota" del navegador.
   */
  src?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ name, src, size = 36, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const [lastSrc, setLastSrc] = useState(src);
  if (src !== lastSrc) {
    setLastSrc(src);
    setFailed(false);
  }

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        aria-hidden="true"
        onError={() => setFailed(true)}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-bo-gradient font-display text-on-bo flex shrink-0 items-center justify-center rounded-full font-bold select-none",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {getInitial(name) ?? "?"}
    </div>
  );
}
