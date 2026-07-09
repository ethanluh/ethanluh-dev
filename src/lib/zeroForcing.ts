export type Graph = Map<string, Set<string>>;

export function buildAdjacency(vertexIds: string[], edges: [string, string][]): Graph {
  const g: Graph = new Map(vertexIds.map((id) => [id, new Set()]));
  for (const [a, b] of edges) {
    g.get(a)?.add(b);
    g.get(b)?.add(a);
  }
  return g;
}

export interface ForceRecord {
  round: number;
  via: string | null;
}

/** Colors `seeds` at round 0, then applies the zero forcing color-change rule
 * (a colored vertex with exactly one uncolored neighbor forces it) until no
 * more forces are possible. `via` records which vertex did the forcing, so
 * callers can animate a pulse along the specific edge that fired.
 */
export function simulateForcing(g: Graph, seeds: string[]): Map<string, ForceRecord> {
  const colored = new Set(seeds);
  const forcing = new Map<string, ForceRecord>();
  for (const id of seeds) forcing.set(id, { round: 0, via: null });

  let round = 1;
  let changed = true;
  while (changed) {
    changed = false;
    const applied = new Map<string, string>();
    for (const id of colored) {
      const uncolored = [...(g.get(id) ?? [])].filter((n) => !colored.has(n));
      if (uncolored.length === 1 && !applied.has(uncolored[0])) {
        applied.set(uncolored[0], id);
      }
    }
    for (const [target, via] of applied) {
      colored.add(target);
      forcing.set(target, { round, via });
      changed = true;
    }
    if (changed) round++;
  }
  return forcing;
}

function* combinations<T>(arr: T[], k: number): Generator<T[]> {
  if (k === 0) {
    yield [];
    return;
  }
  for (let i = 0; i <= arr.length - k; i++) {
    for (const rest of combinations(arr.slice(i + 1), k - 1)) {
      yield [arr[i], ...rest];
    }
  }
}

/** Minimum zero forcing set is NP-hard in general, but brute force over
 * subsets is fine done once at build time for a content graph well under 20
 * nodes. Worst case (no propagation possible) falls back to every vertex.
 */
export function findMinimumZeroForcingSet(g: Graph): string[] {
  const vertices = [...g.keys()];
  for (let size = 1; size <= vertices.length; size++) {
    for (const subset of combinations(vertices, size)) {
      if (simulateForcing(g, subset).size === vertices.length) return subset;
    }
  }
  return vertices;
}
