/** Sobre o aplicativo. */
import { h } from '../dom.js';
import { icons, logoMark } from '../icons.js';
import { page } from './page.js';
import { APP_VERSION } from '../../version.js';

function fact(icon, title, text) {
  return h(
    'li',
    { class: 'row row-fact' },
    h('span', { class: 'row-icon', html: icon, 'aria-hidden': 'true' }),
    h('span', { class: 'row-main' }, h('span', { class: 'row-title' }, title), h('span', { class: 'row-sub' }, text)),
  );
}

export function aboutScreen(router) {
  const el = page(
    router,
    { title: 'Sobre' },
    h(
      'div',
      { class: 'about-hero' },
      h('div', { class: 'brand-mark brand-mark-sm', html: logoMark }),
      h('p', { class: 'about-name' }, 'Afina'),
      h('p', { class: 'about-version' }, `Afinador de cordas · Versão ${APP_VERSION}`),
    ),
    h(
      'ul',
      { class: 'group' },
      fact(icons.shield, 'Privacidade', 'O microfone é usado apenas para medir a frequência das cordas. Nenhum áudio é gravado, salvo ou enviado.'),
      fact(icons.offline, 'Funciona sem internet', 'Depois de aberto uma vez, o afinador funciona offline. Toda a análise acontece no aparelho.'),
      fact(icons.wave, 'Precisão', 'Detecção da frequência fundamental pelo algoritmo YIN, com parâmetros próprios para violão, violino e ukulele e precisão abaixo de 1 cent.'),
    ),
    h('p', { class: 'group-footer' }, 'Sem anúncios, sem cadastro e sem rastreamento.'),
  );
  return { el };
}
