import Image from "next/image";

import { cn } from "@/lib/cn";

/** Logo con una variante por tema (la oscura se oculta en light y viceversa). */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/logo-light.png"
        alt="discordia"
        width={1010}
        height={269}
        className={cn(className, "block in-data-[theme=light]:hidden")}
      />
      <Image
        src="/logo.png"
        alt="discordia"
        width={1010}
        height={269}
        className={cn(className, "hidden in-data-[theme=light]:block")}
      />
    </>
  );
}
