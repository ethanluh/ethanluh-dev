import { MODE_IDS, THEMES, themeById, type ModeId } from "./config.ts";
import { Game, buildGeometry, hashString, mulberry32, type Rng } from "./engine.ts";
import { Ambient, Fx } from "./fx.ts";
import { LAYOUTS, layoutById } from "./layouts.ts";
import { Sfx } from "./audio.ts";
import { loadPrefs, loadStats, savePrefs, saveStats } from "./storage.ts";
import { FACES, symbolsMarkup } from "./tiles.ts";

const COMBO_WINDOW_MS = 5000;
const TIMED_START_MS = 5 * 60 * 1000;
const TIMED_CAP_MS = 8 * 60 * 1000;
const DEAL_STAGGER_MS = 7;

interface Rules {
  timer: "up" | "down" | "none";
  scored: boolean;
  hintCost: number;
  undoCost: number;
  shuffleCost: number;
  autoShuffle: boolean;
}

const RULES: Record<ModeId, Rules> = {
  classic: { timer: "up", scored: true, hintCost: 50, undoCost: 25, shuffleCost: 100, autoShuffle: false },
  timed: { timer: "down", scored: true, hintCost: 10_000, undoCost: 10_000, shuffleCost: 15_000, autoShuffle: false },
  zen: { timer: "none", scored: false, hintCost: 0, undoCost: 0, shuffleCost: 0, autoShuffle: true },
  daily: { timer: "up", scored: true, hintCost: 50, undoCost: 25, shuffleCost: 100, autoShuffle: false },
  fog: { timer: "up", scored: true, hintCost: 50, undoCost: 25, shuffleCost: 100, autoShuffle: false },
};

interface Session {
  mode: ModeId;
  layoutId: string;
  seed: number;
  game: Game;
  rng: Rng;
  tiles: HTMLButtonElement[];
  selected: number | null;
  hint: [number, number] | null;
  hintCursor: number;
  score: number;
  combo: number;
  lastMatchAt: number;
  moves: number;
  elapsedMs: number;
  remainingMs: number;
  over: boolean;
}

function el<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

const board = el("mj-board");
const stage = el("mj-stage");
const menu = el("mj-menu");
const result = el("mj-result");
const toastEl = el("mj-toast");
const hud = {
  mode: el("hud-mode"),
  score: el("hud-score"),
  time: el("hud-time"),
  tiles: el("hud-tiles"),
  moves: el("hud-moves"),
  scoreBox: el("hud-score-box"),
  timeLabel: el("hud-time-label"),
};

el("mj-defs").innerHTML = symbolsMarkup();

const prefs = loadPrefs();
const stats = loadStats(MODE_IDS);
const sfx = new Sfx();
sfx.enabled = prefs.sound;
const fx = new Fx(el<HTMLCanvasElement>("mj-fx"));
const ambient = new Ambient(el<HTMLCanvasElement>("mj-ambient"));

let session: Session | null = null;
let lastTick = performance.now();
let toastTimer = 0;
let dealTimer = 0;

const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const elapsedText = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const today = () => new Date().toLocaleDateString("en-CA");

function toast(message: string, ms = 2200) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), ms);
}

function accent(): string {
  return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
}

function fxColors(): string[] {
  const cs = getComputedStyle(document.documentElement);
  return [accent(), cs.getPropertyValue("--g-red").trim(), cs.getPropertyValue("--g-green").trim(), cs.getPropertyValue("--g-blue").trim(), cs.getPropertyValue("--face").trim()];
}

