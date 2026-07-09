export type Point = [number, number];

export function catmullRomToBezierPath(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function normalizedPoints(values: number[], width: number, height: number): Point[] {
  const max = Math.max(...values);
  const n = values.length;
  return values.map((v, i) => {
    const x = n > 1 ? (i / (n - 1)) * width : width / 2;
    const y = height - (v / max) * height;
    return [x, y] as Point;
  });
}
