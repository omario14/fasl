import { isNative, nativeVibrate } from './native';
import type { PrayerId, SoundMode, VoiceId } from './types';

let ctx: AudioContext | null = null;
function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** A soft, bell-like chime synthesised on device: three partials, slow decay. */
export function chime(volume = 0.7, soft = false) {
  try {
    const a = ac();
    const t0 = a.currentTime + 0.02;
    const master = a.createGain();
    master.gain.value = Math.max(0, Math.min(1, volume)) * (soft ? 0.35 : 0.55);
    master.connect(a.destination);
    const notes = soft ? [659.25, 987.77] : [523.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      for (const [mult, amp] of [
        [1, 1],
        [2.76, 0.18],
        [5.4, 0.06],
      ] as const) {
        const o = a.createOscillator();
        const g = a.createGain();
        o.type = 'sine';
        o.frequency.value = f * mult;
        const start = t0 + i * 0.42;
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(amp, start + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 2.6);
        o.connect(g).connect(master);
        o.start(start);
        o.stop(start + 2.8);
      }
    });
  } catch {
    /* audio blocked until the user interacts with the page */
  }
}

let current: HTMLAudioElement | null = null;
let rampTimer: number | undefined;

export function stopAudio() {
  current?.pause();
  current = null;
  clearInterval(rampTimer);
}

/**
 * Plays a muezzin recording from /audio/<voice>-<adhan|adhan-fajr|iqama>.mp3.
 * Recordings are supplied by the publisher; when a file is missing the chime plays instead.
 * Resolves false when it fell back.
 */
export function playAdhan(opts: {
  voice: VoiceId;
  mode: SoundMode;
  prayer: PrayerId;
  volume: number;
  ramp: boolean;
  fajrVariant: boolean;
}): Promise<boolean> {
  stopAudio();
  if (opts.mode === 'off') return Promise.resolve(true);
  if (opts.mode === 'chime') {
    chime(opts.volume);
    return Promise.resolve(true);
  }
  const file =
    opts.mode === 'iqama' ? 'iqama' : opts.prayer === 'fajr' && opts.fajrVariant ? 'adhan-fajr' : 'adhan';
  const el = new Audio(`./audio/${opts.voice}-${file}.mp3`);
  current = el;
  const target = Math.max(0, Math.min(1, opts.volume));
  el.volume = opts.ramp ? target * 0.2 : target;
  return el
    .play()
    .then(() => {
      if (opts.ramp) {
        const t0 = performance.now();
        rampTimer = window.setInterval(() => {
          const k = Math.min(1, (performance.now() - t0) / 30000);
          el.volume = target * (0.2 + 0.8 * k);
          if (k >= 1) clearInterval(rampTimer);
        }, 250);
      }
      return true;
    })
    .catch(() => {
      chime(opts.volume);
      return false;
    });
}

export function vibrate(pattern: number | number[]) {
  if (isNative) {
    // Android WebView ignores navigator.vibrate; use the native vibrator.
    const ms = Array.isArray(pattern) ? pattern.filter((_, k) => k % 2 === 1).reduce((a, b) => a + b, 0) : pattern;
    nativeVibrate(ms);
    return;
  }
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not supported */
  }
}
