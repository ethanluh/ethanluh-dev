export type HStarEntry = {
  id: string;
  label: string;
  hstar: number[];
  dim: number;
};

// Kept as a single, explicitly-labeled classical Ehrhart theory example in
// the colophon — the h*-vector motif system it used to power (dividers,
// hover states, loaders) is deprecated in favor of the zero forcing hero.
export const HSTAR_VECTORS: HStarEntry[] = [{ id: "cube4", label: "4-cube", hstar: [1, 11, 11, 1], dim: 4 }];

export function getHStarEntry(id: string): HStarEntry {
  const entry = HSTAR_VECTORS.find((v) => v.id === id);
  if (!entry) throw new Error(`Unknown h*-vector id: ${id}`);
  return entry;
}
