export const MODE_IDS = ["classic", "timed", "zen", "daily", "fog"] as const;
export type ModeId = (typeof MODE_IDS)[number];

export type AmbientKind = "fireflies" | "petals" | "stars" | "dust" | "mist";

export interface ThemeDef {
  id: string;
  ambient: AmbientKind;
  swatch: [string, string, string];
}

export const THEMES: ThemeDef[] = [
  { id: "jade", ambient: "fireflies", swatch: ["#1d5a45", "#f5efdc", "#e6c46b"] },
  { id: "ivory", ambient: "dust", swatch: ["#d9c79c", "#fdfaf0", "#a5312a"] },
  { id: "midnight", ambient: "stars", swatch: ["#241a5a", "#1c2042", "#7df9ff"] },
  { id: "sakura", ambient: "petals", swatch: ["#e8b0c6", "#fff9f6", "#c2185b"] },
  { id: "ink", ambient: "mist", swatch: ["#c8c4b9", "#f4f1ea", "#c4321f"] },
];

export function themeById(id: string): ThemeDef {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) throw new Error(`Unknown mahjong theme: ${id}`);
  return theme;
}
