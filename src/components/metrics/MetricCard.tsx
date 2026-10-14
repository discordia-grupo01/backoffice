import { Card } from "@/components/ui/Card";

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  /** Variable CSS del color de la barra superior, p. ej. `--chart-1`. */
  accentVar: string;
}

export function MetricCard({ label, value, hint, accentVar }: MetricCardProps) {
  return (
    <Card as="article" className="rounded-xl p-4 min-[481px]:p-5">
      <span
        className="mb-4 block h-2 w-9 rounded-full"
        style={{ background: `var(${accentVar})` }}
        aria-hidden="true"
      />
      <p className="font-mono text-[26px] font-bold tabular-nums min-[481px]:text-2xl">
        {value}
      </p>
      <h3
        className="mt-1 mb-2 text-sm font-semibold"
        style={{ color: `var(${accentVar})` }}
      >
        {label}
      </h3>
      <p className="bg-surface-input text-content-muted rounded-lg p-2 text-xs">
        {hint}
      </p>
    </Card>
  );
}
