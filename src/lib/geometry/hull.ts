export type Point2D = [number, number];

function cross(o: Point2D, a: Point2D, b: Point2D): number {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

/** Andrew's monotone chain. Returns indices into `points` on the hull, CCW order. */
export function convexHull(points: Point2D[]): number[] {
  const n = points.length;
  if (n < 3) return points.map((_, i) => i);

  const order = points
    .map((_, i) => i)
    .sort((a, b) => points[a][0] - points[b][0] || points[a][1] - points[b][1]);

  const lower: number[] = [];
  for (const i of order) {
    while (
      lower.length >= 2 &&
      cross(points[lower[lower.length - 2]], points[lower[lower.length - 1]], points[i]) <= 0
    ) {
      lower.pop();
    }
    lower.push(i);
  }

  const upper: number[] = [];
  for (let k = order.length - 1; k >= 0; k--) {
    const i = order[k];
    while (
      upper.length >= 2 &&
      cross(points[upper[upper.length - 2]], points[upper[upper.length - 1]], points[i]) <= 0
    ) {
      upper.pop();
    }
    upper.push(i);
  }

  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

/**
 * Repeatedly computes the convex hull and strips it, so `layers[0]` is the
 * Pareto-extreme outer boundary, `layers[1]` the next one in, etc.
 */
export function peelLayers<T>(items: T[], project: (item: T) => Point2D): T[][] {
  let remaining = items;
  const layers: T[][] = [];

  while (remaining.length > 2) {
    const coords = remaining.map(project);
    const hullIdx = new Set(convexHull(coords));
    if (hullIdx.size === 0) break;
    layers.push(remaining.filter((_, i) => hullIdx.has(i)));
    remaining = remaining.filter((_, i) => !hullIdx.has(i));
  }
  if (remaining.length > 0) layers.push(remaining);

  return layers;
}
