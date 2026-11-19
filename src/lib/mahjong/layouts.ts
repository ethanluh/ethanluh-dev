export interface Slot {
  x: number;
  y: number;
  z: number;
}

export interface Layout {
  id: string;
  slots: Slot[];
}

function build(add: (put: (x: number, y: number, z: number) => void) => void): Slot[] {
  const seen = new Map<string, Slot>();
  add((x, y, z) => {
    const slot = { x: Math.round(x * 2), y: Math.round(y * 2), z };
    seen.set(`${slot.x},${slot.y},${slot.z}`, slot);
  });
  return [...seen.values()];
}

function rect(put: (x: number, y: number, z: number) => void, x0: number, y0: number, cols: number, rows: number, z: number) {
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) put(x0 + c, y0 + r, z);
}

function ascii(put: (x: number, y: number, z: number) => void, z: number, rows: string[]) {
  rows.forEach((row, y) => [...row].forEach((ch, x) => ch === "#" && put(x, y, z)));
}

const turtle = build((put) => {
  const rows: [number, number, number][] = [
    [0, 1, 12], [1, 3, 10], [2, 2, 11], [3, 1, 12], [4, 1, 12], [5, 2, 11], [6, 3, 10], [7, 1, 12],
  ];
  for (const [y, a, b] of rows) for (let x = a; x <= b; x++) put(x, y, 0);
  put(0, 3.5, 0);
  put(13, 3.5, 0);
  put(14, 3.5, 0);
  rect(put, 4, 1, 6, 6, 1);
  rect(put, 5, 2, 4, 4, 2);
  rect(put, 6, 3, 2, 2, 3);
  put(6.5, 3.5, 4);
});

const pyramid = build((put) => {
  rect(put, 1, 0, 10, 7, 0);
  rect(put, 2, 1, 8, 5, 1);
  rect(put, 3, 2, 6, 3, 2);
  rect(put, 4, 3, 4, 1, 3);
});

const fortress = build((put) => {
  rect(put, 0, 0, 12, 8, 0);
  for (let x = 1; x <= 10; x++) {
    put(x, 1, 1);
    put(x, 6, 1);
  }
  for (let y = 2; y <= 5; y++) {
    put(1, y, 1);
    put(10, y, 1);
  }
  for (const [x, y] of [[1, 1], [10, 1], [1, 6], [10, 6]]) {
    put(x, y, 2);
    put(x, y, 3);
  }
  rect(put, 4, 3, 4, 2, 1);
  rect(put, 5, 3, 2, 2, 2);
});

const cross = build((put) => {
  rect(put, 4, 0, 4, 10, 0);
  rect(put, 0, 3, 12, 4, 0);
  rect(put, 5, 1, 2, 8, 1);
  rect(put, 1, 4, 10, 2, 1);
  rect(put, 5, 2, 2, 6, 2);
  rect(put, 3, 4, 6, 2, 2);
  rect(put, 5, 3, 2, 4, 3);
  rect(put, 4, 4, 4, 2, 3);
  rect(put, 5, 4, 2, 2, 4);
});

const butterfly = build((put) => {
  ascii(put, 0, [
    "###........###",
    "#####....#####",
    "##############",
    "##############",
    "#####....#####",
    "####......####",
    "###........###",
  ]);
  ascii(put, 1, [
    "..............",
    "..###....###..",
    "..##########..",
    "..##########..",
    "..###....###..",
  ]);
  ascii(put, 2, ["..............", "..............", "...########...", "...########..."]);
  ascii(put, 3, ["..............", "..............", ".....####.....", ".....####....."]);
  ascii(put, 4, ["..............", "..............", "......##......", "......##......"]);
});

export const LAYOUTS: Layout[] = [
  { id: "turtle", slots: turtle },
  { id: "pyramid", slots: pyramid },
  { id: "fortress", slots: fortress },
  { id: "cross", slots: cross },
  { id: "butterfly", slots: butterfly },
];

export function layoutById(id: string): Layout {
  const layout = LAYOUTS.find((l) => l.id === id);
  if (!layout) throw new Error(`Unknown mahjong layout: ${id}`);
  return layout;
}
