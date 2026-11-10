import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { formatMetricValue } from "@/utils/chartFormat";

interface MetricCardProps {
  label: string;
  value: number;
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
  const { display, exact } = formatMetricValue(value);

  return (
    <Card
      as="article"
      className={cn(
        "@container min-w-0 rounded-xl p-4 min-[481px]:p-5",
        inset && "bg-surface-input min-[481px]:p-4",
      )}
    >
      <span
        className="mb-4 block h-2 w-9 rounded-full"
        style={{ background: `var(${accentVar})` }}
        aria-hidden="true"
      />
      <p className="font-mono text-[clamp(1rem,14cqi,1.625rem)] font-bold whitespace-nowrap tabular-nums min-[481px]:text-[clamp(1rem,14cqi,1.5rem)]">
        {exact ? (
          <Tooltip label={exact}>
            <span aria-hidden="true">{display}</span>
            <span className="sr-only">{exact}</span>
          </Tooltip>
        ) : (
          display
        )}
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
