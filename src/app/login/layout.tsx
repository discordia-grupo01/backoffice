import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { AuthDecoration } from "@/components/auth/AuthDecoration";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Shell de las pantallas de autenticacion: fondo, card centrada y pie de seguridad. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <AuthDecoration />

      <div className="auth-topbar">
        <ThemeToggle />
      </div>

      <main className="auth-card">
        <div className="auth-card-body">
          <AuthLogo />
          {children}
        </div>

        <footer className="auth-footer">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>
            Acceso restringido a personal autorizado. Los ingresos y acciones
            quedan registrados. ¿Sin acceso? Contactá a un administrador.
          </span>
        </footer>
      </main>
    </div>
  );
}
