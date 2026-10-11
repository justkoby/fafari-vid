// Usage: node scripts/stills.mjs <Fafari-9x16|Fafari-4x5> <outDir> <frame,frame,...>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [, , id, outDir, frameList] = process.argv;
const local = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = fs.existsSync(local) ? local : null;
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), onProgress: () => {}});
const comp = await selectComposition({serveUrl, id, browserExecutable});
for (const f of frameList.split(',').map(Number)) {
  await renderStill({composition: comp, serveUrl, frame: f, browserExecutable, output: path.join(outDir, `${id}-f${String(f).padStart(3, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 88});
}
console.log('done', frameList);
