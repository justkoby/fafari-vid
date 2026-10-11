import React from 'react';
import {Composition, Still} from 'remotion';
import {FORMATS, FPS, T} from './brand';
import {Main} from './Main';

export const Root: React.FC = () => (
  <>
    <Composition id="Fafari-9x16" component={Main} durationInFrames={T.total} fps={FPS} {...FORMATS.story} defaultProps={{format: 'story' as const, audio: true}} />
    <Composition id="Fafari-4x5" component={Main} durationInFrames={T.total} fps={FPS} {...FORMATS.feed} defaultProps={{format: 'feed' as const, audio: true}} />
  </>
);
void Still;
