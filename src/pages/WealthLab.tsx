import { Fragment, useState } from 'react';
import WealthChart from '../components/WealthChart';
import { HISTORICAL_CAGR, HISTORICAL_INFLATION, WEALTH_HISTORY } from '../data/wealth-history';
import { buildAnnualPath, calculateScenario, type Simulation, type SpendingMode, type SpendingSolution, type TargetKind } from '../lib/wealth';
import { exactMoney, money, percentage } from '../lib/wealth-format';

type InflationPreset = 'history' | '3' | '4' | '5' | 'custom';
type ReturnPreset = 'history' | '5' | '7' | '10' | 'custom';

function readNumber(value: string) {
  return value.trim() === '' ? NaN : Number(value);
}

function BudgetCard({ kind, solution, selected, onSelect }: {
  kind: TargetKind; solution: SpendingSolution; selected: boolean; onSelect: () => void;
}) {
  return (
    <button type="button" className={`wealth-budget ${selected ? 'wealth-budget--selected' : ''}`} aria-pressed={selected} onClick={onSelect}>
      <span className="wealth-budget-heading">
        <span className="wealth-eyebrow">{kind === 'nominal' ? 'Keep the dollar amount' : 'Keep the purchasing power'}</span>
        <span className="wealth-budget-radio" aria-hidden="true">{selected ? '●' : '○'}</span>
      </span>
      <span className="wealth-budget-title">{kind === 'nominal' ? 'Preserve your principal' : 'Preserve its real value'}</span>
      {solution.reachable ? (
        <>
          <span className="wealth-budget-amount" title={exactMoney(solution.initialSpending)}>{money(solution.initialSpending)}<span> / first year</span></span>
          <span className="wealth-budget-monthly">{money(solution.initialSpending / 12)} per month in year one</span>
        </>
      ) : (
        <>
          <span className="wealth-budget-unreachable">Target out of reach</span>
          <span className="wealth-budget-monthly">Even with no spending on this return path.</span>
        </>
      )}
      <span className="wealth-budget-footer">End with <strong title={exactMoney(solution.target)}>{money(solution.target)}</strong><span>{selected ? 'Selected target' : 'Select target →'}</span></span>
    </button>
  );
}

function SpendingPlanCard({ simulation, initialSpending, horizon }: {
  simulation: Simulation; initialSpending: number; horizon: number;
}) {
  return (
    <section className="wealth-budget wealth-spending-plan" aria-labelledby="wealth-plan-title" aria-live="polite" aria-atomic="true">
      <p className="wealth-eyebrow">Your spending plan</p>
      <h3 id="wealth-plan-title" className="wealth-budget-title">Ending balance with your budget</h3>
      <p className="wealth-budget-amount" title={exactMoney(simulation.finalBalance)}>{money(simulation.finalBalance)}<span> after {horizon} years</span></p>
      <p className="wealth-budget-monthly">{money(initialSpending)} in year one · {money(initialSpending / 12)} per month</p>
      <dl className="wealth-plan-details">
        <div><dt>In starting-year dollars</dt><dd title={exactMoney(simulation.finalRealBalance)}>{money(simulation.finalRealBalance)}</dd></div>
        <div><dt>Total actually spent</dt><dd title={exactMoney(simulation.totalWithdrawn)}>{money(simulation.totalWithdrawn)}</dd></div>
      </dl>
    </section>
  );
}

