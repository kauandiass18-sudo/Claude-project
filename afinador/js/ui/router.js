/**
 * Navegação entre telas com transições nativas (empilhar / voltar).
 * Integra com o histórico do navegador para o botão "voltar" do Android.
 */
import { prefersReducedMotion } from './dom.js';

export class Router {
  /**
   * @param {HTMLElement} root
   * @param {Record<string, (router: Router, params?: object) => { el: HTMLElement, enter?: Function, leave?: Function }>} screens
   */
  constructor(root, screens) {
    this.root = root;
    this.screens = screens;
    this.stack = [];
    window.addEventListener('popstate', () => {
      if (this.stack.length > 1) this.pop({ fromHistory: true });
    });
  }

  get current() {
    return this.stack[this.stack.length - 1];
  }

  /** Substitui toda a pilha por uma tela (ex.: introdução → afinador). */
  reset(name, params) {
    const previous = [...this.stack];
    this.stack = [];
    const view = this.mount(name, params);
    this.stack.push(view);
    this.animate(view.el, 'fade-in');
    previous.forEach((v, i) => {
      v.leave?.();
      if (i === previous.length - 1) this.animate(v.el, 'fade-out', () => v.el.remove());
      else v.el.remove();
    });
    view.enter?.();
  }

  /** Abre uma tela por cima da atual. */
  push(name, params) {
    const below = this.current;
    const view = this.mount(name, params);
    this.stack.push(view);
    history.pushState({ depth: this.stack.length }, '');
    below?.el.setAttribute('inert', '');
    this.animate(view.el, 'push-in');
    if (below) this.animate(below.el, 'push-under');
    view.enter?.();
  }

  /** Volta para a tela anterior. */
  pop({ fromHistory = false } = {}) {
    if (this.stack.length < 2) return;
    if (!fromHistory) {
      history.back();
      return;
    }
    const view = this.stack.pop();
    const below = this.current;
    view.leave?.();
    below.el.removeAttribute('inert');
    this.animate(below.el, 'pop-under');
    this.animate(view.el, 'pop-out', () => view.el.remove());
    below.enter?.({ returning: true });
  }

  mount(name, params) {
    const view = this.screens[name](this, params);
    view.name = name;
    view.el.classList.add('screen');
    this.root.append(view.el);
    return view;
  }

  animate(el, kind, done) {
    if (prefersReducedMotion()) {
      done?.();
      return;
    }
    el.dataset.anim = kind;
    const finish = () => {
      if (el.dataset.anim === kind) delete el.dataset.anim;
      done?.();
    };
    el.addEventListener('animationend', finish, { once: true });
    // Garantia caso a animação não dispare (aba em segundo plano etc.).
    setTimeout(() => el.isConnected && el.dataset.anim === kind && finish(), 600);
  }
}
