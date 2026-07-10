# ethanluh.com

Dev/professional site for Ethan Luh — bio, research, projects, resume, contact. Astro + Tailwind CSS static site, deployed on Cloudflare Pages.

Design concept: "Field Guide" — research and projects presented as catalogued specimen entries. See the design spec for the full rationale (colors, type, the lavender easter-egg rule).

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```

Output goes to `dist/`. Cloudflare Pages builds this automatically on push (framework preset: Astro).

## Content

All site copy — headlines, paragraphs, captions, nav labels, card titles/tags/descriptions — lives in `copy.ts` at the repo root. Edit copy there, not in page markup or the `src/content/*.ts` files, which pull their display strings from it by key (see `src/lib/copy.ts`).

Research, project, experience, and coursework entries (slugs, hrefs, numbers, dates) live in `src/content/research.ts`, `src/content/projects.ts`, `src/content/experience.ts`, and `src/content/coursework.ts` — add or reorder entries there rather than touching page markup. `public/resume.pdf` needs to be added (not yet present in this repo).
