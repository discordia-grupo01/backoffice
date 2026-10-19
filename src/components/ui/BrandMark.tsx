import Image from "next/image";

import { cn } from "@/lib/cn";

/**
 * Solo la "D" del logo, para el menú contraído. Decorativa: el nombre lo da
 * `BrandLogo`. Igual que ahí, `-light` es la variante para fondo oscuro.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/logo-mark-light.png"
        alt=""
        width={242}
        height={269}
        className={cn(className, "block in-data-[theme=light]:hidden")}
      />
      <Image
        src="/logo-mark.png"
        alt=""
        width={242}
        height={269}
        className={cn(className, "hidden in-data-[theme=light]:block")}
      />
    </>
  );
}
