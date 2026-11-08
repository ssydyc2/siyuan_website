/** Static 2D figure used when WebGL is unavailable. */
export default function SceneFallback() {
  return (
    <figure className="about-fallback">
      <svg viewBox="0 0 420 340" role="img" aria-labelledby="home-figure-title">
        <title id="home-figure-title">Level curves of a convex function, with one descent drawn in</title>
        <text
          x="24"
          y="34"
          fill="var(--ink-faint)"
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="0.14em"
        >
          FIG. 1
        </text>
        <text
          x="396"
          y="34"
          fill="var(--ink-faint)"
          fontFamily="var(--font-mono)"
          fontSize="12"
          textAnchor="end"
        >
          f(x, y)
        </text>
        <line x1="24" y1="52" x2="396" y2="52" stroke="var(--rule)" />
        <g fill="none" transform="rotate(-22 214 178)">
          <ellipse cx="214" cy="178" rx="136" ry="88" stroke="var(--rule-strong)" strokeWidth="1.25" />
          <ellipse cx="214" cy="178" rx="90" ry="58" stroke="var(--ink-faint)" strokeWidth="1.25" />
          <ellipse cx="214" cy="178" rx="46" ry="30" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.35" />
        </g>
        <polyline
          points="72,96 108,116 140,134 168,150 192,162 214,178"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g fill="var(--paper-elevated)" stroke="var(--accent)" strokeWidth="1.5">
          <circle cx="72" cy="96" r="3.25" />
          <circle cx="108" cy="116" r="3.25" />
          <circle cx="140" cy="134" r="3.25" />
          <circle cx="168" cy="150" r="3.25" />
          <circle cx="192" cy="162" r="3.25" />
        </g>
        <circle cx="214" cy="178" r="4" fill="var(--accent)" />
        <text
          x="228"
          y="168"
          fill="var(--ink-muted)"
          fontFamily="var(--font-serif)"
          fontSize="15"
          fontStyle="italic"
        >
          x*
        </text>
      </svg>
    </figure>
  );
}
