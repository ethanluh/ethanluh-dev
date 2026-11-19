export type Suit = "dots" | "bamboo" | "characters" | "wind" | "dragon" | "flower" | "season";

export interface Face {
  id: number;
  suit: Suit;
  rank: number;
  key: string;
  name: string;
}

const NUMERALS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const WINDS = ["East", "South", "West", "North"];
const WIND_CHARS = ["東", "南", "西", "北"];
const DRAGONS = ["Red", "Green", "White"];
const FLOWERS = ["Plum", "Orchid", "Chrysanthemum", "Bamboo"];
const FLOWER_CHARS = ["梅", "蘭", "菊", "竹"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];
const SEASON_CHARS = ["春", "夏", "秋", "冬"];

export const FACES: Face[] = [];
for (const suit of ["dots", "bamboo", "characters"] as const) {
  for (let r = 1; r <= 9; r++) {
    FACES.push({ id: FACES.length, suit, rank: r, key: String(FACES.length), name: `${r} of ${suit}` });
  }
}
WINDS.forEach((w, r) => FACES.push({ id: FACES.length, suit: "wind", rank: r, key: String(FACES.length), name: `${w} Wind` }));
DRAGONS.forEach((d, r) => FACES.push({ id: FACES.length, suit: "dragon", rank: r, key: String(FACES.length), name: `${d} Dragon` }));
FLOWERS.forEach((f, r) => FACES.push({ id: FACES.length, suit: "flower", rank: r, key: "flower", name: `${f} (flower)` }));
SEASONS.forEach((s, r) => FACES.push({ id: FACES.length, suit: "season", rank: r, key: "season", name: `${s} (season)` }));

export const matchKey = (face: number): string => FACES[face].key;

export function fullPairs(): [number, number][] {
  const pairs: [number, number][] = [];
  for (const f of FACES) {
    if (f.suit === "flower" || f.suit === "season") continue;
    pairs.push([f.id, f.id], [f.id, f.id]);
  }
  const flowers = FACES.filter((f) => f.suit === "flower").map((f) => f.id);
  const seasons = FACES.filter((f) => f.suit === "season").map((f) => f.id);
  pairs.push([flowers[0], flowers[1]], [flowers[2], flowers[3]]);
  pairs.push([seasons[0], seasons[1]], [seasons[2], seasons[3]]);
  return pairs;
}

const DOT_COLORS = ["--g-green", "--g-red", "--g-blue"];

