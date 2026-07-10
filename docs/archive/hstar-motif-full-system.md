# h*-vector motif — full system (archived)

Status: **superseded**. The original plan below (dividers, hover states, a
route-transition loader, all sourced from Ehrhart h\*-vectors) was replaced
by the zero forcing hero (`docs/zero-forcing-hero.md`) before most of it was
built. Keeping this doc for the h\*-vector math and application-map thinking,
in case a future motif system wants it — not because any of it is currently
live beyond one exception noted below.

## What survived

Exactly one static, labeled instance: the 4-cube's h\* = `(1, 11, 11, 1)` on
the `/how-it-works` page (`HStarMotif.astro`, `vectorId="cube4"`, bar mode),
captioned as a classical Ehrhart-theory example — explicitly kept separate
from the zero forcing hero, which renders real content data rather than a
textbook illustration. `src/data/hstar.ts` and `src/components/HStarMotif.astro`
still exist and are used for exactly this one instance.

## What did not get built

- Section-divider treatment (smooth silhouette, low opacity, full content
  width) — never shipped; the site doesn't use h\*-vector dividers.
- Nav item / project card hover pulse using the cross-polytope vector —
  never shipped.
- Route-transition loader using the 4-cube vector in bar mode — never
  shipped; would have been the only piece requiring client-side JS.
- The placeholder slot reserved for a real zero forcing polytope h\*-vector
  (once the Hanely independent study result is finalized) — not yet
  applicable, since that research is still in progress.

## Original design (for reference)

### Data source

h\*-vectors computed directly via brute-force lattice point counts and the
standard finite-difference transform:

```
L(P, t) = number of lattice points in t·P
h*_i = Σ_{j=0}^{i} (-1)^(i-j) · C(d+1, i-j) · L(P, j),   i = 0..d
```

| Polytope              | dim | h*-vector      |
|------------------------|-----|----------------|
| 2-cube (square)         | 2   | (1, 1)         |
| 3-cube                  | 3   | (1, 4, 1)      |
| 4-cube                  | 4   | (1, 11, 11, 1) |
| Cross-polytope (2D)     | 2   | (1, 2, 1)      |
| Cross-polytope (3D)     | 3   | (1, 3, 3, 1)   |

3-cube and 4-cube are Eulerian numbers; cross-polytope 3D is a row of
Pascal's triangle — classical, citable facts, not fabricated for symmetry.

### Component API (as designed, `HStarMotif`)

```ts
type HStarMotifProps = {
  vectorId: string;        // key into HSTAR_VECTORS
  mode: "bar" | "smooth";  // blocky bars vs. bezier silhouette
  width?: number;          // default 240
  height?: number;         // default 32
  strokeOnly?: boolean;    // outline vs filled
  opacity?: number;        // default 1
};
```

Rendering: normalize each vector to `[0, 1]` against its own max (not a
global max), distribute points evenly across `width`; `mode: "bar"` emits
flat-bottom-aligned `<rect>`s, `mode: "smooth"` emits a single
Catmull-Rom-to-Bezier `<path>` through the normalized points.

### Intended application map (never fully realized)

| Placement                        | Vector       | Mode   | Notes |
|-----------------------------------|--------------|--------|-------|
| Section dividers (`<hr>` replacement) | `cube3` or `octa` | smooth | Thin, low-opacity (~0.15–0.25), full content width |
| Nav item / project card hover     | `diamond`    | smooth | Smallest vector — cheap 150–200ms pulse animation |
| Page/route transition loader      | `cube4`      | bar    | Widest vector, most visual material for a wipe/fill animation |
| Colophon / "about this site" note | any, labeled | bar    | **This is the one that shipped.** |
