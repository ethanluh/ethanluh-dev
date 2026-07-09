import { Delaunay } from "d3-delaunay";
import type { Point2D } from "./hull";

/** Below this many points, Delaunay neighbors are near-arbitrary — caller should gate on it. */
export const MIN_POINTS_FOR_DELAUNAY = 6;

export function relatedIndices(points: Point2D[]): number[][] {
  if (points.length < MIN_POINTS_FOR_DELAUNAY) {
    return points.map(() => []);
  }
  const delaunay = Delaunay.from(points);
  return points.map((_, i) => [...delaunay.neighbors(i)]);
}

/** Dedupes a neighbor-index list into an undirected edge list, for drawing the triangulation. */
export function edgesFromNeighbors(neighborIndices: number[][]): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  neighborIndices.forEach((neighbors, i) => {
    for (const j of neighbors) {
      const [a, b] = i < j ? [i, j] : [j, i];
      const key = `${a}-${b}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  });
  return edges;
}
