import React from 'react';
import {T} from '../brand';
import {clamp, easeInOut, lerp, prog} from '../motion';
import {RibbonStrip, RP, verticalRibbon} from './Ribbon';
import type {Layout} from '../layout';

/* ---------- boundary sweeps: a broad ribbon crossing the frame; the incoming scene is revealed behind it ---------- */

export type SweepSpec = {range: [number, number]; dir: 1 | -1; phase: number};
export const SWEEPS: Record<'s1' | 's2' | 's3', SweepSpec> = {
  s1: {range: T.sweep1 as [number, number], dir: 1, phase: 1.3},
  s2: {range: T.sweep2 as [number, number], dir: 1, phase: 0.6},
  s3: {range: T.sweep3 as [number, number], dir: -1, phase: 2.1},
};

const R = 820;
const tilt = 0.26;
export const boundaryX = (L: Layout, y: number, p: number, s: SweepSpec, lag = 0) => {
  const pp = Math.max(0, Math.min(1, p - lag));
  const base = s.dir > 0 ? lerp(-R, L.W + R, pp) : lerp(L.W + R, -R, pp);
  return base + s.dir * tilt * (y - L.H / 2) + 120 * Math.sin((y / L.H) * Math.PI * 1.5 + s.phase + pp * 3);
};

export const sweepProgress = (g: number, s: SweepSpec) => prog(g, s.range[0], s.range[1], easeInOut);

/** clip-path polygon covering the trailing side of the boundary (the revealed region). */
export const sweepClip = (L: Layout, g: number, s: SweepSpec) => {
  const p = sweepProgress(g, s);
  const pts: string[] = [];
  const edge = s.dir > 0 ? -50 : L.W + 50;
  pts.push(`${edge}px -50px`);
  for (let y = -50; y <= L.H + 50; y += 40) pts.push(`${boundaryX(L, y, p, s)}px ${y}px`);
  pts.push(`${edge}px ${L.H + 50}px`);
  return `polygon(${pts.join(',')})`;
};

export const RevealByRibbon: React.FC<{L: Layout; g: number; sweep: SweepSpec; children: React.ReactNode}> = ({L, g, sweep, children}) => {
  if (g < sweep.range[0]) return null;
  if (g >= sweep.range[1]) return <>{children}</>;
  return <div style={{position: 'absolute', inset: 0, clipPath: sweepClip(L, g, sweep)}}>{children}</div>;
};

const SweepRibbon: React.FC<{L: Layout; g: number; sweep: SweepSpec}> = ({L, g, sweep}) => {
  const [a, b] = sweep.range;
  if (g < a - 1 || g > b + 14) return null;
  const p = sweepProgress(g, sweep);
  const tw = (k: number) => (y: number) => (y / L.H) * 2.6 * Math.PI * 0.6 + p * 9 * sweep.dir + k;
  const main = verticalRibbon(L.H, (y) => boundaryX(L, y, p, sweep), 340, (y) => tw(0.2)(y) * 0.5, 150);
  const streamer = verticalRibbon(L.H, (y) => boundaryX(L, y, p, sweep, 0.1) - sweep.dir * 120, 95, tw(1.6), 120);
  const shadow = verticalRibbon(L.H, (y) => boundaryX(L, y, p, sweep) + sweep.dir * 30, 340, (y) => tw(0.2)(y) * 0.5, 40);
  return (
    <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id={`sh${sweep.phase}`} x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <g filter={`url(#sh${sweep.phase})`} opacity={0.5}>
        <polyline
          points={shadow.map((q) => `${q.x + sweep.dir * 90},${q.y}`).join(' ')}
          fill="none"
          stroke="#1a0004"
          strokeWidth={380}
        />
      </g>
      <RibbonStrip pts={streamer} />
      <RibbonStrip pts={main} />
    </svg>
  );
};

/* ---------- spiral: the ribbon wraps the box, then unwinds toward camera and sweeps the frame ---------- */

type Spiral = {head: number; tail: number};
export const spiralState = (g: number): Spiral => {
  const wrap = prog(g, 98, 140, easeInOut) * 1.55;
  const fly = prog(g, 140, 170, (t) => t * t) * 0.9;
  const tail = prog(g, 146, 176, (t) => t * t * (3 - 2 * t)) * 2.5;
  return {head: wrap + fly, tail};
};

const ss = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

export const spiralPoint = (L: Layout, u: number, boxMidY: number): RP & {front: boolean} => {
  const th = -0.35 + u * Math.PI * 2;
  const k = ss((u - 1.55) / 0.9);
  const rx = lerp(Math.min(340, L.box.size * 0.74), 900, k);
  const ry = lerp(L.box.size * 0.2, 320, k);
  const cx = lerp(L.box.cx, L.box.cx + 260, k);
  const cy = lerp(boxMidY - u * 34, boxMidY - 640, k);
  const wid = lerp(L.box.size * 0.25, L.box.size * 0.42, k);
  const sinT = Math.sin(th);
  const x = cx + rx * Math.cos(th);
  const y = cy + ry * sinT;
  const tilt = Math.cos(th) * 0.18 * wid * k;
  return {x, y, hx: tilt, hy: wid / 2, s: sinT, front: sinT >= 0};
};

export const SpiralRibbon: React.FC<{L: Layout; g: number; boxMidY: number; part: 'back' | 'front'}> = ({L, g, boxMidY, part}) => {
  if (g < 98 || g > T.sweep1[1] + 2) return null;
  const {head, tail} = spiralState(g);
  if (tail >= head) return null;
  const step = 0.012;
  const pts: (RP & {front: boolean})[] = [];
  for (let u = tail; u < head; u += step) pts.push(spiralPoint(L, u, boxMidY));
  pts.push(spiralPoint(L, head, boxMidY));
  // split into runs of the wanted depth
  const runs: RP[][] = [];
  let cur: RP[] = [];
  pts.forEach((p, i) => {
    const want = part === 'front' ? p.front : !p.front;
    if (want) cur.push(p);
    else if (cur.length) {
      runs.push(cur);
      cur = [];
    }
    if (i === pts.length - 1 && cur.length) runs.push(cur);
  });
  return (
    <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {runs
        .filter((r) => r.length > 1)
        .map((r, i) => (
          <RibbonStrip key={i} pts={r} />
        ))}
    </svg>
  );
};

export const TransitionOverlay: React.FC<{L: Layout; g: number}> = ({L, g}) => (
  <>
    <SweepRibbon L={L} g={g} sweep={SWEEPS.s1} />
    <SweepRibbon L={L} g={g} sweep={SWEEPS.s2} />
    <SweepRibbon L={L} g={g} sweep={SWEEPS.s3} />
  </>
);
