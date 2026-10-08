/**
 * Mostrador semicircular de −50 a +50 cents.
 *
 * O ponteiro segue a leitura com uma mola criticamente amortecida:
 * movimento suave, sem tremer e sem ultrapassar o alvo (o que poderia
 * sugerir "afinado" por um instante).
 */
import { h, s, prefersReducedMotion } from '../dom.js';

const CX = 160;
const CY = 178;
const R = 134;
const SPAN_DEG = 60; // ângulo correspondente a 50 cents
const RANGE = 50;
const STIFFNESS = 140;
const DAMPING = 2 * Math.sqrt(STIFFNESS); // amortecimento crítico

const rad = (deg) => (deg * Math.PI) / 180;
const angleFor = (cents) => (Math.max(-RANGE, Math.min(RANGE, cents)) / RANGE) * SPAN_DEG;
const point = (deg, r) => [CX + r * Math.sin(rad(deg)), CY - r * Math.cos(rad(deg))];

function arc(fromDeg, toDeg, r) {
  const [x0, y0] = point(fromDeg, r);
  const [x1, y1] = point(toDeg, r);
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  const sweep = toDeg > fromDeg ? 1 : 0;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} ${sweep} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export class Gauge {
  constructor() {
    this.value = 0;
    this.velocity = 0;
    this.target = 0;
    this.raf = 0;
    this.last = 0;
    this.tick = this.tick.bind(this);

    const svg = s('svg', { viewBox: '0 0 320 196', class: 'gauge-svg', 'aria-hidden': 'true', focusable: 'false' });

    svg.append(s('path', { d: arc(-SPAN_DEG - 4, SPAN_DEG + 4, R), class: 'gauge-track' }));
    this.band = s('path', { class: 'gauge-band' });
    svg.append(this.band);
    this.fill = s('path', { class: 'gauge-fill', d: arc(0, 0.01, R) });
    svg.append(this.fill);

    const ticks = s('g', { class: 'gauge-ticks' });
    for (let c = -RANGE; c <= RANGE; c += 5) {
      const major = c % 25 === 0;
      const deg = angleFor(c);
      const [x0, y0] = point(deg, R + 9);
      const [x1, y1] = point(deg, R + (major ? 21 : 15));
      ticks.append(
        s('line', {
          x1: x0.toFixed(2),
          y1: y0.toFixed(2),
          x2: x1.toFixed(2),
          y2: y1.toFixed(2),
          class: c === 0 ? 'tick tick-zero' : major ? 'tick tick-major' : 'tick',
        }),
      );
      if (major) {
        const [lx, ly] = point(deg, R + 37);
        const label = s('text', { x: lx.toFixed(2), y: (ly + 4).toFixed(2), class: 'tick-label' });
        label.textContent = c === 0 ? '0' : c > 0 ? `+${c}` : `−${-c}`;
        ticks.append(label);
      }
    }
    svg.append(ticks);

    this.needle = s('g', { class: 'gauge-needle' });
    // Marcador que desliza sobre o arco.
    this.needle.append(s('circle', { cx: CX, cy: CY - R, r: 9, class: 'needle-body' }));
    svg.append(this.needle);

    this.el = h('div', { class: 'gauge' }, svg);
    this.svg = svg;
    this.setTolerance(5);
    this.render();
  }

  setTolerance(cents) {
    if (cents === this.tolerance) return;
    this.tolerance = cents;
    this.band.setAttribute('d', arc(-angleFor(cents), angleFor(cents), R));
  }

  /**
   * @param {number|null} cents desvio atual (null = sem leitura)
   * @param {string} state 'active' | 'hold' | 'idle'
   */
  update(cents, state) {
    this.el.dataset.state = state;
    this.el.dataset.pinned = cents != null && Math.abs(cents) > RANGE ? cents < 0 ? 'low' : 'high' : '';
    this.target = cents == null ? 0 : Math.max(-RANGE, Math.min(RANGE, cents));
    if (prefersReducedMotion()) {
      this.value = this.target;
      this.velocity = 0;
      this.render();
      return;
    }
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  tick(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const force = STIFFNESS * (this.target - this.value) - DAMPING * this.velocity;
    this.velocity += force * dt;
    this.value += this.velocity * dt;
    this.render();

    if (Math.abs(this.target - this.value) < 0.02 && Math.abs(this.velocity) < 0.05) {
      this.value = this.target;
      this.velocity = 0;
      this.render();
      this.raf = 0;
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  }

  render() {
    const deg = angleFor(this.value);
    this.needle.setAttribute('transform', `rotate(${deg.toFixed(3)} ${CX} ${CY})`);
    const from = Math.min(0, deg);
    const to = Math.max(0, deg);
    this.fill.setAttribute('d', arc(from, Math.max(to, from + 0.01), R));
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
}
