# Siyuan's Personal Website

A personal website built with Vite, React, TypeScript, and Tailwind CSS. It shares my background, reading list, blog posts, and Wealth Lab.

Wealth Lab (`/wealth-lab`) explores inflation-adjusted spending with 1996–2025
S&P 500 total returns. It can extend the historical path using its compound
annual return, solve a first-year budget for two capital-preservation targets,
or simulate custom spending. The page includes its offline data sources and
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
