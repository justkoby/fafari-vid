import React from 'react';
import {Img, staticFile} from 'remotion';
import {ASSETS, C, COPY, CONTACT, T} from '../brand';
import {DISPLAY, SANS} from '../fonts';
import {GroundShadow, Logo, RevealText} from '../components/Bits';
import {easeInOut, easeOut, lerp, prog} from '../motion';
import type {Layout, SetPlace} from '../layout';

const Platform: React.FC<{cx: number; y: number; w: number; g: number; at: number}> = ({cx, y, w, g, at}) => {
  const rise = prog(g, at, at + 18, easeOut);
  const h = Math.max(18, w * 0.052);
  const body = w * 0.085;
  return (
    <svg
      width={w + 60}
      height={body + h * 2 + 40}
      style={{position: 'absolute', left: cx - (w + 60) / 2, top: y - h - 10 + (1 - rise) * 120, opacity: rise, overflow: 'visible'}}
      viewBox={`0 0 ${w + 60} ${body + h * 2 + 40}`}
    >
      <defs>
        <linearGradient id={`pl${Math.round(cx)}`} x1="0" x2="1">
          <stop offset="0" stopColor="#5d0a15" />
          <stop offset="0.35" stopColor="#a5182a" />
          <stop offset="1" stopColor="#4a0812" />
        </linearGradient>
        <radialGradient id={`pt${Math.round(cx)}`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#e0364a" />
          <stop offset="1" stopColor="#9c1424" />
        </radialGradient>
      </defs>
      <ellipse cx={(w + 60) / 2} cy={h + 10 + body + 14} rx={w / 2 + 26} ry={h + 8} fill="#1c0206" opacity={0.5} />
      <path d={`M30,${h + 10} v${body} a${w / 2},${h} 0 0 0 ${w},0 v${-body}`} fill={`url(#pl${Math.round(cx)})`} />
      <path d={`M30,${h + 10 + body} a${w / 2},${h} 0 0 0 ${w},0`} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.9} />
      <ellipse cx={(w + 60) / 2} cy={h + 10} rx={w / 2} ry={h} fill={`url(#pt${Math.round(cx)})`} />
      <ellipse cx={(w + 60) / 2} cy={h + 10} rx={w / 2} ry={h} fill="none" stroke={C.goldLight} strokeWidth={2.5} opacity={0.8} />
    </svg>
  );
};

const GiftSet: React.FC<{src: string; iw: number; ih: number; place: SetPlace; yOff: number; opacity: number}> = ({src, iw, ih, place, yOff, opacity}) => {
  const h = (place.w * ih) / iw;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        left: place.cx - place.w / 2,
        top: place.top + yOff,
        width: place.w,
        height: h,
        opacity,
        filter: 'drop-shadow(0 18px 22px rgba(15,0,5,0.45))',
      }}
    />
  );
};