function applyTheme(id: string) {
  const theme = themeById(id);
  document.documentElement.dataset.mjTheme = id;
  prefs.theme = id;
  savePrefs(prefs);
  ambient.set(theme.ambient, accent());
  document.querySelectorAll<HTMLElement>("[data-theme-id]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.themeId === id)));
}

function isPlaying(): boolean {
  return session !== null && !session.over && menu.hidden && result.hidden;
}

function layoutFor(mode: ModeId, seed: number, chosen: string): string {
  return mode === "daily" ? LAYOUTS[seed % LAYOUTS.length].id : chosen;
}

function startGame(restartSameDeal = false) {
  const mode = prefs.mode;
  const prev = session;
  const seed =
    restartSameDeal && prev
      ? prev.seed
      : mode === "daily"
        ? hashString(`daily-${today()}`)
        : Math.floor(Math.random() * 2 ** 32);
  const layoutId = restartSameDeal && prev ? prev.layoutId : layoutFor(mode, seed, prefs.layout);
  const game = Game.create(buildGeometry(layoutById(layoutId).slots), mulberry32(seed));
  const rules = RULES[mode];

  session = {
    mode, layoutId, seed, game,
    rng: mulberry32(seed ^ 0x9e3779b9),
    tiles: [], selected: null, hint: null, hintCursor: 0,
    score: 0, combo: 0, lastMatchAt: 0, moves: 0, elapsedMs: 0,
    remainingMs: rules.timer === "down" ? TIMED_START_MS : 0,
    over: false,
  };
  stats[mode].played++;
  saveStats(stats);

  buildBoard(session);
  closeMenu();
  result.hidden = true;
  lastTick = performance.now();
  refresh();
  hud.mode.textContent = modeLabel(mode) + (mode === "daily" ? ` · ${today()}` : "");
  hud.timeLabel.textContent = rules.timer === "down" ? "Left" : "Time";
  hud.scoreBox.hidden = !rules.scored;
  if (mode === "daily") toast(`Daily board: ${layoutLabel(layoutId)}`);
}

function modeLabel(mode: ModeId): string {
  return el(`mode-${mode}`).dataset.label ?? mode;
}
function layoutLabel(id: string): string {
  return el(`layout-${id}`).dataset.label ?? id;
}

function buildBoard(s: Session) {
  const slots = s.game.geometry.slots;
  board.replaceChildren();
  board.className = `mj-board dealing mode-${s.mode}`;
  const order = slots.map((_, i) => i).sort((a, b) => slots[a].z - slots[b].z || slots[a].y - slots[b].y || slots[a].x - slots[b].x);
  s.tiles = new Array(slots.length);
  order.forEach((i, k) => {
    const slot = slots[i];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile";
    btn.dataset.i = String(i);
    btn.style.cssText = `--x:${slot.x};--y:${slot.y};--z:${slot.z};--i:${k};z-index:${slot.z * 10000 + slot.y * 100 + slot.x}`;
    btn.innerHTML =
      `<span class="tile-shadow"></span><span class="tile-side"></span>` +
      `<span class="tile-face"><svg viewBox="0 0 60 80" aria-hidden="true"><use href="#mj-f${s.game.faces[i]}"/></svg></span>`;
    btn.setAttribute("aria-label", FACES[s.game.faces[i]].name);
    s.tiles[i] = btn;
    board.append(btn);
  });
  fit();
  clearTimeout(dealTimer);
  dealTimer = window.setTimeout(() => board.classList.remove("dealing"), order.length * DEAL_STAGGER_MS + 800);
}

function fit() {
  if (!session) return;
  const slots = session.game.geometry.slots;
  const maxX = Math.max(...slots.map((s) => s.x)) + 2;
  const maxY = Math.max(...slots.map((s) => s.y)) + 2;
  const maxZ = Math.max(...slots.map((s) => s.z));
  const { width, height } = stage.getBoundingClientRect();
  const pad = 20;
  const dRatio = 0.2;
  const uW = (width - pad * 2) / (maxX + (maxZ + 1) * dRatio);
  const uH = (height - pad * 2) / (maxY * 1.3 + (maxZ + 1) * dRatio);
  const u = Math.max(3, Math.min(uW, uH, 34));
  const d = u * dRatio;
  board.style.cssText = `--u:${u}px;--vu:${u * 1.3}px;--tw:${u * 2}px;--th:${u * 2.6}px;--d:${d}px;--zm:${maxZ};` +
    `width:${maxX * u + (maxZ + 1) * d}px;height:${maxY * u * 1.3 + (maxZ + 1) * d}px`;
}

function center(i: number): { x: number; y: number } {
  const r = session!.tiles[i].querySelector(".tile-face")!.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function clearHint() {
  if (!session?.hint) return;
  for (const i of session.hint) session.tiles[i].classList.remove("hint");
  session.hint = null;
}

function setSelected(i: number | null) {
  if (!session) return;
  if (session.selected !== null) session.tiles[session.selected].classList.remove("selected");
  document.querySelectorAll(".cand").forEach((n) => n.classList.remove("cand"));
  session.selected = i;
  if (i === null) return;
  session.tiles[i].classList.add("selected");
  const key = FACES[session.game.faces[i]].key;
  session.game.faces.forEach((f, j) => {
    if (j !== i && session!.game.alive[j] && FACES[f].key === key && session!.game.free(j)) session!.tiles[j].classList.add("cand");
  });
}

function shake(i: number) {
  const t = session!.tiles[i];
  t.classList.remove("shake");
  void t.offsetWidth;
  t.classList.add("shake");
}

function onTile(i: number) {
  if (!isPlaying() || !session) return;
  const s = session;
  if (!s.game.alive[i]) return;
  if (!s.game.free(i)) {
    shake(i);
    sfx.error();
    return;
  }
  clearHint();
  if (s.selected === null) {
    setSelected(i);
    sfx.select();
  } else if (s.selected === i) {
    setSelected(null);
  } else if (s.game.canPair(s.selected, i)) {
    match(s.selected, i);
  } else {
    shake(s.selected);
    shake(i);
    sfx.error();
    setSelected(i);
  }
}

function match(a: number, b: number) {
  const s = session!;
  const rules = RULES[s.mode];
  const pa = center(a);
  const pb = center(b);
  s.game.remove(a, b);
  s.moves++;
  setSelected(null);

  const now = performance.now();
  s.combo = now - s.lastMatchAt < COMBO_WINDOW_MS ? s.combo + 1 : 1;
  s.lastMatchAt = now;

  let gained = 0;
  if (rules.scored) {
    gained = 10 * Math.min(s.combo, 8);
    s.score += gained;
  }
  if (rules.timer === "down") s.remainingMs = Math.min(TIMED_CAP_MS, s.remainingMs + 2000 + Math.min(s.combo, 6) * 500);

  for (const i of [a, b]) {
    const t = s.tiles[i];
    t.classList.add("removing");
    t.addEventListener("animationend", () => t.classList.add("gone"), { once: true });
  }
  const colors = fxColors();
  fx.burst(pa.x, pa.y, colors);
  fx.burst(pb.x, pb.y, colors);
  const mid = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
  if (rules.scored) floatText(mid.x, mid.y, s.combo > 1 ? `+${gained}  x${s.combo}` : `+${gained}`);
  sfx.match(s.combo);

  refresh();
  if (s.game.remaining === 0) return void finish(true);
  if (s.game.moves().length === 0) noMoves();
}

function floatText(x: number, y: number, text: string) {
  const n = document.createElement("div");
  n.className = "mj-float";
  n.textContent = text;
  n.style.left = `${x}px`;
  n.style.top = `${y}px`;
  document.body.append(n);
  n.addEventListener("animationend", () => n.remove(), { once: true });
}

function noMoves() {
  const s = session!;
  if (RULES[s.mode].autoShuffle) {
    toast("No moves left. Reshuffling.");
    setTimeout(() => doShuffle(true), 500);
  } else {
    toast("No moves left. Press Shuffle.", 4000);
    el("btn-shuffle").classList.add("attn");
  }
}

function refresh() {
  const s = session;
  if (!s) return;
  const g = s.game;
  g.alive.forEach((alive, i) => {
    if (!alive) return;
    const f = g.free(i);
    s.tiles[i].classList.toggle("blocked", !f);
    s.tiles[i].tabIndex = f ? 0 : -1;
    s.tiles[i].setAttribute("aria-disabled", String(!f));
  });
  const moves = g.moves().length;
  hud.tiles.textContent = String(g.remaining);
  hud.moves.textContent = String(moves);
  hud.score.textContent = String(s.score);
  if (moves > 0) el("btn-shuffle").classList.remove("attn");
  paintClock();
  (el("btn-undo") as HTMLButtonElement).disabled = g.history.length === 0;
}

function paintClock() {
  const s = session;
  if (!s) return;
  const rules = RULES[s.mode];
  hud.time.textContent = rules.timer === "down" ? mmss(s.remainingMs) : rules.timer === "up" ? elapsedText(s.elapsedMs) : "—";
  hud.time.classList.toggle("warn", rules.timer === "down" && s.remainingMs < 30_000);
}

function charge(s: Session, cost: number) {
  const rules = RULES[s.mode];
  if (rules.timer === "down") s.remainingMs = Math.max(0, s.remainingMs - cost);
  else if (rules.scored) s.score = Math.max(0, s.score - cost);
}

function doHint() {
  if (!isPlaying() || !session) return;
  const s = session;
  const moves = s.game.moves();
  if (moves.length === 0) return noMoves();
  clearHint();
  s.hint = moves[s.hintCursor++ % moves.length];
  for (const i of s.hint) s.tiles[i].classList.add("hint");
  charge(s, RULES[s.mode].hintCost);
  refresh();
  if (s.remainingMs === 0 && RULES[s.mode].timer === "down") finish(false);
}

function doUndo() {
  if (!isPlaying() || !session) return;
  const s = session;
  const pair = s.game.undo();
  if (!pair) return toast("Nothing to undo.");
  clearHint();
  setSelected(null);
  for (const i of pair) {
    const t = s.tiles[i];
    t.classList.remove("gone", "removing");
    t.classList.add("restoring");
    t.addEventListener("animationend", () => t.classList.remove("restoring"), { once: true });
  }
  s.combo = 0;
  charge(s, RULES[s.mode].undoCost);
  sfx.undo();
  refresh();
  if (s.remainingMs === 0 && RULES[s.mode].timer === "down") finish(false);
}

function doShuffle(free = false) {
  if (!isPlaying() && !free) return;
  const s = session;
  if (!s || s.over) return;
  clearHint();
  setSelected(null);
  s.game.reshuffle(s.rng);
  let k = 0;
  s.game.alive.forEach((alive, i) => {
    if (!alive) return;
    const t = s.tiles[i];
    const delay = (k++ % 24) * 12;
    t.style.setProperty("--fd", `${delay}ms`);
    t.classList.remove("flip");
    void t.offsetWidth;
    t.classList.add("flip");
    setTimeout(() => {
      t.querySelector("use")!.setAttribute("href", `#mj-f${s.game.faces[i]}`);
      t.setAttribute("aria-label", FACES[s.game.faces[i]].name);
    }, delay + 220);
    t.addEventListener("animationend", () => t.classList.remove("flip"), { once: true });
  });
  if (!free) charge(s, RULES[s.mode].shuffleCost);
  sfx.shuffle();
  refresh();
  if (s.remainingMs === 0 && RULES[s.mode].timer === "down") finish(false);
}

function tick() {
  const now = performance.now();
  const dt = now - lastTick;
  lastTick = now;
  const s = session;
  if (!s || s.over || !isPlaying() || document.hidden) return;
  const rules = RULES[s.mode];
  s.elapsedMs += dt;
  if (rules.timer === "down") {
    s.remainingMs -= dt;
    if (s.remainingMs <= 0) {
      s.remainingMs = 0;
      paintClock();
      return void finish(false);
    }
  }
  paintClock();
}

function finish(won: boolean) {
  const s = session!;
  s.over = true;
  toastEl.classList.remove("show");
  const rules = RULES[s.mode];
  const st = stats[s.mode];
  let bonus = 0;
  if (won && rules.scored) {
    bonus = rules.timer === "down" ? Math.floor(s.remainingMs / 1000) * 5 : Math.max(0, 2000 - Math.floor(s.elapsedMs / 1000) * 3);
    s.score += bonus;
  }
  let record = false;
  if (won) {
    st.won++;
    if (rules.scored && (st.bestScore === null || s.score > st.bestScore)) {
      st.bestScore = s.score;
      record = true;
    }
    if (rules.timer === "up") {
      const day = today();
      const sameDay = s.mode !== "daily" || st.bestDate === day;
      if (st.bestTimeMs === null || !sameDay || s.elapsedMs < st.bestTimeMs) {
        st.bestTimeMs = s.elapsedMs;
        if (s.mode === "daily") st.bestDate = day;
        record = true;
      }
    }
  }
  saveStats(stats);
  refresh();

  el("result-title").textContent = won ? "Board cleared" : "Time is up";
  const rows: [string, string][] = [];
  if (rules.timer === "up") rows.push(["Time", elapsedText(s.elapsedMs)]);
  if (rules.timer === "down" && won) rows.push(["Time left", mmss(s.remainingMs)]);
  if (rules.scored) rows.push(["Score", String(s.score) + (bonus ? ` (+${bonus} bonus)` : "")]);
  rows.push(["Matches", String(s.moves)], ["Tiles left", String(s.game.remaining)]);
  el("result-rows").innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  el("result-record").hidden = !record;

  setTimeout(() => {
    result.hidden = false;
    (el("result-again") as HTMLButtonElement).focus();
  }, won ? 900 : 300);
  if (won) {
    sfx.win();
    fx.confetti(fxColors());
  } else {
    sfx.lose();
  }
}

function openMenu() {
  paintStats();
  menu.hidden = false;
  el("menu-resume").hidden = !(session && !session.over);
  (el(session && !session.over ? "menu-resume" : "menu-play") as HTMLButtonElement).focus();
}

function closeMenu() {
  menu.hidden = true;
  lastTick = performance.now();
}

function paintStats() {
  const st = stats[prefs.mode];
  const parts = [`Played ${st.played}`, `Won ${st.won}`];
  if (st.bestScore !== null) parts.push(`Best score ${st.bestScore}`);
  if (st.bestTimeMs !== null && (prefs.mode !== "daily" || st.bestDate === today())) parts.push(`Best time ${elapsedText(st.bestTimeMs)}`);
  el("menu-stats").textContent = parts.join("  ·  ");
  el("menu-layout-note").hidden = prefs.mode !== "daily";
}

function chooseRadio(group: string, value: string, apply: (v: string) => void) {
  document.querySelectorAll<HTMLElement>(`[data-group="${group}"]`).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.value === value)));
  apply(value);
}

