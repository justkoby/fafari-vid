import React from 'react';
import {Img, staticFile} from 'remotion';
import {C} from '../brand';
import {SANS} from '../fonts';
import {easeInOut, lerp, prog} from '../motion';
import type {Layout} from '../layout';

export type Cam = {f: number; fx: number; fy: number; z: number};

/** Piecewise camera path: eased moves between keyframes. */
export const camAt = (g: number, keys: Cam[]): Omit<Cam, 'f'> => {
  if (g <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (g <= b.f) {
      const t = prog(g, a.f, b.f, easeInOut);
      return {fx: lerp(a.fx, b.fx, t), fy: lerp(a.fy, b.fy, t), z: lerp(a.z, b.z, t)};
    }
  }
  return keys[keys.length - 1];
};

/**
 * A gift-set photo in a camera viewport. The PNG stays intact; close-ups are camera transforms.
 * The viewport fades softly at top/bottom so crops feel like a lens, not a box.
 */
export const ProductCam: React.FC<{
  L: Layout;
  src: string;
  iw: number;
  ih: number;
  cam: Omit<Cam, 'f'>;
  entrance?: number; // 0..1 settle
  glow?: boolean;
}> = ({L, src, iw, ih, cam, entrance = 1, glow = true}) => {
  const {vy0, vy1, cy, w} = L.prod;
  const baseW = w;
  const imgW = baseW * cam.z * (0.96 + 0.04 * entrance);
  const imgH = (imgW * ih) / iw;
  const left = 540 - cam.fx * imgW;
  const top = cy - cam.fy * imgH;
  const fullH = (baseW * ih) / iw;
  const shadowY = top + imgH * 0.985;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: L.W,
        top: vy0,
        height: vy1 - vy0,
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 9%, #000 91%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, transparent 0, #000 9%, #000 91%, transparent 100%)',
      }}
    >
      <div style={{position: 'absolute', left: 0, top: -vy0, width: L.W, height: L.H}}>
        {glow && (
          <div
            style={{
              position: 'absolute',
              left: 540 - cam.fx * imgW + imgW * 0.5 - imgW * 0.62,
              top: top + imgH * 0.55 - imgH * 0.6,
              width: imgW * 1.24,
              height: imgH * 1.2,
              background: 'radial-gradient(ellipse at center, rgba(255,150,120,0.28), rgba(255,150,120,0) 62%)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            left: left + imgW * 0.04,
            top: shadowY - imgH * 0.05,
            width: imgW * 0.92,
            height: imgH * 0.1,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(10,0,3,0.6), rgba(10,0,3,0) 70%)',
          }}
        />
        <Img
          src={staticFile(src)}
          style={{position: 'absolute', left, top, width: imgW, height: imgH, filter: 'drop-shadow(0 22px 28px rgba(15,0,5,0.45))'}}
        />
      </div>
    </div>
  );
};

/** Small gold lens caption under the viewport for close-ups. */
export const DetailTag: React.FC<{L: Layout; text: string; g: number; a: number; b: number}> = ({L, text, g, a, b}) => {
  const inP = prog(g, a, a + 12);
  const outP = prog(g, b, b + 10);
  const o = inP * (1 - outP);
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: L.W,
        top: L.prod.label,
        textAlign: 'center',
        opacity: o,
        transform: `translateY(${(1 - inP) * 14 + outP * -8}px)`,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: 7,
        textTransform: 'uppercase',
        color: C.goldLight,
        textShadow: '0 2px 16px rgba(30,0,6,0.8)',
      }}
    >
      <span style={{display: 'inline-block', width: 54, height: 2, background: C.gold, verticalAlign: 'middle', marginRight: 22}} />
      {text}
      <span style={{display: 'inline-block', width: 54, height: 2, background: C.gold, verticalAlign: 'middle', marginLeft: 22}} />
    </div>
  );
};
