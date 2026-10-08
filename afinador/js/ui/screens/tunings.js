/** Seleção de afinação. */
import { h } from '../dom.js';
import { icons } from '../icons.js';
import { page } from './page.js';
import { TUNINGS, tuningSummary } from '../../core/tunings.js';
import { settings } from '../../state/settings.js';

export function tuningsScreen(router) {
  const current = settings.get().tuningId;

  const rows = TUNINGS.map((tuning) => {
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
            settings.set({ tuningId: tuning.id, stringIndex: 0 });
            setTimeout(() => router.pop(), 180);
          },
        },
        h('span', { class: 'row-main' }, h('span', { class: 'row-title' }, tuning.name), h('span', { class: 'row-sub mono' }, tuningSummary(tuning))),
        h('span', { class: 'row-check', html: icons.check, 'aria-hidden': 'true' }),
      ),
    );
  });

  const el = page(
    router,
    { title: 'Afinação' },
    h('ul', { class: 'group', role: 'radiogroup', 'aria-label': 'Afinações' }, rows),
    h('p', { class: 'group-footer' }, 'As notas vão da 6ª corda (mais grave) à 1ª corda (mais aguda).'),
  );

  return { el };
}
