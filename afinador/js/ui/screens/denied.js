/** Microfone indisponível: explica como liberar nas configurações do aparelho. */
import { h } from '../dom.js';
import { icons } from '../icons.js';

function platform() {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (iOS) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

const STEPS = {
  ios: [
    'Abra os Ajustes do iPhone e toque em Safari (ou no navegador que você usa).',
    'Toque em Microfone e escolha Permitir.',
    'Volte para cá e toque em Tentar novamente.',
  ],
  android: [
    'Toque no ícone à esquerda do endereço do site (ou em ⋮ › Informações do app).',
    'Abra Permissões › Microfone e escolha Permitir.',
    'Volte para cá e toque em Tentar novamente.',
  ],
  desktop: [
    'Clique no ícone à esquerda do endereço do site.',
    'Ative a permissão de Microfone.',
    'Toque em Tentar novamente.',
  ],
};

const COPY = {
  denied: {
    icon: icons.micOff,
    title: 'Microfone bloqueado',
    text: 'Para afinar, o Afina precisa ouvir o violão. Libere o microfone nas configurações:',
    steps: true,
  },
  'not-found': {
    icon: icons.micOff,
    title: 'Nenhum microfone encontrado',
    text: 'Conecte um microfone ou verifique se outro aplicativo não está usando o microfone agora.',
  },
  unsupported: {
    icon: icons.micOff,
    title: 'Navegador sem suporte',
    text: 'Abra o Afina em uma versão atualizada do Safari ou do Chrome.',
  },
  insecure: {
    icon: icons.lock,
    title: 'Conexão não segura',
    text: 'O microfone só funciona em endereços com https. Abra o Afina pelo endereço seguro.',
  },
  unknown: {
    icon: icons.micOff,
    title: 'Não foi possível usar o microfone',
    text: 'Feche outros aplicativos que possam estar usando o microfone e tente novamente.',
  },
};

export function deniedScreen(router, { kind = 'denied' } = {}) {
  const copy = COPY[kind] ?? COPY.unknown;
  const retry = h('button', { type: 'button', class: 'btn btn-primary' }, 'Tentar novamente');
  retry.addEventListener('click', () => router.ctx.requestMic());

  const steps = copy.steps
    ? h('ol', { class: 'steps' }, STEPS[platform()].map((step) => h('li', {}, step)))
    : null;

  const el = h(
    'section',
    { class: 'onboarding', 'aria-labelledby': 'denied-title' },
    h(
      'div',
      { class: 'onboarding-body' },
      h('div', { class: 'icon-badge icon-badge-muted', html: copy.icon }),
      h('h1', { class: 'onboarding-title', id: 'denied-title' }, copy.title),
      h('p', { class: 'onboarding-text' }, copy.text),
      steps,
    ),
    h('div', { class: 'onboarding-actions' }, retry),
  );

  return { el };
}
