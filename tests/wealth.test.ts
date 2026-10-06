import { describe, expect, test } from 'bun:test';
import { HISTORICAL_CAGR, HISTORICAL_GROWTH, HISTORICAL_INFLATION, HISTORICAL_RETURNS, WEALTH_HISTORY } from '../src/data/wealth-history';
import { buildAnnualPath, calculateScenario, simulateWealth, solveInitialSpending, terminalTarget, type WealthInputs } from '../src/lib/wealth';

function inputs(rates: number[], inflation = 0, principal = 100): WealthInputs {
  return { principal, inflation, path: rates.map((rate, index) => ({ year: 2000 + index, rate, source: 'historical' })) };
}

describe('fixed historical dataset and forecast boundary', () => {
  test('contains exactly the 30 complete years 1996–2025', () => {
    expect(HISTORICAL_RETURNS.map((entry) => entry.year)).toEqual(Array.from({ length: 30 }, (_, i) => 1996 + i));
    expect(HISTORICAL_RETURNS[12].rate).toBe(-0.3655);
    expect(HISTORICAL_RETURNS[29].rate).toBe(0.1778);
    expect(WEALTH_HISTORY.cpiStart).toEqual({ year: 1995, value: 152.4 });
    expect(WEALTH_HISTORY.cpiEnd).toEqual({ year: 2025, value: 321.9 });
  });
  test('compound rates reproduce stock growth and CPI growth', () => {
    expect((1 + HISTORICAL_CAGR) ** 30).toBeCloseTo(HISTORICAL_GROWTH, 10);
    expect((1 + HISTORICAL_INFLATION) ** 30).toBeCloseTo(321.9 / 152.4, 12);
    // Source endpoints corroborate the growth independently of the formula.
    expect(HISTORICAL_GROWTH).toBeCloseTo(1157598.95 / 61838.19, 1);
  });
  test('50 years means 30 historical years followed by 20 projections', () => {
    const path = buildAnnualPath(50);
    expect(path).toHaveLength(50);
    expect(path.filter((entry) => entry.source === 'historical')).toHaveLength(30);
    expect(path[29]).toEqual({ year: 2025, rate: 0.1778, source: 'historical' });
    expect(path[30]).toEqual({ year: 2026, rate: HISTORICAL_CAGR, source: 'projection' });
    expect(path[49]).toEqual({ year: 2045, rate: HISTORICAL_CAGR, source: 'projection' });
    expect(buildAnnualPath(30).every((entry) => entry.source === 'historical')).toBe(true);
  });
  test.each([29, 101, 30.5, NaN, Infinity])('rejects invalid horizon %s', (horizon) => {
    expect(() => buildAnnualPath(horizon)).toThrow();
  });
  test('custom projection returns leave the complete historical return sequence unchanged', () => {
    const historical = buildAnnualPath(30);
    for (const rate of [-1, -0.05, 0, 0.05, 0.07, 0.1, 1]) {
      const path = buildAnnualPath(50, rate);
      expect(path.slice(0, 30)).toEqual(historical);
      expect(path.slice(30).every((entry) => entry.source === 'projection' && entry.rate === rate)).toBe(true);
      expect(buildAnnualPath(30, rate)).toEqual(historical);
    }
  });
  test.each([-1.01, 1.01, NaN, Infinity])('rejects invalid projection return %s', (rate) => {
    expect(() => buildAnnualPath(50, rate)).toThrow('Enter an annual return');
    expect(() => buildAnnualPath(30, rate, 'fixed')).toThrow('Enter an annual return');
  });
  test('fixed-return paths apply the selected rate to every year and mark their source', () => {
    for (const horizon of [30, 50, 100]) {
      for (const rate of [-1, -0.05, 0, 0.05, 0.07, HISTORICAL_CAGR, 1]) {
        const path = buildAnnualPath(horizon, rate, 'fixed');
        expect(path).toHaveLength(horizon);
        expect(path.every((entry) => entry.rate === rate && entry.source === 'fixed')).toBe(true);
        expect(path[0].year).toBe(1996);
        expect(path.at(-1)!.year).toBe(1995 + horizon);
      }
    }
  });
  test('a 30-year historical replay ignores the unused forecast rate', () => {
    for (const rate of [-1.01, 1.01, NaN, Infinity]) {
      expect(buildAnnualPath(30, rate, 'historical')).toEqual(buildAnnualPath(30));
    }
  });
});

