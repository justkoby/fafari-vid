import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Use the pre-installed Chromium when available (offline-friendly); otherwise Remotion downloads its own.
const local = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  if (require('fs').existsSync(local)) Config.setBrowserExecutable(local);
} catch {}
