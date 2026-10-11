import React from 'react';
import {Img, staticFile} from 'remotion';
import {C} from '../brand';
import {DISPLAY, SANS} from '../fonts';
import {clamp, easeOut, prog, rng} from '../motion';
import type {Layout} from '../layout';

export const Logo: React.FC<{w: number; reverse?: boolean; style?: React.CSSProperties}> = ({w, reverse = true, style}) => (
  <Img src={staticFile(reverse ? 'assets/logo-reverse.svg' : 'assets/logo.svg')} style={{width: w, height: 'auto', display: 'block', ...style}} />
);

/** Headline lines rising out of a mask, with a quick intentional exit. Frame values are global. */
export const RevealText: React.FC<{
  g: number;
  lines: string[];
  cx: number;
  cy: number;
  size: number;
  start: number;
  end: number;
  accent?: number;
  italicLast?: boolean;
  color?: string;
  stagger?: number;
}> = ({g, lines, cx, cy, size, start, end, accent, color = C.ivory, stagger = 5}) => {
  if (g < start - 1 || g > end + 14) return null;
  const lh = size * 1.02;
  const total = lines.length * lh;
  return (
    <div style={{position: 'absolute', left: cx - 540, width: 1080, top: cy - total / 2, textAlign: 'center'}}>
      {lines.map((ln, i) => {
        const inP = prog(g, start + i * stagger, start + i * stagger + 18, easeOut);
        const outP = prog(g, end + i * 2, end + 11 + i * 2);
        const isAccent = accent === i;
        return (
          <div key={i} style={{height: lh, overflow: 'hidden', position: 'relative'}}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontStyle: isAccent ? 'italic' : 'normal',
                fontSize: size,
                lineHeight: `${lh}px`,
                letterSpacing: -0.5,
                color: isAccent ? C.goldLight : color,
                transform: `translateY(${(1 - inP) * 110 - outP * 110}%)`,
                opacity: 1 - outP * 0.4,
                textShadow: '0 4px 30px rgba(40,0,8,0.55)',
                whiteSpace: 'nowrap',
              }}
            >
              {ln}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Christmas string lights across the top; they switch on in sequence at `on`. */
export const Lights: React.FC<{L: Layout; g: number; on: number; opacity?: number}> = ({L, g, on, opacity = 1}) => {
  if (g < on - 40) return null;
  const swags = 3;
  const W = L.W;
  const r = rng(5);
  const colors = ['#ffd27a', '#fff1c4', '#ff8a6b', '#ffd27a', '#f6c453'];
  const bulbs: {x: number; y: number; c: string; i: number}[] = [];
  const paths: string[] = [];
  const y0 = L.lights.y;
  const sag = L.lights.sag;
  const wireY = (x: number) => {
    const seg = W / swags;
    const k = (x % seg) / seg;
    const idx = Math.floor(x / seg);
    return y0 + 4 * sag * k * (1 - k) + (idx % 2) * 10 - 20 * Math.sin(x / W * 3);
  };
  for (let s = 0; s < swags; s++) {
    const xa = (W / swags) * s - 10;
    const xb = (W / swags) * (s + 1) + 10;
    const ya = y0 + (s % 2) * 10 - 10;
    const yb = y0 + ((s + 1) % 2) * 10 - 10;
    paths.push(`M${xa},${ya} Q${(xa + xb) / 2},${y0 + sag * 2} ${xb},${yb}`);
  }
  void wireY;
  let bi = 0;
  paths.forEach((_, s) => {
    const xa = (W / swags) * s - 10;
    const xb = (W / swags) * (s + 1) + 10;
    const ya = y0 + (s % 2) * 10 - 10;
    const yb = y0 + ((s + 1) % 2) * 10 - 10;
    const n = 6;
    for (let k = 0; k <= n; k++) {
      if (s > 0 && k === 0) continue;
      const t = k / n;
      const x = (1 - t) * (1 - t) * xa + 2 * (1 - t) * t * ((xa + xb) / 2) + t * t * xb;
      const y = (1 - t) * (1 - t) * ya + 2 * (1 - t) * t * (y0 + sag * 2) + t * t * yb;
      bulbs.push({x, y, c: colors[Math.floor(r() * colors.length)], i: bi++});
    }
  });
  const slideIn = prog(g, on - 40, on - 14, easeOut);
  return (
    <svg width={W} height={L.H} style={{position: 'absolute', inset: 0, opacity, transform: `translateY(${(1 - slideIn) * -80}px)`}}>
      <defs>
        {colors.map((c, i) => (
          <radialGradient id={`bg${i}`} key={i}>
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.25" stopColor={c} stopOpacity="1" />
            <stop offset="1" stopColor={c} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#1d0507" strokeWidth={3.5} opacity={0.9} />
      ))}
      {bulbs.map((b) => {
        const t0 = on + b.i * 1.6;
        const lit = prog(g, t0, t0 + 8, easeOut);
        const flick = lit > 0.99 ? 0.88 + 0.12 * Math.sin(g * 0.12 + b.i * 1.7) : lit;
        const ci = colors.indexOf(b.c);
        return (
          <g key={b.i} transform={`translate(${b.x},${b.y})`}>
            <rect x={-4} y={-2} width={8} height={10} rx={2} fill="#2a0a0c" />
            <ellipse cx={0} cy={15} rx={8} ry={11} fill={lit > 0.05 ? b.c : '#5a3a2e'} opacity={0.35 + 0.65 * lit} />
            <circle cx={0} cy={15} r={46} fill={`url(#bg${ci})`} opacity={0.62 * flick * lit} />
          </g>
        );
      })}
    </svg>
  );
};

/** Soft grounded shadow under objects. */
export const GroundShadow: React.FC<{cx: number; cy: number; w: number; h?: number; opacity?: number}> = ({cx, cy, w, h = w * 0.11, opacity = 0.55}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - w / 2,
      top: cy - h / 2,
      width: w,
      height: h,
      borderRadius: '50%',
      background: `radial-gradient(ellipse at center, rgba(12,0,3,${opacity}) 0%, rgba(12,0,3,${opacity * 0.5}) 45%, rgba(12,0,3,0) 72%)`,
    }}
  />
);
void clamp;
