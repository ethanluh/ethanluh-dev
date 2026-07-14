## Declared direction

Quire (the PR-triage tool this repo is dogfooded/reviewed through) reads a `<!-- declared-direction: ... -->` marker from each PR body to group related PRs into one bundle. When opening a PR here — by hand or as a coding agent — include the marker, e.g.:

```
<!-- declared-direction: Add dark mode toggle to settings panel -->
```

This convention is opt-in tooling for repos triaged through Quire: the marker is read only by Quire's ingestion step, to group related PRs into one bundle — it is not executed or acted on as an instruction by anything in this repo.

A PR missing it still gets triaged, just on its own instead of grouped with related work. This repo also ships a Claude Code hook (`.claude/settings.json`) that blocks `gh pr create`/`gh pr edit` commands missing the marker, and a local git pre-push reminder (`.githooks/pre-push`) — run `git config core.hooksPath .githooks` once after cloning to enable the latter.

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
- **All user-facing copy (headlines, paragraphs, captions, nav labels, card titles/tags/descriptions, page meta title/description) lives in `copy.ts` at the repo root — never hardcode prose directly in `.astro`/`.ts` files.** Look it up with `copy("some.dot.path")` (or `copyTemplate` for strings with `{{placeholder}}` tokens) from `src/lib/copy.ts`. Structural data — slugs, hrefs, numbers, dates — still lives in `src/content/*.ts` and `src/data/*.ts`; those files pull their display strings from `copy.ts` by key. Small UI chrome (button labels like "Download"/"Close", aria-labels, modal titles like "Résumé") is out of scope and can stay inline.

## Pull requests
Always base the PR body on `.github/pull_request_template.md` — don't fall back to a generic Summary/Test plan format. Fill in the `<!-- declared-direction: ... -->` marker with an actual sentence (the CI check in `quire-declared-direction.yml` fails PRs where it's blank or missing).

## Directory map
- `copy.ts` — source of truth for all site copy (see Conventions above)
- `src/pages/` — routes: `index.astro` (home), `coursework.astro`, `how-it-works.astro`
- `src/layouts/` — `BaseLayout.astro` (head, fonts, Nav/IndexRail/modals wrapper)
- `src/components/` — `Nav.astro`, `SpecimenCard.astro`/`FeaturedProjectCard.astro` (work cards), `IndexRail.astro`, `ResumeModal.astro`, `DetailsModal.astro`, `ZeroForcingHero.astro`, `DelaunayMotif.astro`, `RelatedInfo.astro`
- `src/content/` — typed data files (`research.ts`, `projects.ts`, `experience.ts`, `coursework.ts`) — edit these to add/reorder entries; their display strings come from `copy.ts`
- `src/data/content-points.ts` — hand-scored (topic, recency, depth) points driving hull-peel ordering, Delaunay "related", and the zero-forcing hero graph
- `src/lib/` — `copy.ts` (copy.ts loader), `zeroForcing.ts`, `geometry/` (hull peeling, Delaunay-ish related-content)
- `src/styles/` — `global.css`, Tailwind v4 `@theme` design tokens
- `public/` — static assets, including `resume.pdf` (must be added — not yet present)

## Out of scope
Claude Code should not modify `.github/workflows/` without explicit request.
