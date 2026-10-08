/**
 * Configurações do usuário, salvas no próprio aparelho (localStorage).
 * Nada é enviado para servidores.
 */
import { createStore } from './store.js';
import { A4_MAX, A4_MIN, DEFAULT_A4 } from '../core/music.js';
import { DEFAULT_TUNING_ID, TUNINGS } from '../core/tunings.js';
import { SENSITIVITY } from '../core/tuner-engine.js';

const STORAGE_KEY = 'afina.settings.v1';

export const TOLERANCE_OPTIONS = [3, 5, 10];
export const THEME_OPTIONS = ['dark', 'light', 'system'];
export const MODE_OPTIONS = ['auto', 'manual'];

export const DEFAULTS = Object.freeze({
  tuningId: DEFAULT_TUNING_ID,
  a4: DEFAULT_A4,
  mode: 'auto',
  stringIndex: 0,
  tolerance: 5,
  sensitivity: 'medium',
  theme: 'dark',
  confirmSound: true,
  onboarded: false,
});

function sanitize(raw) {
  const s = { ...DEFAULTS, ...(raw && typeof raw === 'object' ? raw : {}) };
  if (!TUNINGS.some((t) => t.id === s.tuningId)) s.tuningId = DEFAULTS.tuningId;
  s.a4 = Number.isFinite(s.a4) ? Math.min(A4_MAX, Math.max(A4_MIN, Math.round(s.a4))) : DEFAULTS.a4;
  if (!MODE_OPTIONS.includes(s.mode)) s.mode = DEFAULTS.mode;
  s.stringIndex = Number.isInteger(s.stringIndex) && s.stringIndex >= 0 && s.stringIndex < 6 ? s.stringIndex : 0;
  if (!TOLERANCE_OPTIONS.includes(s.tolerance)) s.tolerance = DEFAULTS.tolerance;
  if (!(s.sensitivity in SENSITIVITY)) s.sensitivity = DEFAULTS.sensitivity;
  if (!THEME_OPTIONS.includes(s.theme)) s.theme = DEFAULTS.theme;
  s.confirmSound = Boolean(s.confirmSound);
  s.onboarded = Boolean(s.onboarded);
  return s;
}

function load() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return { ...DEFAULTS };
  }
}

export const settings = createStore(load());

settings.subscribe((state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Armazenamento indisponível (ex.: navegação privada): segue só em memória.
  }
});
