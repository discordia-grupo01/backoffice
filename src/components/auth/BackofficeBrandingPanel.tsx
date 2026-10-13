import { Check } from "lucide-react";
import Image from "next/image";

const FLOATING_DOTS = [
  { x: "18%", y: "28%", r: 5, color: "#245C6B" },
  { x: "62%", y: "18%", r: 3, color: "#fce3a4" },
  { x: "78%", y: "55%", r: 4, color: "#6b95bd" },
  { x: "32%", y: "72%", r: 3, color: "#38A169" },
  { x: "72%", y: "78%", r: 4, color: "#A8C6DF" },
];

const STATS = [
  { value: "1.284", label: "Usuarios" },
  { value: "96", label: "Servidores" },
  { value: "7", label: "Reportes" },
];

const BAR_HEIGHTS = [38, 55, 44, 70, 62, 85, 74, 100, 80, 92];

const QUEUE = [
  {
    width: "62%",
    line: "rgba(168,198,223,0.2)",
    avatar: "linear-gradient(135deg,#e8a800,#b37d00)",
    pill: "rgba(224,82,82,0.55)",
  },
  {
    width: "48%",
    line: "rgba(168,198,223,0.14)",
    avatar: "linear-gradient(135deg,#6b95bd,#2d5a7a)",
    pill: "rgba(240,178,50,0.5)",
  },
  {
    width: "70%",
    line: "rgba(168,198,223,0.1)",
    avatar: "linear-gradient(135deg,#38A169,#1e5c3a)",
    pill: "rgba(56,161,105,0.45)",
  },
];

const POINTS = ["Moderación", "Usuarios y servidores", "Auditoría de acciones"];

function HexGrid() {
  const hexagons = [0, 1, 2, 3].flatMap((row) =>
    [0, 1, 2].map((col) => {
      const x = col * 80 + (row % 2) * 40 + 60;
      const y = row * 70 + 60;
      return (
        <polygon
          key={`${row}-${col}`}
          points={`${x},${y - 30} ${x + 26},${y - 15} ${x + 26},${y + 15} ${x},${y + 30} ${x - 26},${y + 15} ${x - 26},${y - 15}`}
          fill="none"
          stroke="#A8C6DF"
          strokeWidth="1"
        />
      );
    }),
  );

  return (
    <svg
      style={{ position: "absolute", top: 0, right: 0, opacity: 0.07 }}
      width="380"
      height="380"
      viewBox="0 0 380 380"
    >
      {hexagons}
    </svg>
  );
}

/** Mockup de una consola de administración: métricas, actividad y cola de reportes. */
function ConsoleMockup() {
  return (
    <div className="console">
      <div className="console-bar">
        <span className="dot" style={{ background: "#e05252" }} />
        <span className="dot" style={{ background: "#F0B232" }} />
        <span className="dot" style={{ background: "#38A169" }} />
        <span className="console-url" />
      </div>
      <div className="console-body">
        <div className="stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat">
              <div className="stat-value font-display">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="bars">
          {BAR_HEIGHTS.map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="queue">
          {QUEUE.map((row) => (
            <div key={row.width} className="queue-row">
              <span className="avatar" style={{ background: row.avatar }} />
              <span
                className="queue-line"
                style={{ width: row.width, background: row.line }}
              />
              <span className="pill" style={{ background: row.pill }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Panel izquierdo del login (solo desktop). Decorativo: marca, mockup de la
 * consola de administración y qué se gestiona desde acá.
 */
export function BackofficeBrandingPanel() {
  return (
    <div className="brand">
      <div className="brand-deco" aria-hidden="true">
        <div
          className="orb"
          style={{
            top: -80,
            left: -80,
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(36,92,107,0.5) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="orb"
          style={{
            bottom: -96,
            right: 0,
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(107,149,189,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="orb"
          style={{
            top: "40%",
            right: "25%",
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(252,227,164,0.08) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <HexGrid />
        {FLOATING_DOTS.map((dot) => (
          <div
            key={`${dot.x}-${dot.y}`}
            className="orb"
            style={{
              left: dot.x,
              top: dot.y,
              width: dot.r * 2,
              height: dot.r * 2,
              background: dot.color,
              boxShadow: `0 0 ${dot.r * 5}px ${dot.color}90`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div className="brand-logo">
        <Image
          src="/logo-light.png"
          alt="discordia"
          width={1010}
          height={269}
          priority
        />
        <span className="brand-tag font-display">Backoffice</span>
      </div>

      <div className="brand-stage">
        <ConsoleMockup />
      </div>

      <div className="brand-claim">
        <h1 className="font-display">
          Cuidá la comunidad
          <br />
          <span>desde un solo lugar.</span>
        </h1>
        <p>
          Gestioná usuarios y servidores, resolvé reportes y mantené Discordia
          seguro para todos.
        </p>
        <ul className="brand-points">
          {POINTS.map((point) => (
            <li key={point}>
              <Check size={14} aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
