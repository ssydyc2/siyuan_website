export function QuinticPlate() {
  return (
    <p className="quintic-equation" role="img" aria-label="x to the fifth minus 4x plus 2 equals zero. x equals question mark.">
      <span className="quintic-equation__line">
        <span>x</span>
        <sup>5</sup>
        <span> − 4x + 2 = 0</span>
      </span>
      <span className="quintic-equation__line quintic-equation__line--ask">x = ?</span>
    </p>
  );
}

export function RolloutTrainPlate({ wide = false }: { wide?: boolean }) {
  if (wide) {
    return (
      <svg viewBox="0 0 960 520" role="img" aria-label="A loop between rollout and training">
        <title>A loop between rollout and training</title>
        <path
          d="M210 250 A270 145 0 0 0 750 250"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <path
          d="M750 250 A270 145 0 0 0 210 250"
          fill="none"
          stroke="var(--secondary-accent)"
          strokeWidth="1.8"
          strokeDasharray="6 4.5"
          strokeLinecap="round"
        />
        <g fill="var(--paper-elevated)" stroke="var(--accent)" strokeWidth="2">
          <circle cx="210" cy="250" r="6" />
          <circle cx="750" cy="250" r="6" />
        </g>
        <text x="480" y="78" fill="var(--ink-faint)" fontFamily="var(--font-serif)" fontSize="22" textAnchor="middle">
          weights
        </text>
        <text x="210" y="468" fill="var(--ink-muted)" fontFamily="var(--font-serif)" fontSize="24" textAnchor="middle">
          rollout
        </text>
        <text x="480" y="468" fill="var(--ink-faint)" fontFamily="var(--font-serif)" fontSize="22" textAnchor="middle">
          experience
        </text>
        <text x="750" y="468" fill="var(--ink-muted)" fontFamily="var(--font-serif)" fontSize="24" textAnchor="middle">
          train
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 480 340" role="img" aria-label="A loop between rollout and training">
      <title>A loop between rollout and training</title>
      <text
        x="24"
        y="34"
        fill="var(--ink-faint)"
        fontFamily="var(--font-mono)"
        fontSize="12"
        letterSpacing="0.04em"
      >
        rollout / train
      </text>
      <line x1="24" y1="52" x2="456" y2="52" stroke="var(--rule)" />
      <path
        d="M120 178 A128 56 0 0 0 376 178"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <path
        d="M376 178 A128 56 0 0 0 120 178"
        fill="none"
        stroke="var(--secondary-accent)"
        strokeWidth="1.45"
        strokeDasharray="4 3.5"
        strokeLinecap="round"
      />
      <g fill="var(--paper-elevated)" stroke="var(--accent)" strokeWidth="1.6">
        <circle cx="120" cy="178" r="4.2" />
        <circle cx="376" cy="178" r="4.2" />
      </g>
      <text x="248" y="104" fill="var(--ink-faint)" fontFamily="var(--font-mono)" fontSize="12" textAnchor="middle">
        weights
      </text>
      <text x="120" y="268" fill="var(--ink-muted)" fontFamily="var(--font-serif)" fontSize="15" textAnchor="middle">
        rollout
      </text>
      <text x="248" y="268" fill="var(--ink-faint)" fontFamily="var(--font-mono)" fontSize="12" textAnchor="middle">
        experience
      </text>
      <text x="376" y="268" fill="var(--ink-muted)" fontFamily="var(--font-serif)" fontSize="15" textAnchor="middle">
        train
      </text>
    </svg>
  );
}
