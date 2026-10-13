import Image from "next/image";

/** Logo con una variante por tema (la oscura se oculta en light y viceversa). */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/logo-light.png"
        alt="discordia"
        width={1010}
        height={269}
        className={`${className ?? ""} logo-on-dark`}
      />
      <Image
        src="/logo.png"
        alt="discordia"
        width={1010}
        height={269}
        className={`${className ?? ""} logo-on-light`}
      />
    </>
  );
}
