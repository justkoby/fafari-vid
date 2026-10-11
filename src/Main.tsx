import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Backdrop} from './components/Backdrop';
import {Lights, Logo} from './components/Bits';
import {RevealByRibbon, SWEEPS, TransitionOverlay} from './components/Transitions';
import {BoxScene} from './scenes/BoxScene';
import {TravelScene, WellnessScene} from './scenes/ProductScenes';
import {FinalScene} from './scenes/FinalScene';
import {FORMATS, Format, T} from './brand';
import {fontsReady} from './fonts';
import {LAYOUTS} from './layout';
import {prog} from './motion';
import {delayRender, continueRender} from 'remotion';

export const useFonts = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    fontsReady.then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

/** Every scene brings its own opaque studio so ribbon reveals fully replace the outgoing scene. */
const Stage: React.FC<{L: (typeof LAYOUTS)['story']; children: React.ReactNode}> = ({L, children}) => (
  <AbsoluteFill>
    <Backdrop L={L} />
    {children}
  </AbsoluteFill>
);

export const Main: React.FC<{format: Format; audio?: boolean}> = ({format, audio = true}) => {
  useFonts();
  const g = useCurrentFrame();
  const L = LAYOUTS[format];
  const logoVis = prog(g, 186, 204) * (1 - prog(g, 592, 604));
  // scenes mount just before their ribbon has fully covered the frame
  return (
    <AbsoluteFill style={{backgroundColor: '#3a0710'}}>
      {g < 184 && (
        <Stage L={L}>
          <BoxScene L={L} g={g} />
        </Stage>
      )}
      {g >= SWEEPS.s1.range[0] && g < 360 && (
        <RevealByRibbon L={L} g={g} sweep={SWEEPS.s1}>
          <Stage L={L}>
            <WellnessScene L={L} g={g} />
          </Stage>
        </RevealByRibbon>
      )}
      {g >= SWEEPS.s2.range[0] && g < 520 && (
        <RevealByRibbon L={L} g={g} sweep={SWEEPS.s2}>
          <Stage L={L}>
            <TravelScene L={L} g={g} />
          </Stage>
        </RevealByRibbon>
      )}
      {g >= SWEEPS.s3.range[0] && (
        <RevealByRibbon L={L} g={g} sweep={SWEEPS.s3}>
          <Stage L={L}>
            <FinalScene L={L} g={g} />
            <Lights L={L} g={g} on={T.lightsOn} />
          </Stage>
        </RevealByRibbon>
      )}
      <div style={{position: 'absolute', left: 0, width: L.W, top: L.logoSm.cy - L.logoSm.w * 0.2, display: 'flex', justifyContent: 'center', opacity: logoVis * 0.9}}>
        <Logo w={L.logoSm.w} />
      </div>
      <TransitionOverlay L={L} g={g} />
      {audio && <Audio src={staticFile('audio/fafari-bed.mp3')} />}
    </AbsoluteFill>
  );
};