function initMenu() {
  chooseRadio("mode", prefs.mode, (v) => (prefs.mode = v as ModeId));
  chooseRadio("layout", prefs.layout, (v) => (prefs.layout = v));
  document.querySelectorAll<HTMLElement>("[data-group]").forEach((b) => {
    b.addEventListener("click", () => {
      const group = b.dataset.group!;
      chooseRadio(group, b.dataset.value!, (v) => {
        if (group === "mode") prefs.mode = v as ModeId;
        else prefs.layout = v;
      });
      savePrefs(prefs);
      paintStats();
      sfx.select();
    });
  });
  document.querySelectorAll<HTMLElement>("[data-theme-id]").forEach((b) => b.addEventListener("click", () => applyTheme(b.dataset.themeId!)));
  document.querySelectorAll<SVGElement>("[data-thumb]").forEach(drawThumb);
  document.querySelectorAll<HTMLElement>("[data-swatch]").forEach((n) => {
    const [bg, face, acc] = themeById(n.dataset.swatch!).swatch;
    n.style.cssText = `--s1:${bg};--s2:${face};--s3:${acc}`;
  });
}

function drawThumb(svg: SVGElement) {
  const slots = layoutById(svg.dataset.thumb!).slots;
  const maxX = Math.max(...slots.map((s) => s.x)) + 2;
  const maxY = Math.max(...slots.map((s) => s.y)) + 2;
  svg.setAttribute("viewBox", `0 0 ${maxX + 2} ${maxY * 1.3 + 2}`);
  svg.innerHTML = [...slots]
    .sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x)
    .map((s) => `<rect x="${s.x + 1 - s.z * 0.5}" y="${s.y * 1.3 + 1 - s.z * 0.5}" width="1.9" height="2.5" rx="0.4"/>`)
    .join("");
}

