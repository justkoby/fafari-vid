# FAFARI Christmas ad (Remotion)

Source assets in the repo root are untouched; working copies live in `public/assets/`
(`logo-reverse.svg` = the supplied logo with only the dark-grey "I" recoloured ivory so it reads on red).

## Commands
    npm install
    npm run preview          # Remotion Studio (Fafari-9x16, Fafari-4x5)
    npm run render:story     # output/fafari-christmas-9x16.mp4  (1080x1920, 30fps, 25s, H.264)
    npm run render:feed      # output/fafari-christmas-4x5.mp4   (1080x1350, recomposed layout)
    npm run render:all
    npm run audio            # regenerate the synthesised score (python3 + numpy + ffmpeg)
    node scripts/stills.mjs Fafari-9x16 output/stills 30,326,749   # QA stills

Structure: `src/brand.ts` (colours, copy, contacts), `src/layout.ts` (per-format layout), `src/timing.json`
(scene/transition frames shared with the audio script), `src/components`, `src/scenes`.
Audio is original, synthesised locally (no samples or third-party music).
