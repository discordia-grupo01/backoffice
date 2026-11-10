import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  accentVar: string;
  inset?: boolean;
}

export function MetricCard({
  label,
  value,
  hint,
  accentVar,
  inset = false,
}: MetricCardProps) {
  return (
    <Card
      as="article"
      className={cn(
        "rounded-xl p-4 min-[481px]:p-5",
        inset && "bg-surface-input min-[481px]:p-4",
      )}
    >
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
      <p
        className={cn(
          "text-content-muted text-xs",
          !inset && "bg-surface-input rounded-lg p-2",
        )}
      >
        {hint}
      </p>
    </Card>
  );
}
