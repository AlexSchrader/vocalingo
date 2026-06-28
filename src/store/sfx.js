// Synthesized sound effects via Web Audio API — no audio files, no network.
// All functions are fire-and-forget; errors are swallowed silently.
//
// Sounds are tuned to be ND-friendly: correct is warm/encouraging,
// wrong is gentle (not a harsh buzzer), click is barely-there. They also respect
// the user's "Sound effects" preference — off means total silence here (a real
// need for sound-sensitive learners studying in quiet/shared spaces).

import { useStore } from "./useStore.js";

// Read the live preference at call time. Defaults to on if the store isn't ready.
function sfxOn() {
  try { return useStore.getState().settings?.sfx ?? true; } catch { return true; }
}

let _ctx = null;

function ac() {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function safe(fn) {
  if (!sfxOn()) return;
  try { fn(ac()); } catch {}
}

// Very short tick — confirms a button tap without competing with content audio.
export function sfxClick() {
  safe((ctx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 900;
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.start(t);
    osc.stop(t + 0.05);
  });
}

// Warm three-note ascending chime: C5 → E5 → G5.
export function sfxCorrect() {
  safe((ctx) => {
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  });
}

// Gentle descending slide — soft "oops", not a harsh buzzer.
export function sfxWrong() {
  safe((ctx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.type = "sine";
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.22);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.start(t);
    osc.stop(t + 0.25);
  });
}