function dot(cx: number, cy: number, r: number, color: string): string {
  const c = `var(${color})`;
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.68}" fill="var(--face)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="${c}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.14}" fill="var(--face)"/>`
  );
}

function bigDot(): string {
  let petals = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    petals += `<circle cx="${30 + Math.cos(a) * 15.5}" cy="${40 + Math.sin(a) * 15.5}" r="2.6" fill="var(--g-red)"/>`;
  }
  return (
    `<circle cx="30" cy="40" r="20" fill="var(--g-green)"/>` +
    `<circle cx="30" cy="40" r="18.4" fill="var(--face)"/>` +
    petals +
    `<circle cx="30" cy="40" r="10.5" fill="var(--g-blue)"/>` +
    `<circle cx="30" cy="40" r="8" fill="var(--face)"/>` +
    `<circle cx="30" cy="40" r="4.6" fill="var(--g-red)"/>`
  );
}

const DOT_LAYOUTS: Record<number, { pts: [number, number][]; r: number; color: (i: number) => number }> = {
  2: { pts: [[30, 23], [30, 57]], r: 12, color: (i) => (i === 0 ? 0 : 2) },
  3: { pts: [[16, 18], [30, 40], [44, 62]], r: 10, color: (i) => [2, 1, 0][i] },
  4: { pts: [[17, 24], [43, 24], [17, 56], [43, 56]], r: 10.5, color: (i) => (i === 1 || i === 2 ? 0 : 2) },
  5: { pts: [[17, 22], [43, 22], [30, 40], [17, 58], [43, 58]], r: 9.5, color: (i) => (i === 2 ? 1 : i % 2 ? 0 : 2) },
  6: { pts: [[18, 17], [42, 17], [18, 40], [42, 40], [18, 63], [42, 63]], r: 9.5, color: (i) => (i < 2 ? 0 : 1) },
  7: { pts: [[13, 14], [30, 21], [47, 28], [18, 48], [42, 48], [18, 66], [42, 66]], r: 8, color: (i) => (i < 3 ? 0 : 1) },
  8: { pts: [[18, 14], [42, 14], [18, 32], [42, 32], [18, 50], [42, 50], [18, 68], [42, 68]], r: 8, color: (i) => (i % 4 < 2 ? 2 : 1) },
  9: { pts: [[14, 16], [30, 16], [46, 16], [14, 40], [30, 40], [46, 40], [14, 64], [30, 64], [46, 64]], r: 8, color: (i) => Math.floor(i / 3) },
};

function stick(cx: number, cy: number, len: number, w: number, color: string): string {
  const y0 = cy - len / 2;
  const c = `var(${color})`;
  return (
    `<rect x="${cx - w / 2}" y="${y0}" width="${w}" height="${len}" rx="${w * 0.4}" fill="${c}"/>` +
    `<rect x="${cx - w / 2 + w * 0.18}" y="${y0 + 1}" width="${w * 0.2}" height="${len - 2}" rx="${w * 0.1}" fill="#fff" opacity="0.28"/>` +
    `<rect x="${cx - w / 2 - 0.6}" y="${cy - 0.8}" width="${w + 1.2}" height="1.6" rx="0.8" fill="var(--face)"/>` +
    `<rect x="${cx - w / 2 - 0.6}" y="${y0 + len * 0.18}" width="${w + 1.2}" height="1.2" rx="0.6" fill="var(--face)" opacity="0.85"/>` +
    `<rect x="${cx - w / 2 - 0.6}" y="${y0 + len * 0.82 - 1.2}" width="${w + 1.2}" height="1.2" rx="0.6" fill="var(--face)" opacity="0.85"/>`
  );
}

function bird(): string {
  return (
    `<path d="M14 50 Q10 62 24 66 L40 62 Q54 54 46 38 Q44 28 34 28 Q26 28 24 36 Q14 38 14 50Z" fill="var(--g-green)"/>` +
    `<path d="M20 48 Q28 58 42 50 Q34 62 20 58Z" fill="var(--g-red)"/>` +
    `<path d="M44 44 L54 62 L46 60 L40 66Z" fill="var(--g-blue)"/>` +
    `<circle cx="34" cy="26" r="9" fill="var(--g-red)"/>` +
    `<path d="M40 22 L52 26 L41 30Z" fill="var(--g-blue)"/>` +
    `<circle cx="36" cy="24" r="2.2" fill="var(--face)"/><circle cx="36.6" cy="24" r="1" fill="var(--g-ink)"/>` +
    `<path d="M22 66 L20 74 M32 66 L30 74" stroke="var(--g-red)" stroke-width="2" stroke-linecap="round"/>`
  );
}

const BAMBOO_ROWS: Record<number, number[]> = {
  2: [1, 1],
  3: [1, 2],
  4: [2, 2],
  6: [3, 3],
  7: [1, 3, 3],
  8: [4, 4],
  9: [3, 3, 3],
};

function bamboo(rank: number): string {
  if (rank === 1) return bird();
  if (rank === 5) {
    return [[17, 22], [43, 22], [17, 58], [43, 58]].map(([x, y]) => stick(x, y, 26, 9, "--g-green")).join("") + stick(30, 40, 26, 9, "--g-red");
  }
  const rows = BAMBOO_ROWS[rank];
  const rowH = 64 / rows.length;
  const len = Math.min(26, rowH - 4);
  const w = rank >= 7 ? 7.5 : 9;
  let out = "";
  rows.forEach((n, ri) => {
    const cy = 8 + rowH * (ri + 0.5);
    for (let k = 0; k < n; k++) {
      const cx = n === 1 ? 30 : 30 + (k - (n - 1) / 2) * (n === 4 ? 13 : 17);
      const red = rank === 7 && ri === 0;
      const mid = rank === 9 && k === 1;
      out += stick(cx, cy, len, w, red || mid ? "--g-red" : "--g-green");
    }
  });
  return out;
}

const CJK = `'Noto Serif CJK SC','Noto Serif SC','Source Han Serif SC','Songti SC','STSong','SimSun',serif`;

function text(x: number, y: number, size: number, color: string, glyph: string, weight = 700): string {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="middle" font-family="${CJK}" fill="var(${color})">${glyph}</text>`;
}

