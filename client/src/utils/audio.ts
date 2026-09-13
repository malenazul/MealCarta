// Web Audio API Synthesizer for Encarta Neo sound effects
// Lightweight, no external audio files required!

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  isEnabled: (): boolean => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('mealcarta_sound_enabled');
    return stored === null ? true : stored === 'true';
  },

  toggleSound: (): boolean => {
    const current = soundManager.isEnabled();
    const next = !current;
    localStorage.setItem('mealcarta_sound_enabled', String(next));
    if (next) {
      soundManager.playClick();
    }
    return next;
  },

  playClick: () => {
    if (!soundManager.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio playback safety catch
    }
  },

  playChime: () => {
    if (!soundManager.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Encarta celestial discovery chord)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        const startTime = ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch {
      // Audio playback safety catch
    }
  },

  playFanfare: () => {
    if (!soundManager.isEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const melody = [
        { f: 587.33, d: 0.1 }, // D5
        { f: 739.99, d: 0.1 }, // F#5
        { f: 880.00, d: 0.12 }, // A5
        { f: 1174.66, d: 0.35 } // D6
      ];

      let t = ctx.currentTime;
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + note.d);

        t += note.d * 0.8;
      });
    } catch {
      // Audio playback safety catch
    }
  }
};
