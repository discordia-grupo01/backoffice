import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Ocupa todo el ancho de la grilla. */
  wide?: boolean;
}

export function ChartCard({ title, subtitle, children, wide }: ChartCardProps) {
  return (
    <section className={wide ? "chart-card chart-card-wide" : "chart-card"}>
      <h2 className="chart-title font-display">{title}</h2>
      <p className="chart-subtitle">{subtitle}</p>
      <div className="chart-body">{children}</div>
    </section>
  );
}
