import React from 'react';

/** Plain, unbranded gift box (cream card stock) drawn as a lit 3/4 cube with a lid. Origin: bottom-centre. */
export const Box: React.FC<{size: number}> = ({size}) => {
  const w = size / 2; // half width of the iso diamond
  const d = size * 0.245; // half depth
  const h = size * 0.5; // body height
  const lidH = size * 0.17;
  const o = size * 0.022; // lid overhang
  const W2 = w + o;
  const D2 = d + o * 0.5;
  const vw = size + 80;
  const vh = h + lidH + d * 2 + 80;
  const bx = vw / 2;
  const by = vh - 40 - d; // y of bottom-front corner baseline (diamond centre of the bottom face)
  // bottom diamond centre = (bx, by); bottom front corner = (bx, by + d)
  const top = by - h;
  const pt = (x: number, y: number) => `${x},${y}`;
  const body = {
    left: [pt(bx - w, by), pt(bx, by + d), pt(bx, top + d), pt(bx - w, top)].join(' '),
    right: [pt(bx + w, by), pt(bx, by + d), pt(bx, top + d), pt(bx + w, top)].join(' '),
  };
  const lt = top - lidH; // lid top diamond centre y
  const lid = {
    left: [pt(bx - W2, top), pt(bx, top + D2 * 1.0 + 0), pt(bx, top + D2 + lidH * 0), pt(bx - W2, top)].join(' '),
  };
  void lid;
  const lidBottomY = top + o * 0.2;
  const lidFrontLeft = [pt(bx - W2, lidBottomY), pt(bx, lidBottomY + D2), pt(bx, lt + D2), pt(bx - W2, lt)].join(' ');
  const lidFrontRight = [pt(bx + W2, lidBottomY), pt(bx, lidBottomY + D2), pt(bx, lt + D2), pt(bx + W2, lt)].join(' ');
  const lidTop = [pt(bx, lt - D2), pt(bx + W2, lt), pt(bx, lt + D2), pt(bx - W2, lt)].join(' ');
  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="bxL" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#d9cbb2" />
          <stop offset="1" stopColor="#c2b296" />
        </linearGradient>
        <linearGradient id="bxR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a8987c" />
          <stop offset="1" stopColor="#8b7c62" />
        </linearGradient>
        <linearGradient id="bxT" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf4e6" />
          <stop offset="1" stopColor="#e6d9c0" />
        </linearGradient>
        <linearGradient id="lidL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e4d8c1" />
          <stop offset="1" stopColor="#cdbea3" />
        </linearGradient>
        <linearGradient id="lidR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b3a387" />
          <stop offset="1" stopColor="#968669" />
        </linearGradient>
        <linearGradient id="lidShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.32" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={body.left} fill="url(#bxL)" />
      <polygon points={body.right} fill="url(#bxR)" />
      {/* shadow cast by lid onto body */}
      <polygon points={[pt(bx - w, top), pt(bx, top + d), pt(bx, top + d + size * 0.07), pt(bx - w, top + size * 0.07)].join(' ')} fill="url(#lidShadow)" />
      <polygon points={[pt(bx + w, top), pt(bx, top + d), pt(bx, top + d + size * 0.07), pt(bx + w, top + size * 0.07)].join(' ')} fill="url(#lidShadow)" />
      <polygon points={lidFrontLeft} fill="url(#lidL)" />
      <polygon points={lidFrontRight} fill="url(#lidR)" />
      <polygon points={lidTop} fill="url(#bxT)" />
      {/* crisp edges */}
      <polyline points={`${bx - W2},${lt} ${bx},${lt + D2} ${bx + W2},${lt}`} fill="none" stroke="#fffaf0" strokeOpacity={0.8} strokeWidth={2} />
      <line x1={bx} y1={lt + D2} x2={bx} y2={lidBottomY + D2} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />
      <line x1={bx} y1={top + d + size * 0.07} x2={bx} y2={by + d} stroke="#fff" strokeOpacity={0.22} strokeWidth={1.5} />
    </svg>
  );
};

/** Pixel offset of the box's bottom-front corner inside its SVG, and SVG size, for positioning. */
export const boxMetrics = (size: number) => {
  const d = size * 0.245;
  const h = size * 0.5;
  const lidH = size * 0.17;
  const vw = size + 80;
  const vh = h + lidH + d * 2 + 80;
  return {vw, vh, frontBottomY: vh - 40, centreX: vw / 2, bodyTop: vh - 40 - d - h - lidH - d * 1.0};
};
