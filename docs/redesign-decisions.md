# Redesign decisions — "Field Guide, Sharpened"

Status: **partially live**. Records a design-lead convergence exercise (five
competing pitches → one decision log) and what was actually implemented from
it, so the deferred/rejected items don't get re-litigated from scratch later.

## The five pitches

Five hypothetical design teams each pitched a full-site redesign direction:

- **Herbarium** — commit fully to the existing field-guide/specimen concept: full specimen-plate treatment on every card, enlarged math diagrams, a new rust/ochre "field-stamp" accent.
- **Signal** — recruiter-first: fact-chips and a proof stat above the fold, demote the hero graph behind a disclosure, plain-language reasons instead of raw hull-peel layer numbers.
- **Proof & Margin** — academic rigor: manuscript-style Definition/Remark/footnote structure for the math-heavy sections, serif body copy site-wide.
- **Terrain** — turn the site's real Delaunay/zero-forcing graph into an actual pannable navigation mode ("map mode"), with a linear list as an accessible fallback.
- **Plainspoken** — radical minimalism: static-first rendering, a hard performance/motion budget, cut anything decorative that doesn't carry information.

## Decision log

| # | Decision | Status | Notes |
|---|---|---|---|
| 1 | Hero fact-chips + proof stat, graph kept at current size/position | **Adopted** | Implemented — see `src/pages/index.astro` hero section, copy under `home.hero.chip*` / `home.hero.proofStat` in `copy.ts`. |
| 2 | Keep hull-peel ordering, add plain-language reason per item | **Adopted** | Implemented — `rankReasonFor()` in `index.astro`, phrases in `copy.ts` under `home.work.rankReason`. |
| 3 | Specimen-card treatment stays restrained (full plate only on the featured card) | **Adopted (no change)** | Already the current implementation; Herbarium's full-plate-everywhere pitch was scoped down to just the featured card. |
| 4 | New "field-stamp" rust/ochre accent color | **Rejected** | Out of scope — `CLAUDE.md` treats the design-token set as closed by convention and reserves lavender as the only non-default accent. Would need its own explicit token-system review. |
| 5 | Definition/Remark structure for math-heavy content | **Adopted, scoped down** | Implemented, but only on `how-it-works.astro` (zero forcing + Delaunay sections) via `src/components/DefinitionBlock.astro` — not site-wide. |
| 6 | Serif body typeface site-wide | **Rejected** | IBM Plex Sans stays the body face everywhere; a full swap would read as a costume change partway through an otherwise coherent identity. |
| 7 | Graph-as-navigation ("map mode") | **Deferred** | Not implemented. Real coordinate/adjacency data already exists (`src/data/content-points.ts`, `src/lib/geometry/related.ts`) if this gets picked up later — hard gate: full keyboard/list-view parity before it ships. |
| 8 | Motion & performance budget (progressive enhancement, no JS required for content) | **Already satisfied** | `ZeroForcingHero.astro` already renders as static server-side SVG with CSS-only animation and already respects `prefers-reduced-motion` — no rework was needed. |
| 9 | Persistent résumé/contact CTA | **Adopted** | Implemented — desktop nav in `src/components/Nav.astro` now has a visible `Résumé` link (reuses the existing `[data-resume-trigger]` → `ResumeModal.astro` wiring), in addition to the existing mobile-menu and `IndexRail` entries. |

## What shipped

- `copy.ts`: `nav.link.resume`, `home.hero.chipProgram` / `chipGradDate` / `proofStat`, `home.work.rankReason.*`, `howItWorks.zeroForcing.definition` / `.remark`, `howItWorks.delaunay.definition` / `.remark`.
- `src/components/Nav.astro`: visible desktop résumé CTA.
- `src/pages/index.astro`: hero fact-chips + proof stat; plain-language rank reasons on work cards via `rankReasonFor()`.
- `src/components/DefinitionBlock.astro` (new): Definition/Remark callout, used only in `src/pages/how-it-works.astro`.

## What's intentionally not here

Map-mode navigation (#7) is the one open idea worth revisiting — it's the
only pitch that would change the site's information architecture rather than
its presentation, and it's gated on shipping full list-view parity first.
