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

Research and project entries live in `src/content/research.ts` and `src/content/projects.ts` — add or edit entries there rather than touching page markup. `public/resume.pdf` needs to be added (not yet present in this repo).
