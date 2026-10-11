import React from 'react';

/** A ribbon sample: centre point, half-width vector, and facing value s in [-1,1] (sign = front/back face). */
export type RP = {x: number; y: number; hx: number; hy: number; s: number};

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const FRONT_D = [150, 98, 16];
const FRONT_L = [250, 222, 140];
const BACK_D = [112, 70, 10];
const BACK_L = [205, 148, 42];

const shade = (s: number, tone: number) => {
  const k = Math.pow(Math.abs(s), 0.7) * 0.55 + tone * 0.45;
  const c = s >= 0 ? mix(FRONT_D, FRONT_L, k) : mix(BACK_D, BACK_L, k);
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/**
 * Renders ribbon samples as shaded quads (satin gold), with a specular streak and darker edges.
 * `order` lets callers paint only a range of the samples.
 */
const LANES = [-1, -0.62, -0.25, 0.25, 0.62, 1];
const PROFILE = [0.62, 0.84, 1.0, 1.0, 0.84, 0.62]; // lane brightness (satin: bright centre, darker edges)

/**
 * Renders ribbon samples as satin gold: lanes across the width give a rounded, curved look; sign of s picks
 * the front/back face; a specular streak and darker edges finish it.
 */
export const RibbonStrip: React.FC<{pts: RP[]; edge?: number}> = ({pts, edge = 1.6}) => {
  const quads: React.ReactNode[] = [];
  const spec: React.ReactNode[] = [];
  const P = (p: RP, f: number) => `${p.x + p.hx * f},${p.y + p.hy * f}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const tone = 0.5 + 0.5 * Math.sin(i * 0.11);
    const s = (a.s + b.s) / 2;
    for (let l = 0; l < LANES.length - 1; l++) {
      const f0 = LANES[l];
      const f1 = LANES[l + 1];
      const prof = (PROFILE[l] + PROFILE[l + 1]) / 2;
      const col = shade(s, tone * prof * 0.9 + (prof - 0.6) * 0.35);
      quads.push(
        <path key={`${i}-${l}`} d={`M${P(a, f0)} L${P(b, f0)} L${P(b, f1)} L${P(a, f1)}Z`} fill={col} stroke={col} strokeWidth={0.8} strokeLinejoin="round" />,
      );
    }
    const sp = Math.pow(Math.max(0, s), 4) * 0.7;
    if (sp > 0.03) {
      spec.push(<path key={i} d={`M${P(a, -0.14)} L${P(b, -0.14)} L${P(b, 0.3)} L${P(a, 0.3)}Z`} fill="#fff6cf" opacity={sp} />);
    }
  }
  const left = pts.map((p) => P(p, -1)).join(' ');
  const right = pts.map((p) => P(p, 1)).join(' ');
  return (
    <g>
      {quads}
      {spec}
      <polyline points={left} fill="none" stroke="#6b4208" strokeOpacity={0.6} strokeWidth={edge} strokeLinejoin="round" />
      <polyline points={right} fill="none" stroke="#6b4208" strokeOpacity={0.6} strokeWidth={edge} strokeLinejoin="round" />
    </g>
  );
};

/** Ribbon running top→bottom along a curve; width runs horizontally and twists. */
export const verticalRibbon = (
  H: number,
  xAt: (y: number) => number,
  hw: number,
  twAt: (y: number) => number,
  n = 56,
  pad = 120,
): RP[] =>
  Array.from({length: n + 1}, (_, i) => {
    const y = -pad + ((H + pad * 2) * i) / n;
    const tw = twAt(y);
    const c = Math.cos(tw);
    const k = 0.5 + 0.5 * Math.abs(c);
    return {x: xAt(y), y, hx: hw * k, hy: 0, s: c};
  });
