# AGENTS.md

This file provides guidance to Codex when working in this repository.

## Project Overview

This is Siyuan Song's personal website, built with Vite, React 19, TypeScript,
Tailwind CSS v4, React Router, Motion, and KaTeX. It contains the home/about
page, reading notes, blog posts, generated hero artwork, and a Lean-backed math
blog article.

The production site is deployed with GitHub Pages at:

```text
https://ssydyc2.github.io/siyuan_website/
```

## Commands

```bash
bun install                 # Install dependencies
bun run dev                 # Start Vite dev server at http://localhost:5173
bun run build               # Type-check, build production assets, then copy 404.html
bun run lint                # Run ESLint
bun run verify:lean-regions # Verify markdown proof-lean blocks match Lean regions
bun run preview             # Preview the production build locally
```

Use Bun for project commands. The project pins `bun@1.3.14` in `package.json`,
and the GitHub Pages workflow installs the same Bun version.

## Deployment And Routing

This is a project GitHub Pages site, so the repository path is part of every
production URL. Keep these values in sync:

- `vite.config.ts`: `base: '/siyuan_website/'`
- `src/App.tsx`: `<BrowserRouter basename="/siyuan_website">`

`bun run build` runs `tsc -b && vite build`. The `postbuild` script copies
`dist/index.html` to `dist/404.html` so direct navigation to React Router routes
works on GitHub Pages.

`.github/workflows/deploy.yml` deploys `dist/` to GitHub Pages on pushes to
`main` and can also be triggered manually from GitHub Actions.

## Architecture

The app is a static React single-page application. `src/main.tsx` mounts the app,
and `src/App.tsx` wires the theme provider, page title updates, router basename,
and routes.

Routes:

- `/` - About/home page with the professional timeline.
- `/reading-list` and `/books` - Reading list page.
- `/blog` - Blog index.
- `/blog/:postId` - Blog post detail page.
- `/journey` - Legacy redirect to `/blog`.

The home and reading routes render inside `src/components/Layout.tsx`, which owns
the shared header, avatar, navigation, and page outlet. The blog index/detail
route renders through `src/pages/Blog.tsx` and owns its own blog layout.

## Important Files

```text
src/
├── App.tsx                         # Router, basename, title updates, route map
├── main.tsx                        # React entry point
├── index.css                       # Tailwind import, theme tokens, global styles, hero CSS
├── assets/
│   ├── avatars/                    # Header avatar assets
│   ├── blog/                       # Blog card/detail images
│   └── hero/                       # RPG-style hero scene assets and responsive variants
├── components/
│   ├── Layout.tsx                  # Main site shell for home/reading pages
│   ├── MarkdownDocument.tsx        # Markdown renderer with KaTeX and proof/Lean blocks
│   ├── RpgHeroScene.tsx            # Shared animated hero scene component
│   └── ThemeToggle.tsx             # Light/dark theme provider and toggle
├── content/
│   └── blog/                       # Markdown blog source files
└── pages/
    ├── Background.tsx              # About/home page
    ├── Books.tsx                   # Reading list page
    └── Blog.tsx                    # Blog index and detail pages

formal/
└── abel-ruffini/                   # Lean 4 sources for the Abel-Ruffini article

scripts/
└── verify-lean-regions.mjs         # Checks proof-lean markdown blocks against Lean regions
```

## Blog And Lean Notes

Blog posts are currently registered in `src/pages/Blog.tsx`, with markdown source
imported from `src/content/blog/*.md?raw` and image assets imported from
`src/assets/blog/`.

`src/components/MarkdownDocument.tsx` is a custom lightweight markdown renderer.
It supports headings, paragraphs, lists, tables, fenced code blocks, inline code,
links, emphasis, KaTeX math, and paired `proof-lean` blocks.

For the Abel-Ruffini article, the rendered Lean snippets come from:

- `formal/abel-ruffini/AbelRuffini.lean`
- `formal/abel-ruffini/MathlibAppendix.lean`

When editing `src/content/blog/abel-ruffini-backwards.md` or the matching Lean
files, run:

```bash
bun run verify:lean-regions
```

This verifies that every markdown `proof-lean` directive has a matching Lean
`-- region ...` block, and that Lean regions are closed and used.

## Styling And UI

Tailwind CSS v4 is configured through PostCSS. Most styling lives in component
`className` strings, with shared theme tokens, global styles, and the RPG hero
scene CSS in `src/index.css`.

The visual language is pixel/RPG inspired, with responsive hero artwork and
light/dark theme support. When adding UI, match the existing component patterns,
theme variables, border treatment, typography, and reduced-motion behavior.

## Pull Request Workflow

Treat `main` as read-only. Never commit or push changes directly to `main`, even
when repository permissions allow branch-protection rules to be bypassed. Every
change must be made on a separate branch and merged through a pull request.

Before editing, committing, or pushing, check the current branch with:

```bash
git status --short --branch
```

If the current branch is `main`, create and switch to a `codex/...` feature
branch first. When asked to commit, push, or send changes, push the feature
branch and open or update a pull request targeting `main`.

Before submitting or printing PR text, re-read the final diff or commit summary
and make sure the title, Context, and Changes describe the latest branch
contents. If more changes are added after PR text has already been drafted,
regenerate the PR title and body.

Prefer `gh pr create` for new PRs after the branch has been committed and pushed.
If a PR already exists for the current branch, update that PR instead of opening
a duplicate.

Use this PR title classification system:

- `[Features]` - Newly added product behavior, pages, APIs, capabilities, or user-facing improvements.
- `[Bug Fixing]` - Fixes to broken behavior, regressions, reliability issues, or incorrect output.
- `[Documentation]` - Documentation-only updates.
- `[Refactoring]` - Internal code restructuring without intended behavior changes.

Use this PR body shape:

```markdown
## Context

- High-level summary of why this PR exists and what changed overall.

## Changes

- `path/to/file`: Detailed change made in that file.
```

If `gh pr create` or `gh pr edit` is blocked by CLI availability,
authentication, or network issues, print a ready-to-copy PR title and body for
manual GitHub submission.
