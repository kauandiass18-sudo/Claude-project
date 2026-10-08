/** Utilitários mínimos de DOM. */

/**
 * Cria um elemento.
 * h('button', { class: 'btn', onClick: fn, 'aria-label': 'Voltar' }, 'Texto', filho)
 */
export function h(tag, props = {}, ...children) {
  const el = tag === 'svg' || props.svg ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false || key === 'svg') continue;
    if (key === 'class') el.setAttribute('class', value);
    else if (key === 'html') el.innerHTML = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else el.setAttribute(key, value === true ? '' : value);
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/** Cria um elemento SVG (namespace correto). */
export function s(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

/** Atualiza o texto apenas quando muda (evita trabalho e anúncios repetidos de leitores de tela). */
export function setText(el, text) {
  if (el.textContent !== text) el.textContent = text;
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
