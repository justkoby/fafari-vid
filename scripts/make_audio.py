#!/usr/bin/env python3
"""Original instrumental bed + effects for the FAFARI ad, synthesised locally (no samples, no third-party music).
Writes public/audio/fafari-bed.mp3 (needs numpy + ffmpeg). Cue times come from src/timing.json."""
import json, subprocess, wave, os
import numpy as np

SR = 44100
DUR = 25.0
T = json.load(open('src/timing.json'))
fps = T['fps']
N = int(SR * DUR)
rng = np.random.default_rng(7)  # deterministic

def t_(n): return np.arange(n) / SR
def env_ad(n, a, d, power=3.0):
    t = t_(n); e = np.minimum(t / max(a, 1e-4), 1.0) * np.exp(-t / d)
    return e
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

L = np.zeros(N); R = np.zeros(N)
def add(sig, t0, pan=0.0, gain=1.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * (1 - max(pan, 0)); R[i:i + len(sig)] += sig * gain * (1 + min(pan, 0))

def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i in range(len(x)):
        s = (1 - a) * x[i] + a * s; y[i] = s
    return y

def pad(m, dur):
    n = int(SR * (dur + 1.2)); t = t_(n); s = np.zeros(n)
    for det in (-0.07, 0.0, 0.07):
        f = midi(m + det)
        s += np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    a = np.minimum(t / 0.9, 1) * np.where(t < dur, 1, np.exp(-(t - dur) / 0.35))
    return s * a / 3

def bell(m, ln=2.2):
    n = int(SR * ln); t = t_(n); f = midi(m); s = np.zeros(n)
    for k, (r, a, d) in enumerate([(1, 1, 1.4), (2.76, 0.5, 0.7), (5.4, 0.25, 0.35), (8.9, 0.1, 0.2)]):
        s += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d)
    return s * np.minimum(t / 0.002, 1)

def noise(n): return rng.standard_normal(n)

def kick():
    n = int(SR * 0.35); t = t_(n); f = 48 + 90 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)

def hat():
    n = int(SR * 0.07); x = noise(n); x = x - np.concatenate([[0], x[:-1]])  # crude highpass
    return x * np.exp(-t_(n) / 0.018)

def swish(dur, up=True):
    n = int(SR * dur); t = t_(n) / dur; x = noise(n)
    out = np.zeros(n)
    for fc, w in ((500, 1.0), (1800, 0.8), (5200, 0.5)):
        out += w * (lowpass(x, fc * (0.5 + 1.5 * (t.mean()))) - lowpass(x, fc * 0.3))
    shape = np.sin(np.pi * t) ** 2
    return out * shape * (0.6 + 0.4 * (t if up else 1 - t))

def impact():
    n = int(SR * 0.9); t = t_(n)
    thump = np.sin(2 * np.pi * (55 + 70 * np.exp(-t / 0.05)) * t) * np.exp(-t / 0.22)
    thud = lowpass(noise(n), 700) * np.exp(-t / 0.06) * 0.8
    return thump + thud

def chime(m, gain=1.0):
    return (bell(m, 2.6) + 0.5 * bell(m + 12, 2.6) + 0.3 * bell(m + 19, 2.6)) * gain

# --- music bed ---
BPM = 96; beat = 60 / BPM; bar = 4 * beat
chords = [[48, 55, 59, 64, 67], [45, 52, 60, 64, 67], [41, 48, 57, 60, 64], [43, 50, 57, 59, 62]]  # Cmaj7, Am7, Fmaj7, G6
pent = [72, 74, 76, 79, 81, 84]
t0 = 0.0; ci = 0
while t0 < DUR:
    ch = chords[ci % 4]
    lvl = 0.55 if t0 < 3 else 0.8
    for m in ch: add(pad(m, bar), t0, pan=(m % 5 - 2) * 0.12, gain=0.055 * lvl)
    add(pad(ch[0] - 12, bar), t0, gain=0.07 * lvl)
    ci += 1; t0 += bar
# bell arpeggios on eighths (from the reveal), sparse in the intro
rnd = np.random.default_rng(3)
step = beat / 2; k = 0
while k * step < DUR - 1:
    tt = k * step; bi = int(tt // bar) % 4; ch = chords[bi]
    dense = tt > 3.0
    if (dense and k % 2 == 0) or (not dense and k % 8 == 0):
        tones = [m + 12 * o for m in ch[2:] for o in (1, 2)] + [m for m in pent if (m % 12) in {c % 12 for c in ch}]
        m = tones[int(rnd.integers(len(tones)))]
        while m > 88: m -= 12
        add(bell(m, 1.8), tt, pan=float(rnd.uniform(-0.5, 0.5)), gain=0.05 if dense else 0.04)
    k += 1
# gentle beat from 3 s: soft kick on beats, shaker on off-eighths
b = 0
while b * beat < DUR - 0.5:
    tt = b * beat
    if tt >= 3.0:
        add(kick(), tt, gain=0.30 if b % 4 == 0 else 0.22)
        add(hat(), tt + beat / 2, pan=0.2, gain=0.07)
        add(hat(), tt + beat * 0.25, pan=-0.2, gain=0.03); add(hat(), tt + beat * 0.75, pan=0.25, gain=0.03)
    b += 1

# --- effects (synced to storyboard) ---
fr = lambda f: f / fps
add(impact(), fr(T['impact']), gain=0.55)
add(impact(), fr(T['impact'] + 19), gain=0.16)  # small bounce landing
for key in ('sweep1', 'sweep2', 'sweep3'):
    a, bb = T[key]; add(swish((bb - a) / fps * 1.1, True), fr(a) - 0.1, pan=0.0, gain=0.22)
add(swish(0.6), fr(98), gain=0.10)  # ribbon wrapping the box
add(chime(84), fr(T['sweep1'][1]) - 0.2, gain=0.09)          # wellness reveal
add(chime(86), fr(T['sweep2'][1]) - 0.2, gain=0.09)          # travel reveal
add(chime(88), fr(T['lightsOn']), gain=0.09)                 # lights on
for i, w in enumerate(T['words']): add(bell([84, 86, 88, 91][i], 1.8), fr(w) + 0.05, gain=0.12)
add(chime(91), fr(606), gain=0.11)                           # order card resolves
# text-in ticks
for f in (32, 104, 170, 338, 606):
    add(bell(96, 0.6), fr(f), gain=0.035)

# --- simple reverb (feedback taps), master ---
def verb(x):
    out = x.copy()
    for d, g in ((0.037, 0.32), (0.071, 0.24), (0.113, 0.17), (0.173, 0.11)):
        k = int(d * SR); out[k:] += g * x[:-k]
    return out
L = verb(L) * 0.9 + 0.1 * np.roll(L, 700); R = verb(R) * 0.9 + 0.1 * np.roll(R, 900)
fade = np.minimum(1, (DUR - t_(N)) / 1.8) * np.minimum(1, t_(N) / 0.05)
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max()); L *= 0.7 / peak; R *= 0.7 / peak
os.makedirs('public/audio', exist_ok=True)
wav = 'public/audio/_bed.wav'
with wave.open(wav, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype('<i2').tobytes())
subprocess.check_call(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-b:a', '192k', 'public/audio/fafari-bed.mp3'])
os.remove(wav)
print('wrote public/audio/fafari-bed.mp3')
