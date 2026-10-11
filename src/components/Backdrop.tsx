import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {rng} from '../motion';
import type {Layout} from '../layout';

/** Deterministic gold dust, drifting slowly. Sits behind all content. */
const Particles: React.FC<{L: Layout}> = ({L}) => {
  const f = useCurrentFrame();
  const r = rng(77);
  const items = Array.from({length: 38}, () => ({
    x: r() * L.W,
    y0: r() * L.H,
    s: 1.2 + r() * 3.2,
    sp: 0.15 + r() * 0.35,
    ph: r() * 6.28,
    a: 0.18 + r() * 0.35,
  }));
  return (
    <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
      {items.map((p, i) => {
        const y = (((p.y0 - f * p.sp * 1.6) % L.H) + L.H) % L.H;
        const x = p.x + Math.sin(f * 0.02 + p.ph) * 14;
        const tw = 0.55 + 0.45 * Math.sin(f * 0.07 + p.ph * 3);
        return <circle key={i} cx={x} cy={y} r={p.s} fill={C.goldLight} opacity={p.a * tw} />;
      })}
    </svg>
  );
};

/** Red studio: wall, floor, spotlight, vignette. */
export const Backdrop: React.FC<{L: Layout}> = ({L}) => {
  const hz = L.horizon;
  return (
    <AbsoluteFill style={{background: C.burgundy}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 60% at 50% ${(hz / L.H) * 70}%, #c4202c 0%, #8e1220 38%, #4a0913 72%, #2a040a 100%)`,
        }}
      />
      {/* floor */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: hz,
          bottom: 0,
          background: `linear-gradient(180deg, #7c0f1c 0%, #5c0b16 40%, #36060d 100%)`,
          boxShadow: 'inset 0 18px 40px -10px rgba(255,120,100,0.28)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: hz - 1,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(243,212,137,0.35), transparent)',
        }}
      />
      {/* floor pool of light */}
      <div
        style={{
          position: 'absolute',
          left: L.W * 0.5 - 600,
          top: hz + 20,
          width: 1200,
          height: 420,
          background: 'radial-gradient(ellipse at center, rgba(255,110,90,0.38), rgba(255,110,90,0) 68%)',
        }}
      />
      <Particles L={L} />
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 120% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(20,0,4,0.62) 100%)'}}
      />
    </AbsoluteFill>
  );
};
