interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  /** Variable CSS del color de la barra superior, p. ej. `--chart-1`. */
  accentVar: string;
}

export function MetricCard({ label, value, hint, accentVar }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span
        className="metric-accent"
        style={{ background: `var(${accentVar})` }}
        aria-hidden="true"
      />
      <p className="metric-value font-display">{value}</p>
      <h3 className="metric-label" style={{ color: `var(${accentVar})` }}>
        {label}
      </h3>
      <p className="metric-hint">{hint}</p>
    </article>
  );
}
