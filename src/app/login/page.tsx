import type { Metadata } from "next";

import { BackofficeBrandingPanel } from "@/components/auth/BackofficeBrandingPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoImage } from "@/components/auth/LogoImage";

export const metadata: Metadata = {
  title: "Acceso al panel",
};

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <BackofficeBrandingPanel />

      <div className="auth-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          <LogoImage />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
