import { HISTORICAL_CAGR, HISTORICAL_RETURNS, WEALTH_HISTORY } from '../data/wealth-history';

export type TargetKind = 'nominal' | 'real';
export type SpendingMode = 'automatic' | 'manual';

export interface AnnualReturn {
  year: number;
  rate: number;
  source: 'historical' | 'projection';
}

export interface WealthInputs {
  principal: number;
  inflation: number;
  path: readonly AnnualReturn[];
}

export interface WealthRow extends AnnualReturn {
  index: number;
  openingBalance: number;
  plannedSpending: number;
  withdrawn: number;
  shortfall: number;
  investmentGain: number;
  closingBalance: number;
  realBalance: number;
}

export interface Simulation {
  rows: WealthRow[];
  finalBalance: number;
  finalRealBalance: number;
  totalWithdrawn: number;
  totalShortfall: number;
  depletionYear: number | null;
}

export type SpendingSolution = {
  reachable: true;
  initialSpending: number;
  target: number;
  simulation: Simulation;
  residual: number;
} | {
  reachable: false;
  initialSpending: null;
  target: number;
  maxFinalBalance: number;
};

function finite(value: number): number {
  if (!Number.isFinite(value)) throw new RangeError('Values are too large to calculate. Try a smaller amount.');
  return value;
}

function validateInputs({ principal, inflation, path }: WealthInputs) {
  if (!Number.isFinite(principal) || principal <= 0) throw new RangeError('Enter a starting portfolio greater than zero.');
  if (!Number.isFinite(inflation) || inflation < 0 || inflation > 0.2) throw new RangeError('Enter an inflation rate from 0% to 20%.');
  if (path.length === 0 || path.length > 100) throw new RangeError('The return path must contain 1–100 years.');
  if (path.some((entry) => !Number.isInteger(entry.year) || !Number.isFinite(entry.rate) || entry.rate < -1)) {
    throw new RangeError('The return path contains an invalid year or return.');
  }
}

export function buildAnnualPath(horizon: number, projectionReturn = HISTORICAL_CAGR): AnnualReturn[] {
  if (!Number.isInteger(horizon) || horizon < 30 || horizon > 100) throw new RangeError('Enter a whole number of years from 30 to 100.');
  if (!Number.isFinite(projectionReturn) || projectionReturn < -1 || projectionReturn > 1) {
    throw new RangeError('Enter a projection return from −100% to 100%.');
  }
  return Array.from({ length: horizon }, (_, index) => {
    const historical = HISTORICAL_RETURNS[index];
    return historical
      ? { ...historical, source: 'historical' }
      : { year: WEALTH_HISTORY.startYear + index, rate: projectionReturn, source: 'projection' };
  });
}

export function terminalTarget(inputs: WealthInputs, kind: TargetKind): number {
  validateInputs(inputs);
  return finite(inputs.principal * (kind === 'real' ? (1 + inputs.inflation) ** inputs.path.length : 1));
}

export function simulateWealth(inputs: WealthInputs, initialSpending: number): Simulation {
  validateInputs(inputs);
  if (!Number.isFinite(initialSpending) || initialSpending < 0) throw new RangeError('Enter a first-year spending amount of zero or more.');
  let balance = inputs.principal;
  let totalWithdrawn = 0;
  let totalShortfall = 0;
  let depletionYear: number | null = null;
  const rows = inputs.path.map((entry, index): WealthRow => {
    const openingBalance = balance;
    const plannedSpending = finite(initialSpending * (1 + inputs.inflation) ** index);
    const withdrawn = Math.min(openingBalance, plannedSpending);
    const shortfall = plannedSpending - withdrawn;
    const invested = openingBalance - withdrawn;
    const investmentGain = invested === 0 ? 0 : finite(invested * entry.rate);
    balance = finite(invested * (1 + entry.rate));
    totalWithdrawn = finite(totalWithdrawn + withdrawn);
    totalShortfall = finite(totalShortfall + shortfall);
    if (balance === 0 && depletionYear === null) depletionYear = entry.year;
    return {
      ...entry, index: index + 1, openingBalance, plannedSpending, withdrawn, shortfall,
      investmentGain, closingBalance: balance, realBalance: balance / (1 + inputs.inflation) ** (index + 1),
    };
  });
  return {
    rows, finalBalance: balance, finalRealBalance: rows[rows.length - 1].realBalance,
    totalWithdrawn, totalShortfall, depletionYear,
  };
}

export function solveInitialSpending(inputs: WealthInputs, kind: TargetKind): SpendingSolution {
  const target = terminalTarget(inputs, kind);
  // V_t = assetCoefficient * P - spendingCoefficient * W.
  // Contributions to spending are also exposed to that year's return:
  // withdrawals happen BEFORE investment growth.
  let assetCoefficient = 1;
  let spendingCoefficient = 0;
  for (const [index, entry] of inputs.path.entries()) {
    assetCoefficient = finite(assetCoefficient * (1 + entry.rate));
    spendingCoefficient = finite((spendingCoefficient + (1 + inputs.inflation) ** index) * (1 + entry.rate));
  }
  const maxFinalBalance = finite(inputs.principal * assetCoefficient);
  if (maxFinalBalance < target || spendingCoefficient === 0) {
    return { reachable: false, initialSpending: null, target, maxFinalBalance };
  }
  const initialSpending = (maxFinalBalance - target) / spendingCoefficient;
  const simulation = simulateWealth(inputs, initialSpending);
  const residual = simulation.finalBalance - target;
  if (Math.abs(residual) > 0.01) {
    throw new RangeError('This projection is too large to solve accurately. Try a lower return, fewer years, or a smaller portfolio.');
  }
  return { reachable: true, initialSpending, target, simulation, residual };
}

/** One derivation shared by both UI modes; never round the solved withdrawal. */
export function calculateScenario(inputs: WealthInputs, mode: SpendingMode, targetKind: TargetKind, manualSpending: number) {
  const solutions = {
    nominal: solveInitialSpending(inputs, 'nominal'),
    real: solveInitialSpending(inputs, 'real'),
  };
  const selected = solutions[targetKind];
  const initialSpending = mode === 'manual' ? manualSpending : selected.initialSpending ?? 0;
  const simulation = mode === 'automatic' && selected.reachable ? selected.simulation : simulateWealth(inputs, initialSpending);
  return { solutions, initialSpending, simulation, showingBaseline: mode === 'automatic' && !selected.reachable };
}
