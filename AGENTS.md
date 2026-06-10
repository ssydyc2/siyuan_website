# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Vite + React 19 + TypeScript, documenting a journey to becoming a performance engineer. The site is deployed to GitHub Pages at ssydyc2.github.io/personal_website.

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
├── App.tsx              # Router setup with BrowserRouter (base: /personal_website/)
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

When asked to create or prepare a pull request, do not try to open the PR on
GitHub by default. GitHub CLI, browser login, and API setup are often
environment-specific and error-prone.

Instead, print a ready-to-copy PR title and body so the user can create the PR
manually in GitHub. Do not run `gh pr create`, call the GitHub API, or drive a
browser to submit the PR unless the user explicitly asks for that after seeing
the copyable text.

Use this classification prefix system for PR titles:

- **[Feature]** - Adding or updating functionality
- **[Bug Fix]** - Fixing broken or incorrect behavior
- **[Refactoring]** - Code restructuring without changing functionality
- **[Documentation]** - Updates to docs, comments, or README

Print PR text in this exact shape:

```markdown
Title: [Feature] Short imperative title

Body:
### Context
- Concise explanation of why this PR exists.

### Changes
- Concrete change made.
- Another concrete change made.
```

If a branch has already been pushed, include the PR URL separately after the
copyable title/body. Do not let a missing PR URL block providing the copyable
text.
