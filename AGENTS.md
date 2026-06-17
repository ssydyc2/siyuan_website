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

The app uses **React Router** with `BrowserRouter` and a GitHub Pages basename of
`/personal_website/`. Routes are nested under `Layout`, which renders the shared
site header, navigation, and page outlet.

- **Background** (`/`) - Home page with an animated pixel journey scene,
  professional summary, and experience timeline
- **Reading List** (`/reading-list`, `/books`) - Book list page with an animated
  pixel bookshelf scene
- **Study Plans** (`/study-plans`) - Index page for learning plans, with plan
  cards and an animated pixel study scene
- **Study Plan Detail** (`/study-plans/:planId`) - Detail pages for structured
  study plans and markdown-backed notes
- **Journey redirect** (`/journey`) - Legacy route that redirects to
  `/study-plans`

### Directory Structure

```
src/
├── App.tsx              # Router setup with BrowserRouter (base: /personal_website/)
├── main.tsx             # Entry point
├── index.css            # Tailwind import, theme tokens, global styles, pixel-scene CSS
├── assets/
│   ├── avatars/         # Header avatar image assets
│   └── study-plans/     # Study plan card/detail images
├── components/
│   ├── Layout.tsx       # Main layout wrapper
│   └── MarkdownDocument.tsx # Lightweight markdown renderer with KaTeX support
├── content/
│   └── study-plans/     # Markdown content for study plan notes
└── pages/
    ├── Background.tsx   # Home page
    ├── Books.tsx        # Reading list page
    └── StudyPlans.tsx   # Study plan index and detail pages
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

Before printing PR text, re-read the final diff or commit summary and make sure
the title, Context, and Changes describe the latest branch contents. If more
changes are added after PR text has already been drafted, regenerate the PR
title and body instead of reusing the earlier version.

Use this classification prefix system for PR titles:

- **[Feature]** - Adding or updating functionality
- **[Bug Fix]** - Fixing broken or incorrect behavior
- **[Refactoring]** - Code restructuring without changing functionality
- **[Documentation]** - Updates to docs, comments, or README

Print PR text in this exact shape, with the body always provided as a fenced
Markdown block so it can be copied directly into GitHub:

````markdown
Title: [Feature] Short imperative title

Body:
```markdown
### Context
- Concise explanation of why this PR exists.

### Changes
- Concrete change made.
- Another concrete change made.
```
````

If a branch has already been pushed, include the PR URL separately after the
copyable title/body. Do not let a missing PR URL block providing the copyable
text.
