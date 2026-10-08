/** Sinal sintético parecido com uma corda de violão: harmônicos, decaimento e ruído. */
export function pluck(freq, { sampleRate = 48000, length = 4096, start = 0, amps = [0.35, 1, 0.6, 0.4, 0.25, 0.15], noise = 0.008, gain = 0.1, seed = 1 } = {}) {
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5;
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = (start + i) / sampleRate;
    let v = 0;
    amps.forEach((a, h) => (v += a * Math.sin(2 * Math.PI * freq * (h + 1) * t + h)));
    out[i] = gain * v * Math.exp(-t * 1.5) + rand() * noise;
  }
  return out;
}

export function noise(length = 4096, level = 0.1, seed = 7) {
  let s = seed;
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) out[i] = (((s = (s * 16807) % 2147483647) / 2147483647) - 0.5) * level;
  return out;
}

export const cents = (f, ref) => 1200 * Math.log2(f / ref);
