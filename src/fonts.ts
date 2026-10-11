import {staticFile} from 'remotion';

/** Fonts are self-hosted in public/fonts (Cormorant Garamond + Inter, SIL OFL) so renders never depend on the network. */
const faces: {family: string; style: string; weight: string; file: string}[] = [
  {family: 'Cormorant Garamond', style: 'normal', weight: '600', file: 'CormorantGaramond-normal-600.woff2'},
  {family: 'Cormorant Garamond', style: 'italic', weight: '600', file: 'CormorantGaramond-italic-600.woff2'},
  {family: 'Inter', style: 'normal', weight: '400 700', file: 'Inter-normal-400.woff2'},
];

export const fontsReady = Promise.all(
  faces.map(async (f) => {
    const face = new FontFace(f.family, `url(${staticFile('fonts/' + f.file)}) format('woff2')`, {style: f.style, weight: f.weight});
    await face.load();
    document.fonts.add(face);
  }),
);

export const DISPLAY = `'Cormorant Garamond', Georgia, serif`;
export const SANS = `'Inter', system-ui, sans-serif`;
