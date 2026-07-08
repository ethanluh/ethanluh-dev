# CLAUDE.md

## Project
ethanluh.com — dev/professional site. Astro + Tailwind static site, "Field Guide" design concept (see `ethanluh-design-spec.md` handoff for the full spec).

## Stack
Astro 7, Tailwind CSS v4 (via `@tailwindcss/vite`), TypeScript. No backend, no database.

## Commands
- Dev server: `npm run dev` (use `astro dev --background` for a background server; manage with `astro dev stop` / `astro dev status` / `astro dev logs`)
- Build: `npm run build`
- Preview build: `npm run preview`

## Conventions
- Terse commit messages, imperative mood, no trailing period.
- Prefer smallest adequate file format (.md over .docx, .csv over .xlsx).
- No comments unless logic is non-obvious.
- Design tokens (colors, type, spacing) live in `src/styles/global.css` under `@theme` — don't hardcode hex values or font names in components.
- Lavender (`--color-lavender`) is a fixed 3-spot easter egg (specimen-number hover, footer separator-dot hover, one bio word on the personal site) — never use it as a default UI color.

## Directory map
- `src/pages/` — routes (currently a single-page site: `index.astro`)
- `src/layouts/` — `BaseLayout.astro` (head, fonts, Nav/Footer wrapper)
- `src/components/` — `Nav.astro`, `Footer.astro`, `SpecimenCard.astro` (shared research/project card)
- `src/content/` — typed data files (`research.ts`, `projects.ts`) — edit these to add entries, not the markup
- `src/styles/` — `global.css`, Tailwind v4 `@theme` design tokens
- `public/` — static assets, including `resume.pdf` (must be added — not yet present)

## Out of scope
Claude Code should not modify `.github/workflows/` without explicit request.
