/** Pedido de permissão do microfone, com a explicação de privacidade. */
import { h } from '../dom.js';
import { icons } from '../icons.js';

export function permissionScreen(router, { pending = false } = {}) {
  const button = h('button', { type: 'button', class: 'btn btn-primary' });

  function setPending(on) {
    button.disabled = on;
    button.textContent = on ? 'Aguardando permissão…' : 'Permitir microfone';
  }

  button.addEventListener('click', () => router.ctx.requestMic());
  setPending(pending);

  const el = h(
    'section',
    { class: 'onboarding', 'aria-labelledby': 'perm-title' },
    h(
      'div',
      { class: 'onboarding-body' },
      h('div', { class: 'icon-badge', html: icons.mic }),
      h('h1', { class: 'onboarding-title', id: 'perm-title' }, 'Permita o acesso ao microfone'),
      h('p', { class: 'onboarding-text' }, 'O microfone é usado apenas para detectar a frequência das cordas do seu violão.'),
      h(
        'p',
        { class: 'privacy-note' },
        h('span', { html: icons.shield, 'aria-hidden': 'true' }),
        'Nada é gravado, salvo ou enviado.',
      ),
    ),
    h('div', { class: 'onboarding-actions' }, button),
  );

  return { el, setPending };
}
