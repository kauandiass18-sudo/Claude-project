/**
 * Escolha do instrumento.
 * - Primeira abertura: "Escolha seu instrumento" → toque → microfone → afinador.
 * - Dentro do app: "Trocar instrumento", com o atual marcado.
 */
import { h } from '../dom.js';
import { icons, instrumentIcons, logoMark } from '../icons.js';
import { page } from './page.js';
import { INSTRUMENTS } from '../../core/instruments/index.js';
import { tuningSummary } from '../../core/tunings.js';
import { settings } from '../../state/settings.js';

function card(instrument, { current, onPick }) {
  const tuning = instrument.tunings[0];
  const strings = tuning.notes.length;
  return h(
    'li',
    {},
    h(
      'button',
      {
        type: 'button',
        class: 'instrument-card',
        'aria-current': current ? 'true' : null,
        'aria-label': `${instrument.name}, ${strings} cordas, afinação ${tuningSummary(tuning)}`,
        onClick: () => onPick(instrument.id),
      },
      h('span', { class: 'instrument-art', html: instrumentIcons[instrument.id] }),
      h(
        'span',
        { class: 'instrument-text' },
        h('span', { class: 'instrument-name' }, instrument.name),
        h('span', { class: 'instrument-meta' }, `${strings} cordas · `, h('span', { class: 'mono' }, tuningSummary(tuning))),
      ),
      h('span', { class: 'instrument-end', html: current ? icons.check : icons.chevron, 'aria-hidden': 'true' }),
    ),
  );
}

export function instrumentsScreen(router, { first = false } = {}) {
  const current = first ? null : settings.get().instrument;

  function onPick(id) {
    settings.set({ instrument: id });
    if (first) router.ctx.requestMic();
    else router.pop();
  }

  const list = h(
    'ul',
    { class: 'instrument-list', 'aria-label': 'Instrumentos' },
    INSTRUMENTS.map((instrument) => card(instrument, { current: instrument.id === current, onPick })),
  );

  if (!first) {
    const el = page(router, { title: 'Trocar instrumento' }, h('h2', { class: 'group-title' }, 'Instrumento'), list);
    return { el };
  }

  const el = h(
    'section',
    { class: 'onboarding', 'aria-labelledby': 'pick-title' },
    h(
      'div',
      { class: 'onboarding-body' },
      h('div', { class: 'brand-mark', html: logoMark }),
      h('h1', { class: 'onboarding-title', id: 'pick-title' }, 'Escolha seu instrumento'),
      h('p', { class: 'onboarding-text' }, 'Toque no instrumento e comece a afinar em segundos.'),
      list,
    ),
    h('div', { class: 'onboarding-actions' }, h('p', { class: 'fineprint' }, 'Sem cadastro. Funciona sem internet.')),
  );
  return { el };
}
