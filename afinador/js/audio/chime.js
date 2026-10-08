/** Som curto e discreto de confirmação, sintetizado na hora (sem arquivos). */
export function playChime(ctx) {
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.value = 0.16;
  out.connect(ctx.destination);

  // Duas parciais suaves (Mi 6 e Si 6), fora da faixa analisada pelo afinador.
  [
    [1318.51, 1, 0],
    [1975.53, 0.45, 0.045],
  ].forEach(([freq, level, delay]) => {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0, now + delay);
    env.gain.linearRampToValueAtTime(level, now + delay + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.42);
    osc.connect(env).connect(out);
    osc.start(now + delay);
    osc.stop(now + delay + 0.45);
  });

  setTimeout(() => out.disconnect(), 700);
}
