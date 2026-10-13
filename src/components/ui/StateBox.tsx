import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface StateBoxProps {
  icon: LucideIcon;
  title: string;
  /** Texto de apoyo bajo el título. */
  children?: ReactNode;
  /** Botón u otra acción bajo el texto. */
  action?: ReactNode;
  /** Ocupa toda la pantalla y sin borde (ej: sin permisos). */
  isFullScreen?: boolean;
  /** Nivel del título: `h1` cuando el estado es toda la página. */
  headingLevel?: "h1" | "h2";
  role?: "alert";
}

/** Estado vacío, de error o de acceso denegado: ícono, título y texto centrados. */
export function StateBox({
  icon: Icon,
  title,
  children,
  action,
  isFullScreen = false,
  headingLevel: Heading = "h2",
  role,
}: StateBoxProps) {
  return (
    <div
      role={role}
      className={cn(
        "text-content-muted flex flex-col items-center gap-2 px-4 py-10 text-center min-[481px]:px-6 min-[481px]:py-14",
        isFullScreen
          ? "min-h-dvh justify-center"
          : "border-line-strong rounded-[14px] border border-dashed",
      )}
    >
      <Icon size={isFullScreen ? 36 : 32} aria-hidden="true" />
      <Heading className="text-content mt-2 text-sm font-semibold">
        {title}
      </Heading>
      {children ? <p className="max-w-[420px] text-xs">{children}</p> : null}
      {action}
    </div>
  );
}