describe('withdrawal timing and inflation', () => {
  test('zero growth and zero inflation preserve principal only with no spending', () => {
    const result = solveInitialSpending(inputs([0, 0]), 'nominal');
    expect(result.reachable).toBe(true);
    expect(result.initialSpending).toBe(0);
    if (result.reachable) expect(result.simulation.finalBalance).toBe(100);
  });
  test('withdraws before return, then increases spending by inflation', () => {
    const result = simulateWealth(inputs([0.1, 0.1], 0.05), 10);
    expect(result.rows[0].investmentGain).toBeCloseTo(9, 10);
    expect(result.rows[0].closingBalance).toBeCloseTo(99, 10);
    expect(result.rows[1].plannedSpending).toBeCloseTo(10.5, 10);
    expect(result.finalBalance).toBeCloseTo(97.35, 10);
    expect(result.finalRealBalance).toBeCloseTo(97.35 / 1.05 ** 2, 10);
    expect(result.totalWithdrawn).toBeCloseTo(20.5, 10);
  });
  test('fixed 10% returns support exactly 100/11 spending at the start of each year', () => {
    const result = solveInitialSpending(inputs([0.1, 0.1]), 'nominal');
    expect(result.reachable).toBe(true);
    if (!result.reachable) throw new Error('Expected reachable');
    expect(result.initialSpending).toBeCloseTo(100 / 11, 10);
    expect(result.simulation.rows.every((row) => Math.abs(row.closingBalance - 100) < 1e-10)).toBe(true);
  });
  test('two targets use the same starting principal but different terminal amounts', () => {
    const scenario = inputs([0.2, 0.2], 0.05);
    expect(terminalTarget(scenario, 'nominal')).toBe(100);
    expect(terminalTarget(scenario, 'real')).toBeCloseTo(110.25, 10);
    const nominal = solveInitialSpending(scenario, 'nominal');
    const real = solveInitialSpending(scenario, 'real');
    expect(nominal.reachable && real.reachable).toBe(true);
    if (!nominal.reachable || !real.reachable) throw new Error('Expected reachable');
    expect(real.initialSpending).toBeLessThan(nominal.initialSpending);
    expect(real.simulation.finalRealBalance).toBeCloseTo(100, 10);
  });
  test('sequence matters even with identical compound stock growth', () => {
    const badFirst = solveInitialSpending(inputs([-0.5, 1.5]), 'nominal');
    const goodFirst = solveInitialSpending(inputs([1.5, -0.5]), 'nominal');
    if (!badFirst.reachable || !goodFirst.reachable) throw new Error('Expected reachable');
    expect(badFirst.initialSpending).toBeCloseTo(100 / 15, 10);
    expect(goodFirst.initialSpending).toBeCloseTo(100 / 7, 10);
  });
});

