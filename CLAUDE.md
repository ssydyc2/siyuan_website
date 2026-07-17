# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Vite + React 19 + TypeScript, documenting a journey to becoming a performance engineer. The site is deployed to GitHub Pages at ssydyc2.github.io/siyuan_website.

## Commands

```bash
bun install        # Install dependencies
bun run dev        # Start dev server at http://localhost:5173
bun run build      # Type-check and build for production (outputs to dist/)
bun run lint       # Run ESLint
bun run preview    # Preview production build locally
```

## Architecture

The app uses **React Router** with a simple two-page structure:

- **Background** (`/`) - Home page with professional experience timeline
- **Journey** (`/journey`) - Tabbed page with content sections (Triton & JAX, AI Performance Engineer, Important Papers)

### Directory Structure

```
src/
├── App.tsx              # Router setup with BrowserRouter (base: /siyuan_website/)
├── main.tsx             # Entry point
├── components/
│   ├── Layout.tsx       # Main layout wrapper
│   └── journey/        # Content components for Journey page tabs
└── pages/
    ├── Background.tsx   # Home page
    └── Journey.tsx      # Tabbed content page
```

### Styling

Tailwind CSS v4 is used for styling. The config uses `@tailwindcss/postcss` and handles styling directly in component className attributes.

## Pull Request Conventions

When creating PRs, use the classification prefix system defined in `.claude/skills/create-pr.md`:

- **[Feature]** - Adding or updating functionality
- **[Bug Fix]** - Fixing broken or incorrect behavior
- **[Refactoring]** - Code restructuring without changing functionality
- **[Documentation]** - Updates to docs, comments, or README
