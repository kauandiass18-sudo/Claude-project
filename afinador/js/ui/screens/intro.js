/** Introdução (somente na primeira abertura). */
import { h } from '../dom.js';
import { logoMark } from '../icons.js';

export function introScreen(router) {
  const start = h('button', { type: 'button', class: 'btn btn-primary' }, 'Começar');
  start.addEventListener('click', () => router.ctx.requestMic());

  const el = h(
    'section',
    { class: 'onboarding', 'aria-labelledby': 'intro-title' },
    h(
      'div',
      { class: 'onboarding-body' },
      h('div', { class: 'brand-mark', html: logoMark }),
      h('h1', { class: 'onboarding-title', id: 'intro-title' }, 'Afine seu violão em segundos.'),
      h('p', { class: 'onboarding-text' }, 'Toque uma corda e veja na hora se ela está grave, aguda ou afinada.'),
    ),
    h('div', { class: 'onboarding-actions' }, start, h('p', { class: 'fineprint' }, 'Sem cadastro. Funciona sem internet.')),
  );

  return { el };
}
