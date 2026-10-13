import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Card } from "@/components/ui/Card";

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Ocupa todo el ancho de la grilla. */
  wide?: boolean;
}

export function ChartCard({ title, subtitle, children, wide }: ChartCardProps) {
  return (
    <Card
      as="section"
      className={cn(
        "min-w-0 rounded-[14px] p-4 min-[481px]:px-6 min-[481px]:py-5",
        wide && "@3xl:col-span-full",
      )}
    >
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="text-content-subtle mt-0.5 mb-5 text-xs">{subtitle}</p>
      <div className="h-60 min-[481px]:h-[300px]">{children}</div>
    </Card>
  );
}
