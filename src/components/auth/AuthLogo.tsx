import { BrandLogo } from "@/components/ui/BrandLogo";

/** Logo de las pantallas de autenticacion. */
export function AuthLogo() {
  return (
    <div className="mb-7 flex items-center justify-center gap-3">
      <BrandLogo className="h-auto w-[150px]" />
    </div>
  );
}