const Contact: React.FC<{L: Layout; g: number}> = ({L, g}) => {
  const s = L.card.phone / 60;
  const inP = prog(g, 614, 630, easeOut);
  const p = L.card.panel;
  return (
    <div
      style={{
        position: 'absolute',
        left: 90 - (L.W === 1080 && s > 0.95 ? 0 : 0),
        width: 900,
        top: p.y,
        height: p.h,
        opacity: inP,
        transform: `translateY(${(1 - inP) * 30}px)`,
        borderRadius: 30,
        border: `1.5px solid rgba(243,212,137,0.55)`,
        background: 'linear-gradient(180deg, rgba(58,7,16,0.82), rgba(34,3,9,0.9))',
        boxShadow: '0 20px 60px rgba(10,0,3,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        padding: `${22 * s}px ${40 * s}px`,
        boxSizing: 'border-box',
        fontFamily: SANS,
        color: C.ivory,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div>
        <div style={{fontSize: 24 * s, letterSpacing: 6 * s, fontWeight: 600, color: C.gold, textTransform: 'uppercase', marginBottom: 6 * s}}>Call / WhatsApp</div>
        {CONTACT.phones.map((ph) => (
          <div key={ph} style={{fontSize: L.card.phone, fontWeight: 700, lineHeight: 1.18, letterSpacing: 1, fontVariantNumeric: 'tabular-nums'}}>
            {ph}
          </div>
        ))}
      </div>
      <div style={{height: 1.5, margin: `${14 * s}px 0`, background: 'linear-gradient(90deg, rgba(243,212,137,0.6), rgba(243,212,137,0.05))'}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 * s}}>
        <div>
          <div style={{fontSize: 20 * s, letterSpacing: 5 * s, fontWeight: 600, color: C.gold, textTransform: 'uppercase', marginBottom: 6 * s}}>Instagram</div>
          <div style={{fontSize: 36 * s, fontWeight: 600}}>{CONTACT.instagram}</div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 20 * s, letterSpacing: 5 * s, fontWeight: 600, color: C.gold, textTransform: 'uppercase', marginBottom: 6 * s}}>Location</div>
          {CONTACT.location.map((ln) => (
            <div key={ln} style={{fontSize: 25 * s, lineHeight: 1.32, fontWeight: 500, color: 'rgba(246,236,217,0.94)'}}>
              {ln}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Scene 5 + 6: both sets settle onto staggered platforms, words appear, then the same elements resolve into the order card. */
export const FinalScene: React.FC<{L: Layout; g: number}> = ({L, g}) => {
  const t = prog(g, 596, 626, easeInOut);
  const place = (a: SetPlace, b: SetPlace): SetPlace => ({cx: lerp(a.cx, b.cx, t), top: lerp(a.top, b.top, t), w: lerp(a.w, b.w, t)});
  const wp = place(L.coll.wellness, L.card.wellness);
  const tp = place(L.coll.travel, L.card.travel);
  const drop = (at: number) => {
    const p = prog(g, at, at + 26, easeOut);
    return {y: (1 - p) * -1100, o: 1};
  };
  const dw = drop(484);
  const dt = drop(496);
  const hw = (wp.w * ASSETS.wellness.h) / ASSETS.wellness.w;
  const ht = (tp.w * ASSETS.travel.h) / ASSETS.travel.w;
  const logoP = prog(g, 600, 618, easeOut);
  const wordSize = L.words.size;
  const cardIn = (a: number) => prog(g, a, a + 15, easeOut);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Platform cx={wp.cx} y={wp.top + hw - 12} w={wp.w * 1.04} g={g} at={480} />
      <Platform cx={tp.cx} y={tp.top + ht - 12} w={tp.w * 1.04} g={g} at={490} />
      <GroundShadow cx={wp.cx} cy={wp.top + hw - 4} w={wp.w * 0.95} opacity={0.5 * dw.o * (1 - Math.min(1, Math.abs(dw.y) / 300))} />
      <GiftSet src={ASSETS.wellness.src} iw={ASSETS.wellness.w} ih={ASSETS.wellness.h} place={wp} yOff={dw.y} opacity={dw.o} />
      <GiftSet src={ASSETS.travel.src} iw={ASSETS.travel.w} ih={ASSETS.travel.h} place={tp} yOff={dt.y} opacity={dt.o} />

      {/* words */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: L.W,
          top: L.words.leadY - 30,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: 9,
          textTransform: 'uppercase',
          color: C.goldLight,
          opacity: prog(g, T.words[0] - 10, T.words[0] + 6) * (1 - prog(g, 592, 602)),
        }}
      >
        {COPY.lead}
      </div>
      {COPY.words.map((w, i) => (
        <RevealText
          key={w}
          g={g}
          lines={[w]}
          cx={540}
          cy={L.words.wordY}
          size={wordSize}
          start={T.words[i]}
          end={i < 3 ? T.words[i + 1] - 12 : 592}
          accent={0}
          stagger={0}
        />
      ))}

      {/* order card */}
      <div style={{position: 'absolute', left: 0, width: L.W, top: L.card.logo.cy - L.card.logo.w * 0.2, display: 'flex', justifyContent: 'center', opacity: logoP, transform: `scale(${0.92 + 0.08 * logoP})`}}>
        <Logo w={L.card.logo.w} />
      </div>
      <RevealText g={g} lines={['Make their Christmas', 'unforgettable.']} cx={540} cy={L.card.headline.y + (L.H > 1500 ? 0 : 0)} size={L.card.headline.size} start={606} end={9999} accent={1} stagger={6} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: L.W,
          top: L.card.cta.y - L.card.cta.size * 0.8,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: L.card.cta.size,
          letterSpacing: 0.5,
          color: C.ivory,
          opacity: cardIn(612),
          transform: `translateY(${(1 - cardIn(612)) * 24}px)`,
        }}
      >
        {COPY.cta}
      </div>
      <Contact L={L} g={g} />
    </div>
  );
};
void DISPLAY;