describe('unreachable targets and funded spending', () => {
  test('a loss cannot preserve nominal capital even with zero withdrawals', () => {
    const result = solveInitialSpending(inputs([-0.5]), 'nominal');
    expect(result).toEqual({ reachable: false, initialSpending: null, target: 100, maxFinalBalance: 50 });
  });
  test('inflation can make the real target impossible while nominal remains possible', () => {
    const scenario = inputs([0, 0], 0.05);
    expect(solveInitialSpending(scenario, 'nominal').reachable).toBe(true);
    expect(solveInitialSpending(scenario, 'real').reachable).toBe(false);
  });
  test('clamps spending to available assets and never earns returns on debt', () => {
    const result = simulateWealth(inputs([0.1, 0.2, -0.5], 0.1), 150);
    expect(result.depletionYear).toBe(2000);
    expect(result.rows[0].withdrawn).toBe(100);
    expect(result.rows[0].shortfall).toBe(50);
    expect(result.rows.every((row) => row.closingBalance === 0 && row.investmentGain === 0)).toBe(true);
    for (const row of result.rows) expect(row.investmentGain).toBe(0);
    expect(result.rows[1].withdrawn).toBe(0);
    expect(result.totalWithdrawn).toBe(100);
    expect(result.totalShortfall).toBeCloseTo(396.5, 10);
  });
  test('reports exact exhaustion without requiring a shortfall', () => {
    const result = simulateWealth(inputs([0.2]), 100);
    expect(result.depletionYear).toBe(2000);
    expect(result.totalShortfall).toBe(0);
  });
  test('handles a total market loss as an unreachable target', () => {
    const result = solveInitialSpending(inputs([-1, 0.5]), 'nominal');
    expect(result.reachable).toBe(false);
    expect(simulateWealth(inputs([-1, 0.5]), 0).finalBalance).toBe(0);
  });
});

