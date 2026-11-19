const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98];

export class Sfx {
  enabled = true;
  private ctx: AudioContext | null = null;

  private get(): AudioContext | null {
    if (!this.enabled) return null;
    this.ctx ??= new AudioContext();
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private tone(c: AudioContext, freq: number, at: number, dur: number, type: OscillatorType, peak: number) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g).connect(c.destination);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }

  private noise(c: AudioContext, at: number, dur: number, f0: number, f1: number, peak: number, q = 1.2) {
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = q;
    bp.frequency.setValueAtTime(f0, at);
    bp.frequency.exponentialRampToValueAtTime(f1, at + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(peak, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(bp).connect(g).connect(c.destination);
    src.start(at);
  }

  private clack(c: AudioContext, at: number, peak = 0.3) {
    this.noise(c, at, 0.05, 2200, 900, peak);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.frequency.setValueAtTime(240, at);
    osc.frequency.exponentialRampToValueAtTime(90, at + 0.06);
    g.gain.setValueAtTime(peak * 0.7, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
    osc.connect(g).connect(c.destination);
    osc.start(at);
    osc.stop(at + 0.08);
  }

  select() {
    const c = this.get();
    if (c) this.clack(c, c.currentTime, 0.22);
  }

  match(combo: number) {
    const c = this.get();
    if (!c) return;
    const t = c.currentTime;
    const step = Math.min(combo - 1, 5);
    this.clack(c, t);
    for (const [k, off] of [[0, 0.05], [2, 0.13]]) {
      const f = SCALE[step + k];
      this.tone(c, f, t + off, 0.5, "triangle", 0.16);
      this.tone(c, f * 2, t + off, 0.3, "sine", 0.04);
    }
  }

  error() {
    const c = this.get();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const lp = c.createBiquadFilter();
    const g = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.16);
    lp.type = "lowpass";
    lp.frequency.value = 500;
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(lp).connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  shuffle() {
    const c = this.get();
    if (!c) return;
    const t = c.currentTime;
    this.noise(c, t, 0.55, 300, 3200, 0.3, 0.7);
    for (let k = 0; k < 6; k++) this.clack(c, t + 0.08 + k * 0.07, 0.1);
  }

  undo() {
    const c = this.get();
    if (!c) return;
    const t = c.currentTime;
    this.tone(c, SCALE[3], t, 0.16, "triangle", 0.12);
    this.tone(c, SCALE[1], t + 0.07, 0.22, "triangle", 0.12);
  }

  win() {
    const c = this.get();
    if (!c) return;
    const t = c.currentTime;
    [0, 2, 4, 5, 7, 8].forEach((s, k) => {
      this.tone(c, SCALE[s], t + k * 0.1, 0.9, "triangle", 0.18);
      this.tone(c, SCALE[s] * 2, t + k * 0.1, 0.5, "sine", 0.05);
    });
  }

  lose() {
    const c = this.get();
    if (!c) return;
    const t = c.currentTime;
    [3, 2, 0].forEach((s, k) => this.tone(c, SCALE[s] / 2, t + k * 0.18, 0.6, "triangle", 0.16));
  }
}
