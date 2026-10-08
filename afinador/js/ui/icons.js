/** Ícones lineares (24×24), desenhados para combinar com a tipografia do sistema. */
const svg = (body, extra = '') =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${body}</svg>`;

export const icons = {
  settings: svg(
    '<path d="M4 7h10"/><path d="M18 7h2"/><circle cx="16" cy="7" r="2"/><path d="M4 17h2"/><path d="M10 17h10"/><circle cx="8" cy="17" r="2"/>',
  ),
  back: svg('<path d="M15 5l-7 7 7 7"/>'),
  chevron: svg('<path d="M9 6l6 6-6 6"/>'),
  chevronDown: svg('<path d="M7 10l5 5 5-5"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  up: svg('<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>'),
  down: svg('<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>'),
  minus: svg('<path d="M6 12h12"/>'),
  plus: svg('<path d="M12 6v12"/><path d="M6 12h12"/>'),
  mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>'),
  micOff: svg(
    '<path d="M15 9.5V6a3 3 0 0 0-5.7-1.3"/><path d="M9 9v2a3 3 0 0 0 4.6 2.5"/><path d="M5.5 11a6.5 6.5 0 0 0 10.7 5"/><path d="M18.4 12.6a6.5 6.5 0 0 0 .1-1.6"/><path d="M12 17.5V21"/><path d="M4 4l16 16"/>',
  ),
  lock: svg('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  wave: svg('<path d="M3 12h2l2-5 3 10 3-14 3 12 2-3h3"/>'),
  offline: svg('<path d="M12 20h.01"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 13a10 10 0 0 1 5.2-2.8"/><path d="M19 13a10 10 0 0 0-2.4-1.7"/><path d="M2 9.5a15 15 0 0 1 4.3-2.6"/><path d="M22 9.5A15 15 0 0 0 12 5.5"/><path d="M3 3l18 18"/>'),
  shield: svg('<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'),
};

/** Marca do aplicativo: arco de afinação com o ponteiro centralizado. */
export const logoMark = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <path d="M12 42a20 20 0 0 1 40 0" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" opacity=".28"/>
  <path d="M27.5 22.5a20 20 0 0 1 9 0" fill="none" stroke="var(--ok)" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M32 42V27" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
  <circle cx="32" cy="42" r="4.2" fill="currentColor"/>
</svg>`;
