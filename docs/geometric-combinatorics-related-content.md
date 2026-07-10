# Delaunay related-content + hull-peeling featured selector

Status: **live**. Implemented substantially as designed; noted deviations below.

## Concept

Two structural (not decorative) uses of geometry, both driven by the same
hand-scored content coordinates instead of manual curation:

1. **Delaunay-triangulation related-content graph** — "related" links come
   from an actual triangulation over each piece of content's coordinates,
   not a hand-picked list.
2. **Hull peeling as the featured/ordering selector** — the homepage's
   Featured card and Work ordering come from repeatedly peeling the convex
   hull off a (recency, depth) point set, not a manual `featured` flag.

## What got built

- **Shared hull utility** (`src/lib/geometry/hull.ts`): `convexHull` (Andrew's
  monotone chain) plus `peelLayers`, which repeatedly computes and strips the
  hull so `layers[0]` is the Pareto-extreme outer boundary. One
  implementation, imported everywhere a hull is needed — nav peel and
  featured-content peel both call it.
- **Content coordinates** (`src/data/content-points.ts`): every research,
  project, experience, and coursework entry gets a hand-placed `{ topic,
  recency, depth }`, plus an optional `shipped` boolean. `topic` is the axis
  used for Delaunay (0 = pure combinatorics/math, 1 = pure ML/software);
  `recency` and `depth` (adjusted by `shipped`) drive the hull peel.
- **Delaunay related-content** (`src/lib/geometry/related.ts`, using
  `d3-delaunay`): `relatedIndices` returns each point's triangulation
  neighbors; gated behind `MIN_POINTS_FOR_DELAUNAY = 6` — below that,
  everything returns an empty neighbor list rather than a near-arbitrary
  triangulation. Rendered as a small node-and-edge diagram
  (`RelatedInfo.astro` / `DelaunayMotif.astro`) next to each content card,
  not just a text link list.
- **Hull-peel featured selector** (`src/pages/index.astro`): `peelLayers`
  over `(recency, effectiveDepth)`, where `effectiveDepth` multiplies `depth`
  by 1.3 if `shipped === true`, 0.6 if `shipped === false`, 1 otherwise. The
  Featured card is the first item of layer 0 by weight; everything else
  renders in layer order, labeled with its kind and layer index. The nav bar
  is peeled the same way, over `(depth, recency)` per section.

## Deviations from the original plan

- **Shipped-bonus dimension** wasn't in the original two-axis design — added
  later so an unfinished, deep research entry ("Zero Forcing Polytopes" — in
  progress) couldn't out-rank shipped, clickable project work for the
  Featured slot. Same `(recency, depth)` hull-peel machinery, just a
  pre-peel weighting step.
- **No `validation` axis** (citations/stars) — the original doc listed it as
  a third, optional axis once external-signal data existed. Never added;
  two axes have been sufficient so far.
- **No standalone `related-content.json` build artifact** — computed inline
  in `index.astro`/`coursework.astro` at render time from `CONTENT_POINTS`,
  not as a separate prebuild script output. Same computation, simpler
  pipeline given the content set's small size.
- **Deferred, still not built**: the hyperplane-arrangement theme counter
  (Zaslavsky's theorem) noted as phase-3/optional in the original doc.
