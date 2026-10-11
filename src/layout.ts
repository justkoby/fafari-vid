import type {Format} from './brand';

/** Per-format layout: the 4:5 version is recomposed, not cropped. */
export type SetPlace = {cx: number; top: number; w: number};
export type Layout = {
  W: number;
  H: number;
  horizon: number; // wall/floor split
  title: {cy: number; size: number; maxW: number};
  box: {cx: number; floor: number; size: number};
  prod: {vy0: number; vy1: number; cy: number; w: number; label: number};
  logoSm: {cy: number; w: number};
  lights: {sag: number; y: number};
  words: {leadY: number; wordY: number; size: number};
  coll: {wellness: SetPlace; travel: SetPlace};
  card: {
    wellness: SetPlace;
    travel: SetPlace;
    logo: {cy: number; w: number};
    headline: {y: number; size: number};
    cta: {y: number; size: number};
    panel: {y: number; h: number};
    phone: number;
  };
};

export const LAYOUTS: Record<Format, Layout> = {
  story: {
    W: 1080,
    H: 1920,
    horizon: 1130,
    title: {cy: 360, size: 118, maxW: 900},
    box: {cx: 540, floor: 1330, size: 560},
    prod: {vy0: 560, vy1: 1580, cy: 1070, w: 960, label: 1500},
    logoSm: {cy: 1770, w: 230},
    lights: {sag: 70, y: 36},
    words: {leadY: 215, wordY: 330, size: 150},
    coll: {
      wellness: {cx: 410, top: 520, w: 720},
      travel: {cx: 650, top: 1030, w: 740},
    },
    card: {
      wellness: {cx: 310, top: 565, w: 540},
      travel: {cx: 770, top: 800, w: 540},
      logo: {cy: 262, w: 380},
      headline: {y: 440, size: 82},
      cta: {y: 1245, size: 46},
      panel: {y: 1290, h: 365},
      phone: 60,
    },
  },
  feed: {
    W: 1080,
    H: 1350,
    horizon: 800,
    title: {cy: 215, size: 84, maxW: 900},
    box: {cx: 540, floor: 975, size: 470},
    prod: {vy0: 340, vy1: 1190, cy: 770, w: 960, label: 1130},
    logoSm: {cy: 1265, w: 190},
    lights: {sag: 34, y: 14},
    words: {leadY: 128, wordY: 238, size: 118},
    coll: {
      wellness: {cx: 300, top: 400, w: 540},
      travel: {cx: 770, top: 590, w: 540},
    },
    card: {
      wellness: {cx: 290, top: 420, w: 500},
      travel: {cx: 790, top: 530, w: 500},
      logo: {cy: 148, w: 300},
      headline: {y: 312, size: 62},
      cta: {y: 960, size: 38},
      panel: {y: 990, h: 310},
      phone: 52,
    },
  },
};
