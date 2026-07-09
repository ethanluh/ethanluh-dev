export type HStarEntry = {
  id: string;
  label: string;
  hstar: number[];
  dim: number;
};

export const HSTAR_VECTORS: HStarEntry[] = [
  { id: "square", label: "2-cube", hstar: [1, 1], dim: 2 },
  { id: "cube3", label: "3-cube", hstar: [1, 4, 1], dim: 3 },
  { id: "cube4", label: "4-cube", hstar: [1, 11, 11, 1], dim: 4 },
  { id: "diamond", label: "cross-polytope (2D)", hstar: [1, 2, 1], dim: 2 },
  { id: "octa", label: "cross-polytope (3D)", hstar: [1, 3, 3, 1], dim: 3 },
];

export function getHStarEntry(id: string): HStarEntry {
  const entry = HSTAR_VECTORS.find((v) => v.id === id);
  if (!entry) throw new Error(`Unknown h*-vector id: ${id}`);
  return entry;
}
