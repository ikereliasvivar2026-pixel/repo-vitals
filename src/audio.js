// Audio procedural con Web Audio API: ambiente, música de tensión y efectos.
// Sin assets externos — todo se genera al vuelo.

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.ambient = null;
    this.music = null;
    this.currentTrack = null;
  }

  _ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(this.ctx.destination);
  }

  resume() {
    this._ensure();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(v) {
    this._ensure();
    this.muted = v;
    if (!this.master) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(
      v ? 0 : 0.8,
      this.ctx.currentTime + 0.2
    );
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // --- UI sounds ---
  click() {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(820, t);
    o.frequency.exponentialRampToValueAtTime(420, t + 0.08);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.14);
  }

  hover() {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(1200, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.08);
  }

  // Sonido de pista descubierta
  evidenceFound() {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
    notes.forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.6);
      o.connect(g).connect(this.master);
      o.start(t + i * 0.08);
      o.stop(t + i * 0.08 + 0.7);
    });
  }

  // Pasos sintetizados
  step() {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufSize = Math.floor(this.ctx.sampleRate * 0.12);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const flt = this.ctx.createBiquadFilter();
    flt.type = "lowpass";
    flt.frequency.value = 380 + Math.random() * 80;
    const g = this.ctx.createGain();
    g.gain.value = 0.06;
    src.connect(flt).connect(g).connect(this.master);
    src.start(t);
  }

  // Chapoteo de agua corto
  splash() {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufSize = Math.floor(this.ctx.sampleRate * 0.6);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      const env = Math.pow(1 - i / bufSize, 1.5);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const flt = this.ctx.createBiquadFilter();
    flt.type = "bandpass";
    flt.frequency.value = 1400;
    flt.Q.value = 1.2;
    const g = this.ctx.createGain();
    g.gain.value = 0.22;
    src.connect(flt).connect(g).connect(this.master);
    src.start(t);
  }

  // Pulso grave de tensión
  thump() {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.6);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.9);
  }

  win() {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392, 523.25];
    notes.forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.22, t + i * 0.12 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.5);
      o.connect(g).connect(this.master);
      o.start(t + i * 0.12);
      o.stop(t + i * 0.12 + 0.55);
    });
  }

  lose() {
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [392, 311.13, 261.63, 220];
    notes.forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.18 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 0.7);
      const lp = this.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 700;
      o.connect(lp).connect(g).connect(this.master);
      o.start(t + i * 0.18);
      o.stop(t + i * 0.18 + 0.75);
    });
  }

  // --- Ambient loops ---
  // Track 'pool': agua filtrada + zumbido suave + drone grave
  // Track 'office': drone cálido + reloj
  // Track 'tension': drones disonantes (para resultado / final)

  startAmbient(track = "pool") {
    this._ensure();
    if (!this.ctx) return;
    this.stopAmbient();
    this.currentTrack = track;

    const out = this.ctx.createGain();
    out.gain.value = 0;
    out.gain.linearRampToValueAtTime(
      0.45,
      this.ctx.currentTime + 1.5
    );
    out.connect(this.master);

    // Componente 1: ruido rosa filtrado (agua / ambiente)
    const bufSize = this.ctx.sampleRate * 4;
    const noiseBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < bufSize; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.96 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      nd[i] = (b0 + b1 + b2 + w * 0.1848) * 0.15;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    const noiseGain = this.ctx.createGain();

    if (track === "pool") {
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 900;
      noiseFilter.Q.value = 0.4;
      noiseGain.gain.value = 0.55;
    } else if (track === "office") {
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 320;
      noiseGain.gain.value = 0.25;
    } else {
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 600;
      noiseGain.gain.value = 0.3;
    }

    noise.connect(noiseFilter).connect(noiseGain).connect(out);
    noise.start();

    // Componente 2: drone armónico (osciladores)
    const droneFreqs =
      track === "pool"
        ? [55, 82.5, 110]
        : track === "office"
        ? [65.41, 98, 130.81]
        : [55, 73.42, 110];

    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.0;
    droneGain.gain.linearRampToValueAtTime(
      track === "tension" ? 0.4 : 0.22,
      this.ctx.currentTime + 3
    );
    droneGain.connect(out);

    const droneOsc = droneFreqs.map((f, i) => {
      const o = this.ctx.createOscillator();
      o.type = i === 0 ? "sine" : "triangle";
      o.frequency.value = f;
      // LFO sutil
      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.1 + i * 0.07;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.5 + i * 0.3;
      lfo.connect(lfoGain).connect(o.frequency);
      lfo.start();
      o.connect(droneGain);
      o.start();
      return { o, lfo };
    });

    // Goteo intermitente (pool)
    let dripTimer = null;
    if (track === "pool") {
      const scheduleDrip = () => {
        const delay = 1500 + Math.random() * 4000;
        dripTimer = setTimeout(() => {
          if (!this.ambient) return;
          const t = this.ctx.currentTime;
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(900 + Math.random() * 300, t);
          o.frequency.exponentialRampToValueAtTime(600, t + 0.18);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.08, t + 0.005);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
          o.connect(g).connect(out);
          o.start(t);
          o.stop(t + 0.22);
          scheduleDrip();
        }, delay);
      };
      scheduleDrip();
    }

    // Reloj (office)
    let tickTimer = null;
    if (track === "office") {
      tickTimer = setInterval(() => {
        if (!this.ambient) return;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = "square";
        o.frequency.value = 2200;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.03, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        o.connect(g).connect(out);
        o.start(t);
        o.stop(t + 0.04);
      }, 1000);
    }

    this.ambient = {
      out,
      noise,
      droneOsc,
      dripTimer,
      tickTimer,
    };
  }

  stopAmbient() {
    if (!this.ambient || !this.ctx) return;
    const a = this.ambient;
    this.ambient = null;
    const t = this.ctx.currentTime;
    a.out.gain.cancelScheduledValues(t);
    a.out.gain.linearRampToValueAtTime(0, t + 0.6);
    setTimeout(() => {
      try {
        a.noise.stop();
        a.droneOsc.forEach(({ o, lfo }) => {
          o.stop();
          lfo.stop();
        });
      } catch (e) {}
      if (a.dripTimer) clearTimeout(a.dripTimer);
      if (a.tickTimer) clearInterval(a.tickTimer);
    }, 700);
  }
}

export const audio = new AudioEngine();
export default AudioEngine;
