/** Controles de formulário com aparência nativa: segmentado, chave e passo. */
import { h, setText } from '../dom.js';
import { icons } from '../icons.js';

/**
 * Controle segmentado (grupo de opções exclusivas).
 * @param {{ label: string, options: {value: any, label: string}[], value: any, onChange: Function }} props
 */
export function segmented({ label, options, value, onChange }) {
  const thumb = h('span', { class: 'segmented-thumb', 'aria-hidden': 'true' });
  const buttons = options.map((option) =>
    h(
      'button',
      {
        type: 'button',
        role: 'radio',
        class: 'segmented-option',
        onClick: () => {
          set(option.value);
          onChange(option.value);
        },
      },
      option.label,
    ),
  );
  const el = h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': label }, thumb, buttons);
  el.style.setProperty('--count', options.length);

  // Setas do teclado movem a seleção, como em um grupo de rádio nativo.
  el.addEventListener('keydown', (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const current = options.findIndex((o) => o.value === el.dataset.value);
    const next = options[(current + step + options.length) % options.length];
    set(next.value);
    onChange(next.value);
    buttons[options.indexOf(next)].focus();
  });

  function set(next) {
    const index = Math.max(0, options.findIndex((o) => o.value === next));
    el.dataset.value = String(options[index].value);
    el.style.setProperty('--index', index);
    buttons.forEach((button, i) => {
      button.setAttribute('aria-checked', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
  }

  set(value);
  return { el, set };
}

/** Chave liga/desliga. */
export function toggle({ label, value, onChange }) {
  const el = h('button', { type: 'button', role: 'switch', class: 'switch', 'aria-label': label });
  el.append(h('span', { class: 'switch-knob', 'aria-hidden': 'true' }));
  const set = (on) => el.setAttribute('aria-checked', String(on));
  el.addEventListener('click', () => {
    const next = el.getAttribute('aria-checked') !== 'true';
    set(next);
    onChange(next);
  });
  set(value);
  return { el, set };
}

/** Ajuste numérico com botões − e +. */
export function stepper({ label, value, min, max, format, onChange }) {
  const output = h('output', { class: 'stepper-value', 'aria-live': 'polite' });
  const dec = h('button', { type: 'button', class: 'stepper-btn', 'aria-label': `Diminuir ${label}`, html: icons.minus });
  const inc = h('button', { type: 'button', class: 'stepper-btn', 'aria-label': `Aumentar ${label}`, html: icons.plus });
  const el = h('div', { class: 'stepper', role: 'group', 'aria-label': label }, dec, output, inc);
  let current = value;

  function set(next) {
    current = Math.min(max, Math.max(min, next));
    setText(output, format(current));
    dec.disabled = current <= min;
    inc.disabled = current >= max;
  }

  // Segurar o botão repete o ajuste, como nos controles nativos.
  function bind(button, delta) {
    let timer = 0;
    const stepOnce = () => {
      const before = current;
      set(current + delta);
      if (current !== before) onChange(current);
    };
    const stop = () => {
      clearTimeout(timer);
      timer = 0;
    };
    button.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      stepOnce();
      const repeat = (delay) => {
        timer = setTimeout(() => {
          stepOnce();
          repeat(Math.max(60, delay * 0.8));
        }, delay);
      };
      repeat(420);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((type) => button.addEventListener(type, stop));
    // Teclado / leitores de tela (o clique sem ponteiro tem detail = 0).
    button.addEventListener('click', (event) => {
      if (event.detail === 0) stepOnce();
    });
  }

  bind(dec, -1);
  bind(inc, 1);
  set(value);
  return { el, set };
}
