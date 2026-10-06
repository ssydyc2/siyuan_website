import { useId, useState, type PointerEvent } from 'react';
import type { Simulation } from '../lib/wealth';
import { compactMoney, exactMoney, money } from '../lib/wealth-format';

export default function WealthChart({ simulation, principal }: { simulation: Simulation; principal: number }) {
  const id = useId();
  const [cursor, setCursor] = useState<number | null>(null);
  const rows = simulation.rows;
  const points = [
    { year: rows[0].year - 1, balance: principal, realBalance: principal, source: 'start' },
    ...rows.map((row) => ({ year: row.year, balance: row.closingBalance, realBalance: row.realBalance, source: row.source })),
  ];
  const selectedIndex = cursor === null ? rows.length : Math.min(cursor, rows.length);
  const selected = points[selectedIndex];
  const ceiling = Math.max(principal, ...points.map((point) => point.balance)) * 1.08;
  const x = (index: number) => 1000 * index / rows.length;
  const y = (balance: number) => 300 * (1 - balance / ceiling);
  const line = (real: boolean) => points.map((point, index) => `${x(index)},${y(real ? point.realBalance : point.balance)}`).join(' ');
  const projected = rows.length > 30;
  const boundary = x(30);

  function moveCursor(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    setCursor(Math.round(fraction * rows.length));
  }

  return (
    <section className="wealth-panel" aria-labelledby={`${id}-title`}>
      <div className="wealth-section-heading">
        <div>
          <p className="wealth-eyebrow">The journey</p>
          <h2 id={`${id}-title`} className="wealth-section-title">Your portfolio, year by year</h2>
        </div>
        <div className="wealth-legend" aria-label="Chart legend">
          <span><i className="wealth-legend-line" />Balance</span>
          <span><i className="wealth-legend-line wealth-legend-line--real" />Purchasing power</span>
        </div>
      </div>
      {projected && (
        <p className="wealth-chart-note">Shaded area: projection begins in 2026, after 30 historical years.</p>
      )}
      <div className="wealth-chart">
        <div className="wealth-chart-axis" aria-hidden="true">
          {[1, 0.75, 0.5, 0.25, 0].map((fraction) => <span key={fraction}>{compactMoney(ceiling * fraction)}</span>)}
        </div>
        <div className="wealth-chart-plot">
          <svg
            viewBox="0 0 1000 300" preserveAspectRatio="none" role="img"
            aria-labelledby={`${id}-chart-title ${id}-description`}
            onPointerMove={moveCursor} onPointerDown={moveCursor}
          >
            <title id={`${id}-chart-title`}>Portfolio balance and purchasing power, {points[0].year}–{points[points.length - 1].year}</title>
            <desc id={`${id}-description`}>Both lines begin at {money(principal)}. Final balance: {exactMoney(simulation.finalBalance)}. Final purchasing power: {exactMoney(simulation.finalRealBalance)}. Use the year slider below to inspect each point; all values are also in the annual table.</desc>
            {projected && <rect x={boundary} y="0" width={1000 - boundary} height="300" className="wealth-chart-forecast" />}
            {[0, 75, 150, 225, 300].map((height) => <line key={height} x1="0" x2="1000" y1={height} y2={height} className="wealth-chart-grid" vectorEffect="non-scaling-stroke" />)}
            <polygon points={`0,300 ${line(false)} 1000,300`} className="wealth-chart-fill" />
            {projected && <line x1={boundary} x2={boundary} y1="0" y2="300" className="wealth-chart-boundary" vectorEffect="non-scaling-stroke" />}
            <polyline points={line(false)} className="wealth-chart-line" vectorEffect="non-scaling-stroke" />
            <polyline points={line(true)} className="wealth-chart-line wealth-chart-line--real" vectorEffect="non-scaling-stroke" />
            <line x1={x(selectedIndex)} x2={x(selectedIndex)} y1="0" y2="300" className="wealth-chart-cursor" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="wealth-chart-point" style={{ left: `${selectedIndex / rows.length * 100}%`, top: `${(1 - selected.balance / ceiling) * 100}%` }} aria-hidden="true" />
          <div className="wealth-chart-years" aria-hidden="true">
            <span>{points[0].year} · Start</span>
            {projected && <span className="wealth-chart-year-boundary" style={{ left: `${30 / rows.length * 100}%` }}>2025</span>}
            <span>{points[points.length - 1].year}</span>
          </div>
        </div>
      </div>
      <label className="wealth-sr-only" htmlFor={`${id}-year`}>Inspect chart year</label>
      <input
        id={`${id}-year`} className="wealth-chart-slider" type="range" min="0" max={rows.length}
        value={selectedIndex} onChange={(event) => setCursor(Number(event.target.value))}
        aria-valuetext={`${selected.year}, ${selected.source === 'start' ? 'starting portfolio' : selected.source}, balance ${exactMoney(selected.balance)}, purchasing power ${exactMoney(selected.realBalance)}`}
      />
      <div className="wealth-chart-readout" aria-live="polite" aria-atomic="true">
        <span><strong>{selected.year}</strong><span className="wealth-badge">{selected.source}</span></span>
        <span>Balance <strong title={exactMoney(selected.balance)}>{money(selected.balance)}</strong></span>
        <span>Purchasing power <strong title={exactMoney(selected.realBalance)}>{money(selected.realBalance)}</strong></span>
      </div>
    </section>
  );
}
