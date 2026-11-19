import type { Slot } from "./layouts.ts";
import { fullPairs, matchKey } from "./tiles.ts";

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function shuffled<T>(items: readonly T[], rng: Rng): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Geometry {
  slots: Slot[];
  above: number[][];
  left: number[][];
  right: number[][];
}

export function buildGeometry(slots: Slot[]): Geometry {
  const n = slots.length;
  if (n % 2 !== 0) throw new Error(`Layout has an odd slot count (${n})`);
  const above: number[][] = Array.from({ length: n }, () => []);
  const left: number[][] = Array.from({ length: n }, () => []);
  const right: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    const a = slots[i];
    let supported = a.z === 0;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const b = slots[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const overlaps = Math.abs(dx) < 2 && Math.abs(dy) < 2;
      if (b.z === a.z && overlaps) throw new Error(`Overlapping slots ${i} and ${j}`);
      if (b.z === a.z + 1 && overlaps) above[i].push(j);
      if (b.z === a.z - 1 && overlaps) supported = true;
      if (b.z === a.z && Math.abs(dy) < 2) {
        if (dx === -2) left[i].push(j);
        if (dx === 2) right[i].push(j);
      }
    }
    if (!supported) throw new Error(`Slot ${i} floats above nothing`);
  }
  return { slots, above, left, right };
}

export function isFree(g: Geometry, i: number, alive: readonly boolean[]): boolean {
  if (!alive[i]) return false;
  if (g.above[i].some((j) => alive[j])) return false;
  return g.left[i].every((j) => !alive[j]) || g.right[i].every((j) => !alive[j]);
}

export interface Deal {
  faces: number[];
  /** Slot pairs in a legal clearing order; replaying it solves the board. */
  order: [number, number][];
}

function tryDeal(g: Geometry, alive0: readonly boolean[], pairs: [number, number][], rng: Rng): Deal | null {
  const alive = alive0.slice();
  const faces = new Array<number>(g.slots.length).fill(-1);
  const order: [number, number][] = [];
  for (const [fa, fb] of shuffled(pairs, rng)) {
    const free: number[] = [];
    for (let i = 0; i < alive.length; i++) if (isFree(g, i, alive)) free.push(i);
    if (free.length < 2) return null;
    const a = free.splice(Math.floor(rng() * free.length), 1)[0];
    const b = free[Math.floor(rng() * free.length)];
    const flip = rng() < 0.5;
    faces[a] = flip ? fb : fa;
    faces[b] = flip ? fa : fb;
    alive[a] = alive[b] = false;
    order.push([a, b]);
  }
  return { faces, order };
}

// Builds a deal by removing pairs in a legal order, so the result is solvable by construction.
export function dealSolvable(g: Geometry, alive: readonly boolean[], pairs: [number, number][], rng: Rng): Deal {
  for (let attempt = 0; attempt < 500; attempt++) {
    const deal = tryDeal(g, alive, pairs, rng);
    if (deal) return deal;
  }
  throw new Error("Could not generate a solvable deal in 500 attempts");
}

export function pairUp(faces: readonly number[], alive: readonly boolean[]): [number, number][] {
  const groups = new Map<string, number[]>();
  faces.forEach((f, i) => {
    if (!alive[i]) return;
    const key = matchKey(f);
    groups.set(key, [...(groups.get(key) ?? []), f]);
  });
  const pairs: [number, number][] = [];
  for (const [key, list] of groups) {
    if (list.length % 2 !== 0) throw new Error(`Odd number of tiles for match key ${key}`);
    for (let k = 0; k < list.length; k += 2) pairs.push([list[k], list[k + 1]]);
  }
  return pairs;
}

export class Game {
  readonly geometry: Geometry;
  readonly faces: number[];
  readonly alive: boolean[];
  readonly history: [number, number][] = [];

  constructor(geometry: Geometry, faces: number[]) {
    this.geometry = geometry;
    this.faces = faces;
    this.alive = faces.map(() => true);
  }

  static create(geometry: Geometry, rng: Rng): Game {
    return Game.createWithDeal(geometry, rng).game;
  }

  static createWithDeal(geometry: Geometry, rng: Rng): { game: Game; deal: Deal } {
    const n = geometry.slots.length;
    const pairs = shuffled(fullPairs(), rng).slice(0, n / 2);
    const deal = dealSolvable(geometry, new Array(n).fill(true), pairs, rng);
    return { game: new Game(geometry, deal.faces), deal };
  }

  get remaining(): number {
    return this.alive.filter(Boolean).length;
  }

  free(i: number): boolean {
    return isFree(this.geometry, i, this.alive);
  }

  canPair(i: number, j: number): boolean {
    return i !== j && this.free(i) && this.free(j) && matchKey(this.faces[i]) === matchKey(this.faces[j]);
  }

  remove(i: number, j: number): void {
    if (!this.canPair(i, j)) throw new Error(`Illegal match ${i},${j}`);
    this.alive[i] = this.alive[j] = false;
    this.history.push([i, j]);
  }

  undo(): [number, number] | null {
    const last = this.history.pop();
    if (!last) return null;
    this.alive[last[0]] = this.alive[last[1]] = true;
    return last;
  }

  moves(): [number, number][] {
    const byKey = new Map<string, number[]>();
    for (let i = 0; i < this.alive.length; i++) {
      if (!this.free(i)) continue;
      const key = matchKey(this.faces[i]);
      byKey.set(key, [...(byKey.get(key) ?? []), i]);
    }
    const out: [number, number][] = [];
    for (const list of byKey.values()) {
      for (let a = 0; a < list.length; a++) for (let b = a + 1; b < list.length; b++) out.push([list[a], list[b]]);
    }
    return out;
  }

  reshuffle(rng: Rng): Deal {
    const pairs = pairUp(this.faces, this.alive);
    const deal = dealSolvable(this.geometry, this.alive, pairs, rng);
    deal.faces.forEach((f, i) => {
      if (this.alive[i]) this.faces[i] = f;
    });
    this.history.length = 0;
    return deal;
  }
}