function syncSound() {
  const btn = el("btn-sound");
  btn.setAttribute("aria-pressed", String(sfx.enabled));
  btn.querySelector(".on")!.toggleAttribute("hidden", !sfx.enabled);
  btn.querySelector(".off")!.toggleAttribute("hidden", sfx.enabled);
}

board.addEventListener("click", (e) => {
  const tile = (e.target as HTMLElement).closest<HTMLElement>(".tile");
  if (tile) onTile(Number(tile.dataset.i));
});
el("btn-hint").addEventListener("click", doHint);
el("btn-undo").addEventListener("click", doUndo);
el("btn-shuffle").addEventListener("click", () => doShuffle());
el("btn-menu").addEventListener("click", () => (menu.hidden ? openMenu() : session && !session.over && closeMenu()));
el("btn-sound").addEventListener("click", () => {
  sfx.enabled = !sfx.enabled;
  prefs.sound = sfx.enabled;
  savePrefs(prefs);
  syncSound();
  sfx.select();
});
el("menu-play").addEventListener("click", () => startGame());
el("menu-resume").addEventListener("click", closeMenu);
el("result-again").addEventListener("click", () => startGame());
el("result-menu").addEventListener("click", () => {
  result.hidden = true;
  openMenu();
});

addEventListener("resize", fit);
addEventListener("keydown", (e) => {
  if (e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === "escape") {
    if (!menu.hidden) {
      if (session && !session.over) closeMenu();
    } else if (result.hidden) openMenu();
  } else if (k === "m") el("btn-sound").click();
  else if (!menu.hidden || !result.hidden) return;
  else if (k === "h") doHint();
  else if (k === "u" || (k === "z" && e.ctrlKey)) doUndo();
  else if (k === "s") doShuffle();
  else if (k === "n") startGame();
  else if (k === "r") startGame(true);
});
setInterval(tick, 200);

initMenu();
applyTheme(prefs.theme);
syncSound();
openMenu();
