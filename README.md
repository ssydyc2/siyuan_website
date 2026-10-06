# Siyuan's Personal Website

A personal website built with Vite, React, TypeScript, and Tailwind CSS. It shares my background, reading list, blog posts, and Wealth Lab.

Wealth Lab (`/wealth-lab`) explores inflation-adjusted spending. It defaults to
a fixed annual return using the 1996–2025 S&P 500 compound average (10.26%).
A checkbox enables historical replay of those 30 years, with longer horizons
using the selected rate for additional years. It can solve a first-year budget
for two capital-preservation targets or simulate custom spending. The page includes its offline data sources and
calculation assumptions.

**Live site:** [ssydyc2.github.io/siyuan_website](https://ssydyc2.github.io/siyuan_website)

## Run Locally

```bash
bun install
bun run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
bun run test:wealth   # Calculation, dataset, and scenario tests
bun run lint
bun run build
```
