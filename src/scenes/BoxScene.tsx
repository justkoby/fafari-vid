import React from 'react';
import {T} from '../brand';
import {Box, boxMetrics} from '../components/Box';
import {GroundShadow, RevealText} from '../components/Bits';
import {SpiralRibbon} from '../components/Transitions';
import {prog, lerp, easeOut} from '../motion';
import type {Layout} from '../layout';

/** Frame-driven drop: fall, squash on impact, one small bounce, settle. Returns y offset (px above rest) and squash. */
export const dropState = (g: number, dropH: number) => {
  const I = T.impact; // impact frame
  if (g < I) {
    const t = Math.max(0, g / I);
    return {lift: dropH * (1 - t * t), sx: 1 - 0.02 * t, sy: 1 + 0.04 * t};
  }
  const sq1 = prog(g, I, I + 4, easeOut) - prog(g, I + 4, I + 9, easeOut); // compress then release
  const bt = (g - (I + 4)) / 15;
  const bounce = bt > 0 && bt < 1 ? 38 * 4 * bt * (1 - bt) : 0;
  const sq2 = prog(g, I + 19, I + 22) - prog(g, I + 22, I + 27);
  const sq = sq1 * 0.11 + sq2 * 0.035;
  return {lift: bounce, sx: 1 + sq * 0.7, sy: 1 - sq};
};

export const boxGeom = (L: Layout) => {
  const m = boxMetrics(L.box.size);
  const left = L.box.cx - m.centreX;
  const top = L.box.floor - m.frontBottomY;
  const midY = L.box.floor - L.box.size * 0.36;
  return {m, left, top, midY};
};

/** Scene 1 + 2: the plain box drops, a ribbon wraps it, then the ribbon sweeps away. */
export const BoxScene: React.FC<{L: Layout; g: number}> = ({L, g}) => {
  const {m, left, top, midY} = boxGeom(L);
  const d = dropState(g, L.box.floor + 300);
  const exit = prog(g, 148, 160);
  const shadowW = L.box.size * lerp(1.25, 1.0, Math.min(1, d.lift / 300 + 0.0));
  const shOp = 0.6 * (1 - Math.min(1, d.lift / 260));
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <GroundShadow cx={L.box.cx + 10} cy={L.box.floor - L.box.size * 0.03} w={shadowW * 1.15} h={L.box.size * 0.26} opacity={shOp} />
      <SpiralRibbon L={L} g={g} boxMidY={midY} part="back" />
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: m.vw,
          height: m.vh,
          transformOrigin: `${m.centreX}px ${m.frontBottomY - L.box.size * 0.1}px`,
          transform: `translateY(${-d.lift}px) scale(${d.sx}, ${d.sy}) translateY(${exit * 20}px)`,
          opacity: 1 - exit * 0.0,
        }}
      >
        <Box size={L.box.size} />
      </div>
      <SpiralRibbon L={L} g={g} boxMidY={midY} part="front" />
      <RevealText g={g} lines={['Another', 'ordinary gift?']} cx={540} cy={L.title.cy} size={L.title.size} start={32} end={84} accent={1} />
      <RevealText g={g} lines={['Not this', 'Christmas.']} cx={540} cy={L.title.cy} size={L.title.size} start={104} end={138} accent={1} />
    </div>
  );
};
