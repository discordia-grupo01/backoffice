import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { AuthDecoration } from "@/components/auth/AuthDecoration";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Shell de las pantallas de autenticacion: fondo, card centrada y pie de seguridad. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-backdrop relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-4 py-6">
      <AuthDecoration />

      <div className="absolute inset-x-3 top-3 z-20 flex items-center justify-end sm:inset-x-5 sm:top-5">
        <ThemeToggle />
      </div>

      <main className="border-line-strong bg-surface-raised shadow-raised relative z-10 w-full max-w-[420px] overflow-hidden rounded-[20px] border before:block before:h-[3px] before:bg-[linear-gradient(90deg,var(--bo-accent),var(--bo-accent-end))]">
        <div className="px-5 pt-7 pb-6 min-[421px]:px-8 min-[421px]:pt-8 min-[421px]:pb-7">
          <AuthLogo />
          {children}
        </div>

        <footer className="border-line bg-surface-input text-content-subtle flex items-start gap-2.5 border-t px-5 py-3.5 text-xs leading-normal min-[421px]:px-8">
          <ShieldCheck
            size={16}
            aria-hidden="true"
            className="text-bo mt-px shrink-0"
          />
          <span>
            Acceso restringido a personal autorizado. Los ingresos y acciones
            quedan registrados. ¿Sin acceso? Contactá a un administrador.
          </span>
        </footer>
      </main>
    </div>
  );
}
