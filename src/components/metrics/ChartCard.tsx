import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Card } from "@/components/ui/Card";

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Ocupa todo el ancho de la grilla. */
  wide?: boolean;
  /** Dentro de otra tarjeta o de un modal: fondo de recuadro interno y título h3. */
  inset?: boolean;
  /** Sin gráfico que dibujar: el cuerpo toma la altura de su contenido. */
  compact?: boolean;
}

export function ChartCard({
  title,
  subtitle,
  children,
  wide,
  inset = false,
  compact = false,
}: ChartCardProps) {
  const Heading = inset ? "h3" : "h2";

  return (
    <Card
      as="section"
      className={cn(
        "min-w-0 rounded-[14px] p-4 min-[481px]:px-6 min-[481px]:py-5",
        wide && "@3xl:col-span-full",
        inset && "bg-surface-input rounded-xl min-[481px]:p-4",
      )}
    >
      <Heading className="text-sm font-semibold">{title}</Heading>
      <p
        className={cn(
          "text-content-subtle mt-0.5 text-xs",
          compact ? "mb-3" : "mb-5",
        )}
      >
        {subtitle}
      </p>
      <div className={cn(!compact && "h-60 min-[481px]:h-[300px]")}>
        {children}
      </div>
    </Card>
  );
}
