/** Carga del dashboard: mismas proporciones que el contenido real, para que no salte. */
export function MetricsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando métricas">
      <div className="metric-grid">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="metric-card skeleton"
            style={{ height: 150 }}
          />
        ))}
      </div>
      <div className="charts-grid">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className={`chart-card skeleton${item === 0 ? " chart-card-wide" : ""}`}
            style={{ height: 360 }}
          />
        ))}
      </div>
    </div>
  );
}
