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
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="text-sky absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,#000_0%,transparent_75%)] opacity-[0.07]"
        viewBox="0 0 980 500"
        preserveAspectRatio="xMidYMid slice"
      >
        {hexagons}
      </svg>
    </div>
  );
}
