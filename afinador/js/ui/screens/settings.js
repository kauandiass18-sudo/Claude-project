/** Configurações. */
import { h, setText } from '../dom.js';
import { icons } from '../icons.js';
import { page } from './page.js';
import { segmented, stepper, toggle } from '../components/controls.js';
import { getTuning, tuningSummary } from '../../core/tunings.js';
import { A4_MAX, A4_MIN, DEFAULT_A4 } from '../../core/music.js';
import { settings, TOLERANCE_OPTIONS } from '../../state/settings.js';
import { APP_VERSION } from '../../version.js';

function row(title, control, { sub, id } = {}) {
  return h(
    'li',
    { class: 'row' },
    h('span', { class: 'row-main' }, h('span', { class: 'row-title', id }, title), sub ? h('span', { class: 'row-sub' }, sub) : null),
    control,
  );
}

function stackedRow(title, control, sub) {
  return h(
    'li',
    { class: 'row row-stacked' },
    h('span', { class: 'row-main' }, h('span', { class: 'row-title' }, title), sub ? h('span', { class: 'row-sub' }, sub) : null),
    control,
  );
}

function navRow(title, valueEl, onClick) {
  return h(
    'li',
    {},
    h(
      'button',
      { type: 'button', class: 'row row-nav', onClick },
      h('span', { class: 'row-title' }, title),
      valueEl,
      h('span', { class: 'row-chevron', html: icons.chevron, 'aria-hidden': 'true' }),
    ),
  );
}

export function settingsScreen(router) {
  const s = settings.get();

  const tuningValue = h('span', { class: 'row-value' });
  const renderTuning = () => {
    const tuning = getTuning(settings.get().tuningId);
    setText(tuningValue, `${tuning.name} — ${tuningSummary(tuning)}`);
  };
  renderTuning();

  const calibration = stepper({
    label: 'calibração',
    value: s.a4,
    min: A4_MIN,
    max: A4_MAX,
    format: (v) => `A4 = ${v} Hz`,
    onChange: (a4) => {
      settings.set({ a4 });
      resetCal.hidden = a4 === DEFAULT_A4;
    },
  });
  const resetCal = h('button', { type: 'button', class: 'text-btn', hidden: s.a4 === DEFAULT_A4 }, 'Restaurar 440 Hz');
  resetCal.addEventListener('click', () => {
    settings.set({ a4: DEFAULT_A4 });
    calibration.set(DEFAULT_A4);
    resetCal.hidden = true;
  });

  const mode = segmented({
    label: 'Modo',
    value: s.mode,
    options: [
      { value: 'auto', label: 'Automático' },
      { value: 'manual', label: 'Manual' },
    ],
    onChange: (value) => settings.set({ mode: value }),
  });

  const tolerance = segmented({
    label: 'Precisão',
    value: String(s.tolerance),
    options: TOLERANCE_OPTIONS.map((v) => ({ value: String(v), label: `±${v} cents` })),
    onChange: (value) => settings.set({ tolerance: Number(value) }),
  });

  const sensitivity = segmented({
    label: 'Sensibilidade',
    value: s.sensitivity,
    options: [
      { value: 'low', label: 'Baixa' },
      { value: 'medium', label: 'Média' },
      { value: 'high', label: 'Alta' },
    ],
    onChange: (value) => settings.set({ sensitivity: value }),
  });

  const theme = segmented({
    label: 'Tema',
    value: s.theme,
    options: [
      { value: 'light', label: 'Claro' },
      { value: 'dark', label: 'Escuro' },
      { value: 'system', label: 'Sistema' },
    ],
    onChange: (value) => settings.set({ theme: value }),
  });

  const sound = toggle({ label: 'Som de confirmação', value: s.confirmSound, onChange: (on) => settings.set({ confirmSound: on }) });

  const el = page(
    router,
    { title: 'Configurações' },
    h('h2', { class: 'group-title' }, 'Afinador'),
    h(
      'ul',
      { class: 'group' },
      navRow('Afinação', tuningValue, () => router.push('tunings')),
      stackedRow('Calibração', h('div', { class: 'row-control' }, calibration.el, resetCal), 'Frequência de referência do Lá 4'),
      stackedRow('Modo', mode.el, 'Automático identifica a corda tocada'),
      stackedRow('Precisão', tolerance.el, 'Margem para considerar a corda afinada'),
      stackedRow('Sensibilidade', sensitivity.el, 'Use Baixa em ambientes barulhentos'),
    ),
    h('h2', { class: 'group-title' }, 'Preferências'),
    h(
      'ul',
      { class: 'group' },
      row('Som de confirmação', sound.el, { sub: 'Toca um aviso curto ao afinar' }),
      stackedRow('Tema', theme.el),
    ),
    h('h2', { class: 'group-title' }, 'Sobre'),
    h(
      'ul',
      { class: 'group' },
      navRow('Sobre o Afina', h('span', { class: 'row-value' }, `Versão ${APP_VERSION}`), () => router.push('about')),
    ),
  );

  return {
    el,
    enter() {
      renderTuning();
      mode.set(settings.get().mode);
    },
  };
}
