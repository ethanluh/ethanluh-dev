import type { AmbientKind } from "./config.ts";

export const prefersReducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;

function fitCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d canvas context unavailable");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  life: number;
  max: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
  shape: "dot" | "rect" | "ring";
}

export class Fx {
  private ctx: CanvasRenderingContext2D;
  private parts: Particle[] = [];
  private raf = 0;
  private last = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = fitCanvas(canvas);
    addEventListener("resize", () => (this.ctx = fitCanvas(canvas)));
  }

  burst(x: number, y: number, colors: string[], count = 26) {
    if (prefersReducedMotion()) return;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1.5 + Math.random() * 5;
      this.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5, g: 0.16,
        life: 0, max: 0.55 + Math.random() * 0.5, size: 1.5 + Math.random() * 3,
        color: colors[i % colors.length], rot: 0, vr: 0, shape: "dot",
      });
    }
    this.push({ x, y, vx: 0, vy: 0, g: 0, life: 0, max: 0.5, size: 8, color: colors[0], rot: 0, vr: 0, shape: "ring" });
  }

  confetti(colors: string[]) {
    if (prefersReducedMotion()) return;
    for (let i = 0; i < 160; i++) {
      const fromLeft = i % 2 === 0;
      const a = (fromLeft ? -0.9 : -Math.PI + 0.9) + (Math.random() - 0.5) * 0.7;
      const sp = 9 + Math.random() * 11;
      this.push({
        x: fromLeft ? 0 : innerWidth, y: innerHeight * 0.85,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.28,
        life: -Math.random() * 0.25, max: 2.4 + Math.random() * 1.4, size: 4 + Math.random() * 5,
        color: colors[i % colors.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, shape: "rect",
      });
    }
  }

  private push(p: Particle) {
    this.parts.push(p);
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame((t) => this.frame(t));
    }
  }

  private frame(now: number) {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    const c = this.ctx;
    c.clearRect(0, 0, innerWidth, innerHeight);
    const step = dt * 60;
    this.parts = this.parts.filter((p) => {
      p.life += dt;
      if (p.life < 0) return true;
      if (p.life >= p.max) return false;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + p.g * step;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.rot += p.vr * step;
      const k = 1 - p.life / p.max;
      c.globalAlpha = Math.min(1, k * 1.6);
      c.fillStyle = c.strokeStyle = p.color;
      if (p.shape === "ring") {
        c.lineWidth = 2.5 * k;
        c.beginPath();
        c.arc(p.x, p.y, p.size + (1 - k) * 70, 0, Math.PI * 2);
        c.stroke();
      } else if (p.shape === "rect") {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.scale(1, Math.abs(Math.cos(p.life * 6 + p.rot)) + 0.15);
        c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        c.restore();
      } else {
        c.beginPath();
        c.arc(p.x, p.y, p.size * (0.4 + k * 0.6), 0, Math.PI * 2);
        c.fill();
      }
      return true;
    });
    c.globalAlpha = 1;
    if (this.parts.length) {
      this.raf = requestAnimationFrame((t) => this.frame(t));
    } else {
      this.raf = 0;
      c.clearRect(0, 0, innerWidth, innerHeight);
    }
  }
}

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  rot: number;
  vr: number;
  tint: number;
}

const PETALS = ["#ffc2d4", "#ffadc5", "#ff94b3", "#ffd9e4"];

export class Ambient {
  private ctx: CanvasRenderingContext2D;
  private motes: Mote[] = [];
  private kind: AmbientKind = "fireflies";
  private color = "#ffffff";
  private raf = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = fitCanvas(canvas);
    addEventListener("resize", () => {
      this.ctx = fitCanvas(canvas);
      this.seed();
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? this.stop() : this.start()));
  }

  set(kind: AmbientKind, color: string) {
    this.kind = kind;
    this.color = color;
    this.seed();
    this.start();
  }

  private seed() {
    const count = { fireflies: 46, petals: 30, stars: 110, dust: 46, mist: 7 }[this.kind];
    const rnd = Math.random;
    this.motes = Array.from({ length: count }, () => ({
      x: rnd() * innerWidth,
      y: rnd() * innerHeight,
      r: this.kind === "mist" ? 180 + rnd() * 260 : 0.8 + rnd() * (this.kind === "petals" ? 5 : 2.4),
      vx: (rnd() - 0.5) * (this.kind === "petals" ? 0.6 : 0.25) + (this.kind === "petals" ? 0.35 : 0),
      vy: this.kind === "petals" ? 0.35 + rnd() * 0.7 : this.kind === "dust" ? -0.08 - rnd() * 0.18 : (rnd() - 0.5) * 0.2,
      phase: rnd() * Math.PI * 2,
      rot: rnd() * Math.PI * 2,
      vr: (rnd() - 0.5) * 0.03,
      tint: Math.floor(rnd() * PETALS.length),
    }));
  }

  private start() {
    if (this.raf || prefersReducedMotion()) {
      if (prefersReducedMotion()) this.drawOnce();
      return;
    }
    const loop = (t: number) => {
      this.draw(t);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private drawOnce() {
    this.draw(0);
  }

  private draw(t: number) {
    const c = this.ctx;
    const w = innerWidth;
    const h = innerHeight;
    c.clearRect(0, 0, w, h);
    for (const m of this.motes) {
      m.x += m.vx + Math.sin(t * 0.0006 + m.phase) * 0.12;
      m.y += m.vy + Math.cos(t * 0.0005 + m.phase) * 0.08;
      m.rot += m.vr;
      const pad = m.r + 20;
      if (m.x < -pad) m.x = w + pad;
      if (m.x > w + pad) m.x = -pad;
      if (m.y < -pad) m.y = h + pad;
      if (m.y > h + pad) m.y = -pad;
      const tw = 0.5 + 0.5 * Math.sin(t * 0.002 + m.phase * 3);
      switch (this.kind) {
        case "fireflies":
          c.globalAlpha = 0.15 + tw * 0.65;
          c.shadowColor = this.color;
          c.shadowBlur = 14;
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          c.fill();
          break;
        case "stars":
          c.globalAlpha = 0.2 + tw * 0.8;
          c.shadowBlur = m.r > 1.8 ? 8 : 0;
          c.shadowColor = this.color;
          c.fillStyle = m.r > 1.8 ? this.color : "#ffffff";
          c.beginPath();
          c.arc(m.x, m.y, m.r * 0.6, 0, Math.PI * 2);
          c.fill();
          break;
        case "dust":
          c.globalAlpha = 0.12 + tw * 0.25;
          c.shadowBlur = 0;
          c.fillStyle = "#fff8e0";
          c.beginPath();
          c.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          c.fill();
          break;
        case "petals":
          c.globalAlpha = 0.75;
          c.shadowBlur = 0;
          c.fillStyle = PETALS[m.tint];
          c.beginPath();
          c.ellipse(m.x, m.y, m.r * 1.5, m.r * (0.5 + 0.5 * Math.abs(Math.sin(t * 0.001 + m.phase))), m.rot, 0, Math.PI * 2);
          c.fill();
          break;
        case "mist": {
          const g = c.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
          g.addColorStop(0, "rgba(40,40,36,0.10)");
          g.addColorStop(1, "rgba(40,40,36,0)");
          c.globalAlpha = 1;
          c.shadowBlur = 0;
          c.fillStyle = g;
          c.fillRect(m.x - m.r, m.y - m.r, m.r * 2, m.r * 2);
          break;
        }
      }
    }
    c.globalAlpha = 1;
    c.shadowBlur = 0;
  }
}
