/** Estrutura comum das telas secundárias: barra com voltar + título. */
import { h } from '../dom.js';
import { icons } from '../icons.js';

export function page(router, { title, label }, ...content) {
  const heading = h('h1', { class: 'navbar-title' }, title);
  return h(
    'section',
    { class: 'page', 'aria-label': label ?? title },
    h(
      'header',
      { class: 'navbar' },
      h('button', {
        type: 'button',
        class: 'icon-btn navbar-back',
        'aria-label': 'Voltar',
        html: icons.back,
        onClick: () => router.pop(),
      }),
      heading,
      h('span', { class: 'navbar-spacer', 'aria-hidden': 'true' }),
    ),
    h('div', { class: 'page-body' }, ...content),
  );
}
