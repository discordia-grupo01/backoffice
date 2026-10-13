"use client";

import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/lib/constants";
import { loginRequest, validateLogin, type LoginErrors } from "@/services/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors = validateLogin({ email, password });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await loginRequest({ email: email.trim(), password });
    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    window.location.href = ROUTES.home;
  }

  return (
    <>
      <h1 className="auth-title font-display">Panel de administración</h1>
      <p className="auth-subtitle">
        Ingresá con tu cuenta de equipo para continuar.
      </p>

      <form onSubmit={handleSubmit} noValidate className="form">
        <TextField
          label="Correo del equipo"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="nombre@discordia.com"
          icon={<Mail size={16} />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />

        <PasswordField
          label="Contraseña"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock size={16} />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        {formError ? (
          <p role="alert" className="form-alert">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn-primary font-display"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner" aria-hidden="true" />
          ) : (
            <>
              <span>Ingresar al panel</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </>
  );
}
