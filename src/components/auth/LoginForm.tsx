"use client";

import {
  hasErrors,
  type LoginErrors,
  validateLogin,
} from "@discordia/client-shared";

import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { ROUTES } from "@/lib/constants";
import { loginRequest } from "@/services/auth/client";

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
    if (hasErrors(nextErrors)) return;

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
      <h1 className="font-display mb-1 text-center text-[22px] font-bold">
        Panel de administración
      </h1>
      <p className="text-content-muted mb-6 text-center text-[13px]">
        Ingresá con tu cuenta de equipo para continuar.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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

        <FormAlert message={formError ?? undefined} />

        <Button type="submit" isLoading={isSubmitting} className="mt-2">
          <span>Ingresar al panel</span>
          <ArrowRight size={16} />
        </Button>
      </form>
    </>
  );
}
