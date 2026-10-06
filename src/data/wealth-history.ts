/** Fixed, offline snapshot. Returns are the percentages published by NYU,
 * not rounded versions of another provider's S&P index series. */
export const WEALTH_HISTORY = {
  startYear: 1996,
  endYear: 2025,
  snapshotDate: '2026-10-06',
  returnsUpdated: '2026-01-05',
  returnsSource: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html',
  inflationSource: 'https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1913-',
  cpiStart: { year: 1995, value: 152.4 },
  cpiEnd: { year: 2025, value: 321.9 },
} as const;

// S&P 500 including dividends, annual total returns (decimal fractions).
export const HISTORICAL_RETURNS = [
  { year: 1996, rate: 0.2268 },
  { year: 1997, rate: 0.3310 },
  { year: 1998, rate: 0.2834 },
  { year: 1999, rate: 0.2089 },
  { year: 2000, rate: -0.0903 },
  { year: 2001, rate: -0.1185 },
  { year: 2002, rate: -0.2197 },
  { year: 2003, rate: 0.2836 },
  { year: 2004, rate: 0.1074 },
  { year: 2005, rate: 0.0483 },
  { year: 2006, rate: 0.1561 },
  { year: 2007, rate: 0.0548 },
  { year: 2008, rate: -0.3655 },
  { year: 2009, rate: 0.2594 },
  { year: 2010, rate: 0.1482 },
  { year: 2011, rate: 0.0210 },
  { year: 2012, rate: 0.1589 },
  { year: 2013, rate: 0.3215 },
  { year: 2014, rate: 0.1352 },
  { year: 2015, rate: 0.0138 },
  { year: 2016, rate: 0.1177 },
  { year: 2017, rate: 0.2161 },
  { year: 2018, rate: -0.0423 },
  { year: 2019, rate: 0.3121 },
  { year: 2020, rate: 0.1802 },
  { year: 2021, rate: 0.2847 },
  { year: 2022, rate: -0.1804 },
  { year: 2023, rate: 0.2606 },
  { year: 2024, rate: 0.2488 },
  { year: 2025, rate: 0.1778 },
] as const;

export const HISTORICAL_GROWTH = HISTORICAL_RETURNS.reduce((value, entry) => value * (1 + entry.rate), 1);
export const HISTORICAL_CAGR = HISTORICAL_GROWTH ** (1 / HISTORICAL_RETURNS.length) - 1;
// Annual-average CPI-U endpoints as published (one decimal place).
// Excludes the source's estimate for the incomplete 2026 calendar year.
export const HISTORICAL_INFLATION = (WEALTH_HISTORY.cpiEnd.value / WEALTH_HISTORY.cpiStart.value) ** (1 / 30) - 1;
