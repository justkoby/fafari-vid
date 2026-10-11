import React from 'react';
import {ASSETS, T} from '../brand';
import {Cam, camAt, DetailTag, ProductCam} from '../components/Product';
import {RevealText} from '../components/Bits';
import {easeOut, prog} from '../motion';
import type {Layout} from '../layout';

const WELLNESS_KEYS: Cam[] = [
  {f: 160, fx: 0.5, fy: 0.5, z: 1},
  {f: 196, fx: 0.5, fy: 0.5, z: 1},
  {f: 222, fx: 0.3, fy: 0.58, z: 2.0},
  {f: 246, fx: 0.33, fy: 0.58, z: 2.05},
  {f: 270, fx: 0.72, fy: 0.5, z: 1.95},
  {f: 292, fx: 0.76, fy: 0.74, z: 2.0},
  {f: 316, fx: 0.5, fy: 0.5, z: 1},
  {f: 400, fx: 0.5, fy: 0.5, z: 1},
];

const TRAVEL_KEYS: Cam[] = [
  {f: 330, fx: 0.5, fy: 0.5, z: 1},
  {f: 366, fx: 0.5, fy: 0.5, z: 1},
  {f: 390, fx: 0.55, fy: 0.46, z: 1.95},
  {f: 412, fx: 0.6, fy: 0.62, z: 1.95},
  {f: 428, fx: 0.2, fy: 0.62, z: 2.1},
  {f: 446, fx: 0.24, fy: 0.64, z: 2.1},
  {f: 466, fx: 0.5, fy: 0.5, z: 1},
  {f: 520, fx: 0.5, fy: 0.5, z: 1},
];

export const WellnessScene: React.FC<{L: Layout; g: number}> = ({L, g}) => {
  const cam = camAt(g, WELLNESS_KEYS);
  const settle = prog(g, 160, 196, easeOut);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <ProductCam L={L} src={ASSETS.wellness.src} iw={ASSETS.wellness.w} ih={ASSETS.wellness.h} cam={cam} entrance={settle} />
      <RevealText g={g} lines={['For their', 'well-deserved', 'downtime.']} cx={540} cy={L.title.cy + 20} size={L.title.size * 0.82} start={170} end={302} accent={2} />
      <DetailTag L={L} g={g} text="Wine & glass" a={226} b={254} />
      <DetailTag L={L} g={g} text="Towels, lotions & candles" a={274} b={300} />
    </div>
  );
};

export const TravelScene: React.FC<{L: Layout; g: number}> = ({L, g}) => {
  const cam = camAt(g, TRAVEL_KEYS);
  const settle = prog(g, 328, 364, easeOut);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <ProductCam L={L} src={ASSETS.travel.src} iw={ASSETS.travel.w} ih={ASSETS.travel.h} cam={cam} entrance={settle} />
      <RevealText g={g} lines={['For their', 'next big', 'adventure.']} cx={540} cy={L.title.cy + 20} size={L.title.size * 0.82} start={338} end={458} accent={2} />
      <DetailTag L={L} g={g} text="Flask, organisers & tech" a={394} b={416} />
      <DetailTag L={L} g={g} text="Folio, power bank & keepsake" a={430} b={452} />
    </div>
  );
};
void T;
