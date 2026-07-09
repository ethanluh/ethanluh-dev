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
