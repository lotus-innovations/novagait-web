/**
 * The stride motif: gait-cycle lines with footfall marks. Decorative only:
 * every instance is aria-hidden; meaning is always carried by nearby text.
 */

export function StrideDivider() {
  return (
    <div className="mx-auto max-w-6xl px-6" aria-hidden="true">
      <svg
        viewBox="0 0 640 24"
        className="w-full text-border"
        focusable="false"
      >
        <path
          d="M0 12 H640"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        {[80, 240, 400, 560].map((x, i) => (
          <ellipse
            key={x}
            cx={x}
            cy={12}
            rx="4"
            ry="6"
            transform={`rotate(${i % 2 === 0 ? -14 : 14} ${x} 12)`}
            fill="currentColor"
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * A stylized gait-cycle chart, the kind a gait lab produces: the vertical
 * oscillation of the body's center of mass across one full stride, with the
 * four classic phases marked. Purely decorative (aria-hidden); the hero copy
 * next to it carries the meaning.
 */
export function GaitCycle({ className = "" }: { className?: string }) {
  const phases = [
    { x: 30, label: "Heel strike" },
    { x: 150, label: "Midstance" },
    { x: 270, label: "Toe-off" },
    { x: 390, label: "Swing" },
  ];
  return (
    <svg
      viewBox="0 0 460 320"
      className={`stride-path ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* chart frame */}
      <line
        x1="20"
        y1="240"
        x2="440"
        y2="240"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      {/* cycle percentage ticks */}
      {[
        { x: 30, t: "0%" },
        { x: 230, t: "50%" },
        { x: 430, t: "100%" },
      ].map((m) => (
        <g key={m.t}>
          <line
            x1={m.x}
            y1="240"
            x2={m.x}
            y2="248"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          <text
            x={m.x}
            y="266"
            textAnchor="middle"
            fontSize="13"
            fill="var(--text-muted)"
            fontFamily="inherit"
          >
            {m.t}
          </text>
        </g>
      ))}
      {/* phase guides */}
      {phases.map((p) => (
        <line
          key={p.label}
          x1={p.x}
          y1="80"
          x2={p.x}
          y2="240"
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      ))}
      {/* center-of-mass oscillation across one stride: two smooth crests */}
      <path
        className="stride-line"
        d="M30 190 C 80 130 130 130 170 168 S 240 210 280 172 C 320 134 370 132 430 186"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* phase markers on the curve */}
      {[
        { x: 30, y: 190 },
        { x: 150, y: 140 },
        { x: 270, y: 178 },
        { x: 390, y: 142 },
      ].map((p, i) => (
        <circle
          key={i}
          className="stride-mark"
          cx={p.x}
          cy={p.y}
          r="6"
          fill="var(--bg)"
          stroke="var(--primary)"
          strokeWidth="3"
        />
      ))}
      {/* footfalls below the axis, alternating left/right */}
      {[
        { x: 60, o: 0.35, r: -14 },
        { x: 170, o: 0.55, r: 14 },
        { x: 285, o: 0.75, r: -14 },
        { x: 400, o: 1, r: 14 },
      ].map((f) => (
        <ellipse
          key={f.x}
          className="stride-mark"
          cx={f.x}
          cy={292}
          rx="7"
          ry="11"
          transform={`rotate(${f.r} ${f.x} 292)`}
          fill="var(--accent)"
          opacity={f.o}
        />
      ))}
      {/* phase labels */}
      {phases.map((p) => (
        <text
          key={p.label}
          x={p.x + 6}
          y="72"
          fontSize="13"
          fontWeight="600"
          letterSpacing="0.08em"
          fill="var(--text-muted)"
          fontFamily="inherit"
        >
          {p.label.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}