function caption(label: string): string {
  return `<text x="30" y="76" font-size="6.2" text-anchor="middle" font-family="'IBM Plex Mono',monospace" letter-spacing="0.8" fill="var(--g-ink)" opacity="0.55">${label.toUpperCase()}</text>`;
}

function flowerPetals(cx: number, cy: number, r: number, color: string): string {
  let out = "";
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    out += `<circle cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" r="${r * 0.78}" fill="${color}" opacity="0.92"/>`;
  }
  return out + `<circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="#f4c542"/>`;
}

const FLOWER_COLORS = ["#d9598a", "#8e6bc9", "#e3a72f", "#3f9d6b"];
const SEASON_COLORS = ["#4fae5f", "#e2573d", "#d98a2b", "#4d8fd6"];

export function faceMarkup(face: Face): string {
  switch (face.suit) {
    case "dots": {
      if (face.rank === 1) return bigDot();
      const l = DOT_LAYOUTS[face.rank];
      return l.pts.map(([x, y], i) => dot(x, y, l.r, DOT_COLORS[l.color(i)])).join("");
    }
    case "bamboo":
      return bamboo(face.rank);
    case "characters":
      return (
        text(30, 36, 27, "--g-ink", NUMERALS[face.rank - 1]) +
        text(30, 68, 30, "--g-red", "萬") +
        `<text x="8" y="14" font-size="8" font-family="'IBM Plex Mono',monospace" fill="var(--g-ink)" opacity="0.5">${face.rank}</text>`
      );
    case "wind":
      return text(30, 50, 44, "--g-ink", WIND_CHARS[face.rank]) + caption(WINDS[face.rank]);
    case "dragon":
      if (face.rank === 2) {
        return (
          `<rect x="11" y="13" width="38" height="50" rx="4" fill="none" stroke="var(--g-blue)" stroke-width="2.6"/>` +
          `<rect x="16" y="18" width="28" height="40" rx="2" fill="none" stroke="var(--g-blue)" stroke-width="1.2"/>` +
          caption("White")
        );
      }
      return text(30, 52, 48, face.rank === 0 ? "--g-red" : "--g-green", face.rank === 0 ? "中" : "發") + caption(DRAGONS[face.rank]);
    case "flower":
      return flowerPetals(30, 26, 8.5, FLOWER_COLORS[face.rank]) + text(30, 64, 22, "--g-ink", FLOWER_CHARS[face.rank]) + caption(FLOWERS[face.rank].slice(0, 5));
    case "season":
      return (
        `<circle cx="30" cy="34" r="19" fill="${SEASON_COLORS[face.rank]}" opacity="0.16"/>` +
        `<circle cx="30" cy="34" r="19" fill="none" stroke="${SEASON_COLORS[face.rank]}" stroke-width="2.4"/>` +
        text(30, 43, 25, "--g-ink", SEASON_CHARS[face.rank]) +
        caption(SEASONS[face.rank])
      );
  }
}

export function symbolsMarkup(): string {
  return FACES.map((f) => `<symbol id="mj-f${f.id}" viewBox="0 0 60 80">${faceMarkup(f)}</symbol>`).join("");
}
