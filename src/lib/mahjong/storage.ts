import { MODE_IDS, THEMES, type ModeId } from "./config.ts";
import { LAYOUTS } from "./layouts.ts";

export interface Prefs {
  mode: ModeId;
  layout: string;
  theme: string;
  sound: boolean;
}

export interface ModeStats {
  played: number;
  won: number;
  bestScore: number | null;
  bestTimeMs: number | null;
  bestDate?: string;
}

export type Stats = Record<ModeId, ModeStats>;

const PREFS_KEY = "mj:prefs";
const STATS_KEY = "mj:stats";

export const DEFAULT_PREFS: Prefs = { mode: "classic", layout: "turtle", theme: "jade", sound: true };

function read<T>(key: string): T | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch (e) {
    console.error(`mahjong: cannot read ${key}; progress will not persist`, e);
    return null;
  }
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`mahjong: ${key} is corrupt; starting fresh`, e);
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`mahjong: cannot write ${key}; progress will not persist`, e);
  }
}

export function loadPrefs(): Prefs {
  const stored = read<Partial<Prefs>>(PREFS_KEY);
  const prefs = { ...DEFAULT_PREFS };
  if (!stored) return prefs;
  const checks: [keyof Prefs, (v: unknown) => boolean][] = [
    ["mode", (v) => (MODE_IDS as readonly unknown[]).includes(v)],
    ["layout", (v) => LAYOUTS.some((l) => l.id === v)],
    ["theme", (v) => THEMES.some((t) => t.id === v)],
    ["sound", (v) => typeof v === "boolean"],
  ];
  for (const [key, valid] of checks) {
    if (!(key in stored)) continue;
    if (valid(stored[key])) Object.assign(prefs, { [key]: stored[key] });
    else console.error(`mahjong: stored pref ${key}=${JSON.stringify(stored[key])} is invalid; using default`);
  }
  return prefs;
}
export const savePrefs = (p: Prefs): void => write(PREFS_KEY, p);

export function loadStats(modes: readonly ModeId[]): Stats {
  const stored = read<Partial<Stats>>(STATS_KEY) ?? {};
  const stats = {} as Stats;
  for (const m of modes) stats[m] = { played: 0, won: 0, bestScore: null, bestTimeMs: null, ...stored[m] };
  return stats;
}
export const saveStats = (s: Stats): void => write(STATS_KEY, s);