export default function WealthLab() {
  const [principalText, setPrincipalText] = useState('1000000');
  const [horizonText, setHorizonText] = useState('30');
  const [inflationPreset, setInflationPreset] = useState<InflationPreset>('history');
  const [customInflation, setCustomInflation] = useState('3');
  const [returnPreset, setReturnPreset] = useState<ReturnPreset>('history');
  const [customReturn, setCustomReturn] = useState('7');
  const [mode, setMode] = useState<SpendingMode>('automatic');
  const [targetKind, setTargetKind] = useState<TargetKind>('nominal');
  const [manualSpending, setManualSpending] = useState('50000');
  const principal = readNumber(principalText);
  const horizon = readNumber(horizonText);
  const inflation = inflationPreset === 'history' ? HISTORICAL_INFLATION
    : readNumber(inflationPreset === 'custom' ? customInflation : inflationPreset) / 100;
  const projectionReturn = returnPreset === 'history' ? HISTORICAL_CAGR
    : readNumber(returnPreset === 'custom' ? customReturn : returnPreset) / 100;

  let error: string | null = null;
  let scenario: ReturnType<typeof calculateScenario> | null = null;
  try {
    scenario = calculateScenario({ principal, inflation, path: buildAnnualPath(horizon, projectionReturn) }, mode, targetKind, readNumber(manualSpending));
  } catch (caught) {
    error = caught instanceof Error ? caught.message : 'Please check your inputs.';
  }
  const invalidPrincipal = !Number.isFinite(principal) || principal <= 0;
  const invalidHorizon = !Number.isInteger(horizon) || horizon < 30 || horizon > 100;
  const invalidInflation = !Number.isFinite(inflation) || inflation < 0 || inflation > 0.2;
  const invalidReturn = !Number.isFinite(projectionReturn) || projectionReturn < -1 || projectionReturn > 1;
  const invalidSpending = mode === 'manual' && (!Number.isFinite(readNumber(manualSpending)) || readNumber(manualSpending) < 0);
  const simulation = scenario?.simulation;

  return (
    <div className="wealth-lab">
      <header className="wealth-intro">
        <p className="wealth-eyebrow">A small experiment in financial freedom</p>
        <h1 className="rpg-page-title wealth-title">Wealth Lab</h1>
        <p>How much could you spend, and still keep your nest egg?</p>
        <p className="wealth-intro-detail">Replay 30 years of the S&amp;P 500. Extend the journey. See what inflation leaves behind.</p>
      </header>

      <section className="wealth-panel wealth-controls" aria-labelledby="wealth-inputs-title">
        <div className="wealth-section-heading">
          <h2 id="wealth-inputs-title" className="wealth-section-title">Set the scene</h2>
          <span className="wealth-badge">All amounts in USD</span>
        </div>
        <div className="wealth-input-grid">
          <div className="wealth-field">
            <label htmlFor="wealth-principal">Starting portfolio</label>
            <div className="wealth-input-unit"><span aria-hidden="true">$</span><input id="wealth-principal" type="number" inputMode="decimal" min="0.01" step="any" value={principalText} onChange={(event) => setPrincipalText(event.target.value)} aria-invalid={invalidPrincipal} aria-describedby={invalidPrincipal ? 'wealth-input-error' : undefined} /></div>
            <span className="wealth-field-hint">Your starting nest egg</span>
          </div>
          <div className="wealth-field">
            <label htmlFor="wealth-horizon">Total years</label>
            <div className="wealth-input-unit"><input id="wealth-horizon" type="number" inputMode="numeric" min="30" max="100" step="1" value={horizonText} onChange={(event) => setHorizonText(event.target.value)} aria-invalid={invalidHorizon} aria-describedby={invalidHorizon ? 'wealth-input-error' : undefined} /><span aria-hidden="true">years</span></div>
            <div className="wealth-presets" aria-label="Year presets">{[30, 40, 50].map((years) => <button type="button" key={years} aria-pressed={horizon === years} onClick={() => setHorizonText(String(years))}>{years}</button>)}</div>
          </div>
          <div className="wealth-field">
            <label htmlFor="wealth-inflation">Annual inflation</label>
            <select id="wealth-inflation" value={inflationPreset} onChange={(event) => setInflationPreset(event.target.value as InflationPreset)}>
              <option value="history">Historical average · {percentage(HISTORICAL_INFLATION)}</option>
              <option value="3">3%</option><option value="4">4%</option><option value="5">5%</option><option value="custom">Custom rate</option>
            </select>
            {inflationPreset === 'custom' ? <div className="wealth-input-unit wealth-custom-inflation"><label className="wealth-sr-only" htmlFor="wealth-custom-inflation">Custom inflation rate (%)</label><input id="wealth-custom-inflation" type="number" inputMode="decimal" min="0" max="20" step="any" value={customInflation} onChange={(event) => setCustomInflation(event.target.value)} aria-invalid={invalidInflation} aria-describedby={invalidInflation ? 'wealth-input-error' : undefined} /><span aria-hidden="true">%</span></div> : null}
            <span className="wealth-field-hint">One fixed rate across the entire journey</span>
          </div>
          <div className="wealth-field">
            <label htmlFor="wealth-return">Projection annual return</label>
            <select id="wealth-return" value={returnPreset} onChange={(event) => setReturnPreset(event.target.value as ReturnPreset)}>
              <option value="history">Historical average · {percentage(HISTORICAL_CAGR)}</option>
              <option value="5">5%</option><option value="7">7%</option><option value="10">10%</option><option value="custom">Custom rate</option>
            </select>
            {returnPreset === 'custom' && <div className="wealth-input-unit wealth-custom-return"><label className="wealth-sr-only" htmlFor="wealth-custom-return">Custom projection return (%)</label><input id="wealth-custom-return" type="number" inputMode="decimal" min="-100" max="100" step="any" value={customReturn} onChange={(event) => setCustomReturn(event.target.value)} aria-invalid={invalidReturn} aria-describedby={invalidReturn ? 'wealth-input-error' : 'wealth-return-help'} /><span aria-hidden="true">%</span></div>}
            <span id="wealth-return-help" className="wealth-field-hint">Applies from year 31. {horizon === 30 ? 'Add years to see its effect.' : 'Historical years keep their actual returns.'}</span>
          </div>
        </div>
        <div className="wealth-assumptions-strip">
          <span><strong>1996–2025</strong> actual annual returns</span>
          <span><strong>{invalidReturn ? '—' : percentage(projectionReturn)}</strong> assumed compound annual return thereafter</span>
        </div>
      </section>

      <section className="wealth-mode-section" aria-labelledby="wealth-mode-title">
        <div className="wealth-section-heading">
          <div><p className="wealth-eyebrow">Choose your experiment</p><h2 id="wealth-mode-title" className="wealth-section-title">What can your portfolio support?</h2></div>
          <div className="wealth-mode-switch" role="group" aria-label="Spending mode">
            <button type="button" aria-pressed={mode === 'automatic'} onClick={() => setMode('automatic')}>Find my budget</button>
            <button type="button" aria-pressed={mode === 'manual'} onClick={() => setMode('manual')}>Try my spending</button>
          </div>
        </div>
        {mode === 'manual' && <div className="wealth-manual-input wealth-field">
          <label htmlFor="wealth-spending">First-year spending</label>
          <div className="wealth-input-unit"><span aria-hidden="true">$</span><input id="wealth-spending" type="number" inputMode="decimal" min="0" step="any" value={manualSpending} onChange={(event) => setManualSpending(event.target.value)} aria-invalid={invalidSpending} aria-describedby={invalidSpending ? 'wealth-input-error' : 'wealth-spending-help'} /></div>
          <p id="wealth-spending-help" className="wealth-field-hint">Your spending increases by {Number.isFinite(inflation) ? percentage(inflation) : 'your chosen inflation rate'} each year. The result card, chart, and annual ledger update with your budget.</p>
        </div>}
        {error && <p id="wealth-input-error" className="wealth-notice wealth-notice--warning" role="alert">{error}</p>}
        {scenario?.mode === 'automatic' && <>
          <div className="wealth-budget-grid" role="group" aria-label="Capital preservation target">
            <BudgetCard kind="nominal" solution={scenario.solutions.nominal} selected={targetKind === 'nominal'} onSelect={() => setTargetKind('nominal')} />
            <BudgetCard kind="real" solution={scenario.solutions.real} selected={targetKind === 'real'} onSelect={() => setTargetKind('real')} />
          </div>
          <p className="wealth-budget-caption">First-year budgets, followed by annual increases of {percentage(inflation)}. Select a target to apply its budget below.</p>
        </>}
        {scenario?.mode === 'manual' && <SpendingPlanCard simulation={scenario.simulation} initialSpending={scenario.initialSpending} horizon={horizon} />}
      </section>

      {scenario && simulation && <>
        {scenario.showingBaseline && <p className="wealth-notice wealth-notice--warning" role="status">This target cannot be reached, even with no withdrawals. The chart and table show the zero-spending baseline.</p>}
        {simulation.depletionYear !== null && <p className="wealth-notice wealth-notice--warning" role="status">Portfolio depleted in {simulation.depletionYear} (year {simulation.depletionYear - WEALTH_HISTORY.startYear + 1}).{simulation.totalShortfall > 0 ? ` Unfunded planned spending: ${money(simulation.totalShortfall)}.` : ''} No further spending or investment returns can be funded.</p>}

        <WealthChart simulation={simulation} principal={principal} />

        <section className="wealth-panel wealth-table-panel" aria-labelledby="wealth-table-title">
          <div className="wealth-section-heading"><div><p className="wealth-eyebrow">Follow the money</p><h2 id="wealth-table-title" className="wealth-section-title">The annual ledger</h2></div><span className="wealth-badge">{horizon} years · {WEALTH_HISTORY.startYear}–{WEALTH_HISTORY.startYear + horizon - 1}</span></div>
          <p id="wealth-table-help" className="wealth-table-help">Withdraw at the start of each year, then invest the rest. Purchasing power is measured in starting-year dollars. Scroll sideways for all columns.</p>
          <div className="wealth-table-scroll" role="region" aria-label="Annual portfolio ledger" aria-describedby="wealth-table-help" tabIndex={0}>
            <table className="wealth-table">
              <caption className="wealth-sr-only">Annual portfolio simulation in USD. Spending grows at {percentage(inflation)} per year.</caption>
              <thead><tr><th scope="col">Year</th><th scope="col">Return</th><th scope="col">Opening</th><th scope="col">Spending</th><th scope="col">Gain / loss</th><th scope="col">Closing</th><th scope="col">Real value</th></tr></thead>
              <tbody>{simulation.rows.map((row) => <Fragment key={row.year}>
                {row.index === 31 && <tr className="wealth-projection-divider"><td colSpan={7}>Projection begins · {percentage(row.rate)} assumed annual return from here</td></tr>}
                <tr className={`${row.source === 'projection' ? 'wealth-table-projection' : ''} ${row.shortfall > 0 ? 'wealth-table-shortfall' : ''}`}>
                  <th scope="row"><span>{row.year}</span><small>Year {row.index} · {row.source === 'historical' ? 'History' : 'Projection'}</small></th>
                  <td className={row.rate < 0 ? 'wealth-negative' : ''}>{percentage(row.rate)}</td>
                  <td title={exactMoney(row.openingBalance)}>{money(row.openingBalance)}</td>
                  <td title={exactMoney(row.plannedSpending)}>{money(row.plannedSpending)}{row.shortfall > 0 && <small className="wealth-negative">Actual: {money(row.withdrawn)}<br />Unfunded: {money(row.shortfall)}</small>}</td>
                  <td title={exactMoney(row.investmentGain)} className={row.investmentGain < 0 ? 'wealth-negative' : ''}>{row.investmentGain > 0 ? '+' : ''}{money(row.investmentGain)}</td>
                  <td title={exactMoney(row.closingBalance)} className="wealth-table-closing">{money(row.closingBalance)}</td>
                  <td title={exactMoney(row.realBalance)}>{money(row.realBalance)}</td>
                </tr>
              </Fragment>)}</tbody>
            </table>
          </div>
        </section>
      </>}

      <section className="wealth-method" aria-labelledby="wealth-method-title">
        <h2 id="wealth-method-title" className="wealth-section-title">Behind the numbers</h2>
        <p>The first 30 years replay annual S&amp;P 500 returns, including dividends, from 1996 through 2025. This is a 30-year period from the end of 1995 to the end of 2025. Additional years use your selected annual return. The default historical option uses the full-precision compound annual return from these 30 years, displayed as {percentage(HISTORICAL_CAGR)}.</p>
        <p>Annual spending = first-year spending × (1 + inflation)<sup>year − 1</sup>. Closing balance = (opening balance − withdrawal) × (1 + annual return). The selected inflation rate stays constant throughout. The monthly figure is the first-year budget divided by 12; withdrawals are modeled annually.</p>
        <p>Preserving principal keeps the initial dollar amount. Preserving purchasing power increases the terminal target by inflation over the full period. Historical average inflation is calculated as (321.9 / 152.4)<sup>1/30</sup> − 1, using annual-average US CPI-U for 1995 and 2025.</p>
        <p>These results describe this historical path and a constant-return projection, not a guarantee of future returns. Taxes, investment fees, exchange rates, and fund tracking differences are excluded.</p>
        <p className="wealth-source-links">Sources: <a href={WEALTH_HISTORY.returnsSource} target="_blank" rel="noreferrer">NYU Stern · S&amp;P 500 annual returns</a> (updated Jan 5, 2026), <a href={WEALTH_HISTORY.inflationSource} target="_blank" rel="noreferrer">Minneapolis Fed · CPI-U</a>. Offline data snapshot: {WEALTH_HISTORY.snapshotDate}. Published returns and CPI values retain their source precision.</p>
      </section>
    </div>
  );
}
