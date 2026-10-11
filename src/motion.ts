import {Easing, interpolate} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const smooth = Easing.bezier(0.45, 0, 0.15, 1);

/** 0→1 progress between two frames with an easing. */
export const prog = (f: number, a: number, b: number, e: (t: number) => number = easeInOut) =>
  e(interpolate(f, [a, b], [0, 1], clamp));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic PRNG (mulberry32). */
export const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
