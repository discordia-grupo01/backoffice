import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

import { AuthDecoration } from "@/components/auth/AuthDecoration";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Acceso al panel",
};

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <AuthDecoration />

      <div className="auth-topbar">
        <ThemeToggle />
      </div>

      <main className="auth-card">
        <div className="auth-card-body">
          <div className="auth-brand">
            <Image
              src="/logo-light.png"
              alt="discordia"
              width={1010}
              height={269}
              priority
              className="auth-logo logo-on-dark"
            />
            <Image
              src="/logo.png"
              alt="discordia"
              width={1010}
              height={269}
              priority
              className="auth-logo logo-on-light"
            />
          </div>
          <LoginForm />
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
