# Zero forcing hero

Status: **live**. Implemented as designed.

## Concept

The homepage hero is a live rendering of the site's actual content as a
graph, animated by the zero forcing color-change rule from the research area
above — not an illustration of the math, an instance of it. Vertex set is
the real content graph, positions are the same coordinates used for
hull-peeling nav, edges are the same Delaunay edges used for "related," and
the reveal order is a real computed minimum zero forcing set.

Superseded a broader h\*-vector motif system (dividers, hover states, a
route-transition loader — see `docs/archive/hstar-motif-full-system.md`).
One h\*-vector instance survives, kept deliberately separate: a single,
explicitly-labeled illustration (4-cube, `(1, 11, 11, 1)`) on the
`/how-it-works` page, captioned as a classical Ehrhart-theory example
distinct from the hero.

## What got built

- **Zero forcing core** (`src/lib/zeroForcing.ts`): `buildAdjacency`,
  `simulateForcing` (applies the color-change rule — a colored vertex with
  exactly one uncolored neighbor forces it — recording the round and the
  forcing edge for each vertex), and `findMinimumZeroForcingSet` (brute-force
  over subsets, fine at build time for a content graph well under 20 nodes;
  NP-hard in general but not at this scale).
- **Shared data, no second coordinate/edge set**: the hero graph
  (`src/components/ZeroForcingHero.astro`) reuses `CONTENT_POINTS`
  (`src/data/content-points.ts`) for node positions and the Delaunay edges
  from `src/lib/geometry/related.ts` for graph structure — computed once in
  `index.astro`, passed down, not duplicated.
- **Animation**: initial (minimum zero forcing set) nodes render colored
  moss-green on load; remaining nodes activate in forcing order, each tied
  visually to the specific edge that forced it. Nodes are clickable, same
  destinations as the corresponding content cards.
- **Accessibility**: `prefers-reduced-motion` renders the fully-colored end
  state immediately, no propagation animation. Every node is a real link
  (not decoration-only).
- **Colophon note**: `/how-it-works` explicitly documents the seed count,
  node count, and that the seeds are a real computed minimum zero forcing
  set, "not a hand-picked example."

## Deviations from the original plan

- **No separate `zero-forcing-order.json` build artifact** — computed inline
  at render/build time from `CONTENT_POINTS` and the Delaunay edges, same as
  the related-content system; no standalone script or committed JSON file.
- **No hardcoded fallback initial-set** for a failed/empty computation — the
  content graph is always populated at build time from `CONTENT_POINTS`, so
  this failure mode hasn't been a practical risk yet.
