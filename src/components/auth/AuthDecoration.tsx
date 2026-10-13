export function AuthDecoration() {
  const hexagons = Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: 12 }, (_, col) => {
      const x = col * 80 + (row % 2) * 40 + 20;
      const y = row * 70 + 40;
      return (
        <polygon
          key={`${row}-${col}`}
          points={`${x},${y - 30} ${x + 26},${y - 15} ${x + 26},${y + 15} ${x},${y + 30} ${x - 26},${y + 15} ${x - 26},${y - 15}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      );
    }),
  ).flat();

  return (
    <div className="auth-deco" aria-hidden="true">
      <div className="auth-glow" />
      <svg
        className="auth-hex"
        viewBox="0 0 980 500"
        preserveAspectRatio="xMidYMid slice"
      >
        {hexagons}
      </svg>
    </div>
  );
}
