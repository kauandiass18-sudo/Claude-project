/** Seletor das seis cordas (6ª à 1ª). */
import { h } from '../dom.js';
import { icons } from '../icons.js';

export class StringSelector {
  /** @param {{ onSelect: (index: number) => void }} options */
  constructor({ onSelect }) {
    this.onSelect = onSelect;
    this.el = h('div', { class: 'strings', role: 'group', 'aria-label': 'Cordas' });
    this.buttons = [];
    this.key = '';
  }

  /**
   * @param {object} view
   * @param {Array} view.strings cordas resolvidas da afinação
   * @param {'auto'|'manual'} view.mode
   * @param {number} view.selectedIndex corda escolhida (modo manual)
   * @param {number|null} view.activeIndex corda sendo ouvida
   * @param {number[]} view.tuned cordas já afinadas
   */
  update({ strings, mode, selectedIndex, activeIndex, tuned }) {
    const key = strings.map((s) => s.name).join();
    if (key !== this.key) this.build(strings);
    this.key = key;

    this.buttons.forEach((button, index) => {
      const string = strings[index];
      const selected = mode === 'manual' && index === selectedIndex;
      const active = mode === 'auto' && index === activeIndex;
      const isTuned = tuned.includes(index);
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-active', active);
      button.classList.toggle('is-tuned', isTuned);
      button.setAttribute(
        'aria-label',
        `${string.number}ª corda, ${string.solfege} (${string.name})${isTuned ? ', afinada' : ''}`,
      );
    });
  }

  build(strings) {
    this.el.replaceChildren();
    this.el.style.setProperty('--count', strings.length);
    this.buttons = strings.map((string, index) => {
      const button = h(
        'button',
        { type: 'button', class: 'string', onClick: () => this.onSelect(index) },
        h('span', { class: 'string-number', 'aria-hidden': 'true' }, String(string.number)),
        h(
          'span',
          { class: 'string-note', 'aria-hidden': 'true' },
          string.letter,
          string.accidental ? h('span', { class: 'acc' }, string.accidental) : null,
        ),
        h('span', { class: 'string-check', 'aria-hidden': 'true', html: icons.check }),
      );
      this.el.append(button);
      return button;
    });
  }
}
