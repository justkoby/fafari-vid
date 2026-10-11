import timing from './timing.json';

export const T = timing;
export const FPS = timing.fps;

export const C = {
  burgundy: '#3a0710',
  deep: '#5a0b17',
  red: '#a4141f',
  redBright: '#c91c2a',
  gold: '#d5992c',
  goldLight: '#f3d489',
  goldDark: '#8a5a12',
  ivory: '#f6ecd9',
  navy: '#14234f',
};

export const CONTACT = {
  phones: ['+233 24 420 3010', '+233 50 658 0545'],
  instagram: '@fafari_gh',
  location: ['5 Nii Moi Lake, Agbogba', 'Near Wisconsin University', 'Agbogba Road, North Legon'],
};

export const COPY = {
  hook: 'Another ordinary gift?',
  reveal: 'Not this Christmas.',
  wellness: 'For their well-deserved downtime.',
  travel: 'For their next big adventure.',
  lead: 'Perfect for',
  words: ['Family.', 'Friends.', 'Clients.', 'Your team.'],
  headline: 'Make their Christmas unforgettable.',
  cta: 'Order your Christmas hampers today.',
};

export const ASSETS = {
  logo: 'assets/logo.svg',
  logoReverse: 'assets/logo-reverse.svg',
  wellness: {src: 'assets/wellness.png', w: 1678, h: 937},
  travel: {src: 'assets/travel.png', w: 1698, h: 926},
};

export type Format = 'story' | 'feed';
export const FORMATS: Record<Format, {width: number; height: number}> = {
  story: {width: 1080, height: 1920},
  feed: {width: 1080, height: 1350},
};
