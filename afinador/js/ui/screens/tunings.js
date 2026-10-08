/** Seleção de afinação do instrumento atual. */
import { h } from '../dom.js';
import { icons } from '../icons.js';
import { page } from './page.js';
import { resolveStrings } from '../../core/tunings.js';
import { currentInstrument, currentProfile, updateProfile } from '../../state/settings.js';

export function tuningsScreen(router) {
  const instrument = currentInstrument();
  const current = currentProfile().tuningId;
  const top = instrument.tunings[0].notes.length;

  const rows = instrument.tunings.map((tuning) => {
    const selected = tuning.id === current;
    return h(
      'li',
      {},
      h(
        'button',
        {
          type: 'button',
          class: 'row row-option',
          role: 'radio',
          'aria-checked': String(selected),
          onClick: (event) => {
            const list = event.currentTarget.closest('ul');
            list.querySelectorAll('[role="radio"]').forEach((b) => b.setAttribute('aria-checked', 'false'));
            event.currentTarget.setAttribute('aria-checked', 'true');
            updateProfile({ tuningId: tuning.id, stringIndex: 0 });
            setTimeout(() => router.pop(), 180);
          },
        },
        h(
          'span',
          { class: 'row-main' },
          h('span', { class: 'row-title' }, tuning.name),
          h('span', { class: 'row-sub mono' }, resolveStrings(tuning).map((x) => x.name).join(' ')),
          tuning.note ? h('span', { class: 'row-sub' }, tuning.note) : null,
        ),
        h('span', { class: 'row-check', html: icons.check, 'aria-hidden': 'true' }),
      ),
    );
  });

  const el = page(
    router,
    { title: 'Afinação' },
    h('h2', { class: 'group-title' }, instrument.name),
    h('ul', { class: 'group', role: 'radiogroup', 'aria-label': `Afinações do ${instrument.name}` }, rows),
    h('p', { class: 'group-footer' }, `As notas vão da ${top}ª à 1ª corda.`),
  );

  return { el };
}
