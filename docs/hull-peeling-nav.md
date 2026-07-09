# Convex hull peeling navigation — shelved experiment

## Concept

Portfolio items placed as points in a hand-scored space; repeatedly computing
and removing the outer convex hull ("onion peeling") produces nested layers.
The outermost layer would be the entry view, with peeling inward as the
primary navigation gesture — framed as "overview → depth," not "important →
unimportant."

## What got built

- **2D algorithm** (`src/lib/hull-peel.ts`, since removed): gift-wrapping
  convex hull + onion peeling, ~60 lines, fully unit-tested. Correct and
  reused throughout.
- **Data model**: flat array of ~13 items (`id, title, category, x_recency,
  y_depth, z_leadership, blurb, link`), hand-scored once. Axes evolved
  through the project:
  1. Recency (x) vs. a single "scope" axis (depth + ownership + external
     validation combined).
  2. Scope split into **depth** (technical/algorithmic complexity alone) and
     **leadership** (solo IC → org-wide leadership), once a third dimension
     was wanted.
- **Rank-based positioning**: raw axis values clustered badly (e.g. five
  items all dated "summer 2026"), so display coordinates used rank order
  instead of magnitude. Important lesson: **the convex hull must be computed
  on the same coordinates used for display.** An earlier version computed
  the hull on raw values and only rank-transformed at render time — since
  rank transform isn't affine, it silently broke convexity (polygons drawn
  were no longer true hulls of what was on screen). Fixed by moving rank
  computation into the data layer, before peeling.
- **Interaction**: all points always visible (not hidden per layer) — active
  layer's polygon bold, past layers a faint dashed ghost trace, future
  layers a faint preview. A depth ring + counter (not a progress bar) showed
  position. A persistent nearest-neighbor lattice connected every point
  regardless of peel state, so the whole set read as one structure.
- **3D algorithm** (`src/lib/hull-peel-3d.ts`, since removed): hand-rolled,
  no geometry library — handled collinear/coplanar/general-position cases
  explicitly via brute-force face enumeration (O(n⁴), fine for n≤13), with a
  2D-hull fallback for degenerate (flat) point sets. Fully unit-tested (10
  passing tests covering cube, tetrahedron, coplanar/collinear degeneracy).

## Why it was shelved

Tested the 3D algorithm against the real 13-item dataset before building any
3D rendering: **primary items (5) and activity items (8), peeled
separately, each produced exactly 1 layer** — every point landed on the
hull, nothing interior, nothing to peel through. Combining all 13 into one
3D hull did only marginally better (2 layers, 11 outer / 2 inner) and broke
the "strongest work first" narrative, since an unrelated coursework item and
a real internship ended up bucketed together in the leftover inner layer.

This isn't a bug — it's a real property of 3D convex hulls: having *any*
interior point at all requires meaningfully more points than the 2D case.
13 hand-scored items isn't enough for genuine 3D onion-peeling to produce a
meaningful sequence of layers, which was the whole point of the interaction.

## If revisited

- Grow the dataset substantially before trying true 3D hulls again, or
- Switch to distance-from-centroid (or composite-score) **radial shells**
  instead of true convex hulls — not geometrically "real" in the same way,
  but guarantees a clean multi-layer peel regardless of point count.
- 3D rendering itself (Three.js, arrow-key camera orbit, auto-cycle timer)
  was never built — no reusable code there.
- The 2D peeling algorithm, rank-positioning approach, and "always show all
  points, peel changes emphasis not visibility" interaction model were all
  functionally correct and could be reused directly if this is revisited.

## What replaced it

The card-based layout in `src/pages/index.astro`
(research → projects → experience → coursework → about), populated from
`src/content/*.ts`. Same underlying content, conventional presentation.