describe('scenario controls and solver verification', () => {
  test('custom return changes only the projected rows when manual spending stays fixed', () => {
    const base = { principal: 1_000_000, inflation: 0.03 };
    const historical = calculateScenario({ ...base, path: buildAnnualPath(50) }, 'manual', 'nominal', 50_000);
    const custom = calculateScenario({ ...base, path: buildAnnualPath(50, 0.07) }, 'manual', 'nominal', 50_000);
    expect(custom.simulation.rows.slice(0, 30)).toEqual(historical.simulation.rows.slice(0, 30));
    const year31 = custom.simulation.rows[30];
    expect(year31.rate).toBe(0.07);
    expect(year31.closingBalance).toBeCloseTo((year31.openingBalance - year31.withdrawn) * 1.07, 8);
    expect(custom.simulation.finalBalance).toBeLessThan(historical.simulation.finalBalance);
    const noSpending = simulateWealth({ ...base, path: buildAnnualPath(50, 0.07) }, 0);
    expect(noSpending.finalBalance).toBeCloseTo(1_000_000 * HISTORICAL_GROWTH * 1.07 ** 20, 4);
  });
  test('both budget targets solve accurately with positive, zero, and negative forecast returns', () => {
    for (const horizon of [30, 50, 100]) {
      for (const rate of [-0.05, 0, 0.05, 0.07, 0.1]) {
        const scenario = { principal: 1_000_000, inflation: 0.03, path: buildAnnualPath(horizon, rate) };
        for (const kind of ['nominal', 'real'] as const) {
          const solution = solveInitialSpending(scenario, kind);
          if (solution.reachable) {
            expect(Math.abs(solution.residual)).toBeLessThan(0.01);
            expect(solution.simulation.totalShortfall).toBe(0);
          }
        }
      }
    }
  });
  test('reports precision limits for extreme projections instead of an inaccurate solved budget', () => {
    expect(() => solveInitialSpending({ principal: 1_000_000, inflation: 0.03, path: buildAnnualPath(100, 1) }, 'nominal')).toThrow('too large to solve accurately');
  });
  test('historical reference example reproduces reference amounts', () => {
    const scenario = { principal: 1_000_000, inflation: HISTORICAL_INFLATION, path: buildAnnualPath(30) };
    const result = calculateScenario(scenario, 'automatic', 'nominal', NaN);
    expect(result.initialSpending).toBeCloseTo(68_346.1397108568, 6);
    expect(result.simulation.finalBalance).toBeCloseTo(1_000_000, 2);
    expect(result.simulation.finalRealBalance).toBeCloseTo(473_438.956197575, 6);
  });
  test('switching modes and targets applies the correct amount without rounding', () => {
    const scenario = { principal: 1_000_000, inflation: 0.03, path: buildAnnualPath(50) };
    const automatic = calculateScenario(scenario, 'automatic', 'real', 50_000);
    expect(automatic.initialSpending).toBe(solveInitialSpending(scenario, 'real').initialSpending!);
    expect(automatic.simulation.finalRealBalance).toBeCloseTo(1_000_000, 2);
    const manualNominal = calculateScenario(scenario, 'manual', 'nominal', 50_000);
    const manualReal = calculateScenario(scenario, 'manual', 'real', 50_000);
    expect(manualNominal.initialSpending).toBe(50_000);
    expect(manualNominal).toEqual(manualReal);
    expect(manualReal.showingBaseline).toBe(false);
    expect(calculateScenario(scenario, 'automatic', 'real', 90_000)).toEqual(automatic);
  });
  test('changing a manual budget updates withdrawals, gains, real value, and cumulative spending', () => {
    const scenario = inputs([0.1, 0.1], 0.05);
    const lower = calculateScenario(scenario, 'manual', 'nominal', 10);
    const higher = calculateScenario(scenario, 'manual', 'nominal', 15);
    expect(lower.initialSpending).toBe(10);
    expect(lower.simulation.finalBalance).toBeCloseTo(97.35, 10);
    expect(higher.initialSpending).toBe(15);
    expect(higher.simulation.rows[0].withdrawn).toBe(15);
    expect(higher.simulation.rows[0].investmentGain).toBeCloseTo(8.5, 10);
    expect(higher.simulation.rows[1].plannedSpending).toBeCloseTo(15.75, 10);
    expect(higher.simulation.finalBalance).toBeCloseTo(85.525, 10);
    expect(higher.simulation.finalRealBalance).toBeCloseTo(85.525 / 1.05 ** 2, 10);
    expect(higher.simulation.totalWithdrawn).toBeCloseTo(30.75, 10);
  });
  test('30-year fixed-return budgets change immediately with the selected rate', () => {
    const base = { principal: 1_000_000, inflation: 0 };
    const lower = calculateScenario({ ...base, path: buildAnnualPath(30, 0.05, 'fixed') }, 'automatic', 'nominal', 0);
    const higher = calculateScenario({ ...base, path: buildAnnualPath(30, 0.07, 'fixed') }, 'automatic', 'nominal', 0);
    expect(lower.initialSpending).toBeCloseTo(1_000_000 * 0.05 / 1.05, 6);
    expect(higher.initialSpending).toBeCloseTo(1_000_000 * 0.07 / 1.07, 6);
    expect(higher.initialSpending).toBeGreaterThan(lower.initialSpending);
    expect(lower.simulation.finalBalance).toBeCloseTo(1_000_000, 2);
    expect(higher.simulation.finalBalance).toBeCloseTo(1_000_000, 2);
  });
  test('fixed-return manual plans match the growing-annuity formula and purchasing-power target', () => {
    const principal = 1_000_000, inflation = 0.03, spending = 40_000, years = 30;
    const results = [0.05, 0.07].map((rate) => {
      const scenario = { principal, inflation, path: buildAnnualPath(years, rate, 'fixed') };
      const manual = calculateScenario(scenario, 'manual', 'nominal', spending);
      const expected = principal * (1 + rate) ** years
        - spending * (1 + rate) * ((1 + rate) ** years - (1 + inflation) ** years) / (rate - inflation);
      expect(manual.simulation.finalBalance).toBeCloseTo(expected, 5);
      expect(manual.simulation.finalRealBalance).toBeCloseTo(expected / (1 + inflation) ** years, 5);
      expect(manual.simulation.totalWithdrawn).toBeCloseTo(spending * ((1 + inflation) ** years - 1) / inflation, 5);
      const real = calculateScenario(scenario, 'automatic', 'real', spending);
      expect(real.simulation.finalRealBalance).toBeCloseTo(principal, 2);
      return manual.simulation.finalBalance;
    });
    expect(results[1]).toBeGreaterThan(results[0]);
    const zeroReturn = calculateScenario({ principal, inflation: 0, path: buildAnnualPath(years, 0, 'fixed') }, 'manual', 'nominal', 10_000);
    expect(zeroReturn.simulation.finalBalance).toBe(700_000);
  });
  test('manual budgets remain usable when preservation solving exceeds its precision limit', () => {
    const scenario = { principal: 1_000_000, inflation: 0.03, path: buildAnnualPath(100, 1) };
    expect(() => calculateScenario(scenario, 'automatic', 'nominal', 50_000)).toThrow('too large to solve accurately');
    const manual = calculateScenario(scenario, 'manual', 'nominal', 50_000);
    expect(manual.simulation.rows[0].plannedSpending).toBe(50_000);
    expect(Number.isFinite(manual.simulation.finalBalance)).toBe(true);
    expect(manual.simulation.finalBalance).toBeGreaterThan(0);
    expect(manual.showingBaseline).toBe(false);
    expect(() => calculateScenario(scenario, 'manual', 'nominal', NaN)).toThrow('first-year spending');
  });
  test('manual results follow zero and overfunded budgets even with an unreachable target', () => {
    const scenario = inputs([-0.5, 0], 0.05);
    const zero = calculateScenario(scenario, 'manual', 'real', 0);
    expect(zero.simulation.finalBalance).toBe(50);
    expect(zero.simulation.totalWithdrawn).toBe(0);
    expect(zero.showingBaseline).toBe(false);
    const depleted = calculateScenario(scenario, 'manual', 'real', 150);
    expect(depleted.simulation.finalBalance).toBe(0);
    expect(depleted.simulation.totalWithdrawn).toBe(100);
    expect(depleted.simulation.totalShortfall).toBe(207.5);
    expect(depleted.simulation.depletionYear).toBe(2000);
  });
  test('an unreachable automatic target explicitly shows the zero-spending baseline', () => {
    const result = calculateScenario(inputs([0, 0], 0.05), 'automatic', 'real', 10);
    expect(result.showingBaseline).toBe(true);
    expect(result.initialSpending).toBe(0);
    expect(result.simulation.finalBalance).toBe(100);
  });
  test.each(['historical', 'fixed'] as const)('all supported horizons and inflation presets land within a cent of each feasible target on the %s path', (model) => {
    for (let horizon = 30; horizon <= 100; horizon++) {
      for (const inflation of [0, HISTORICAL_INFLATION, 0.03, 0.04, 0.05, 0.2]) {
        const scenario = { principal: 1_000_000, inflation, path: buildAnnualPath(horizon, HISTORICAL_CAGR, model) };
        for (const kind of ['nominal', 'real'] as const) {
          const result = solveInitialSpending(scenario, kind);
          if (result.reachable) {
            expect(Math.abs(result.residual)).toBeLessThan(0.01);
            expect(result.simulation.totalShortfall).toBe(0);
            expect(result.simulation.depletionYear).toBeNull();
          }
        }
      }
    }
  });
  test.each([0, -1, NaN, Infinity])('rejects invalid principal %s', (principal) => {
    expect(() => simulateWealth(inputs([0.1], 0, principal), 0)).toThrow();
  });
  test.each([-0.01, 0.201, NaN, Infinity])('rejects invalid inflation %s', (inflation) => {
    expect(() => simulateWealth(inputs([0.1], inflation), 0)).toThrow();
  });
  test.each([-1, NaN, Infinity])('rejects invalid manual spending %s', (spending) => {
    expect(() => simulateWealth(inputs([0.1]), spending)).toThrow();
  });
  test('rejects invalid return data and numerical overflow', () => {
    expect(() => simulateWealth(inputs([]), 0)).toThrow();
    expect(() => simulateWealth(inputs([NaN]), 0)).toThrow();
    expect(() => simulateWealth(inputs([-1.01]), 0)).toThrow();
    expect(() => simulateWealth(inputs([1], 0, Number.MAX_VALUE), 0)).toThrow();
  });
});
