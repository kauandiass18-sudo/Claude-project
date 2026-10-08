/**
 * Configurações do usuário, salvas no próprio aparelho (localStorage).
 * Nada é enviado para servidores.
 *
 * - Gerais: calibração, precisão, sensibilidade, tema, som.
 * - Por instrumento (`profiles`): afinação, modo e corda escolhida.
 *   Cada instrumento guarda a sua; trocar de instrumento não mistura nada.
 */
import { createStore } from './store.js';
import { A4_MAX, A4_MIN, DEFAULT_A4 } from '../core/music.js';
import { INSTRUMENTS, getInstrument } from '../core/instruments/index.js';
import { SENSITIVITY } from '../core/tuner-engine.js';

const STORAGE_KEY = 'afina.settings.v2';
const LEGACY_KEY = 'afina.settings.v1';

export const TOLERANCE_OPTIONS = [3, 5, 10];
export const THEME_OPTIONS = ['dark', 'light', 'system'];
export const MODE_OPTIONS = ['auto', 'manual'];

const DEFAULT_PROFILE = Object.freeze({ tuningId: 'standard', mode: 'auto', stringIndex: 0 });

export const DEFAULTS = Object.freeze({
  instrument: null, // último instrumento usado (null = ainda não escolheu)
  profiles: {},
  a4: DEFAULT_A4,
  tolerance: 5,
  sensitivity: 'medium',
  theme: 'dark',
  confirmSound: true,
  onboarded: false,
});

function sanitizeProfile(instrumentId, raw) {
  const instrument = getInstrument(instrumentId);
  const p = { ...DEFAULT_PROFILE, ...(raw && typeof raw === 'object' ? raw : {}) };
  const tuning = instrument.tunings.find((t) => t.id === p.tuningId) ?? instrument.tunings[0];
  p.tuningId = tuning.id;
  if (!MODE_OPTIONS.includes(p.mode)) p.mode = DEFAULT_PROFILE.mode;
  if (!Number.isInteger(p.stringIndex) || p.stringIndex < 0 || p.stringIndex >= tuning.notes.length) p.stringIndex = 0;
  return { tuningId: p.tuningId, mode: p.mode, stringIndex: p.stringIndex };
}

function sanitize(raw) {
  const s = { ...DEFAULTS, ...(raw && typeof raw === 'object' ? raw : {}) };
  if (!INSTRUMENTS.some((i) => i.id === s.instrument)) s.instrument = null;
  const profiles = {};
  for (const instrument of INSTRUMENTS) profiles[instrument.id] = sanitizeProfile(instrument.id, s.profiles?.[instrument.id]);
  s.profiles = profiles;
  s.a4 = Number.isFinite(s.a4) ? Math.min(A4_MAX, Math.max(A4_MIN, Math.round(s.a4))) : DEFAULTS.a4;
  if (!TOLERANCE_OPTIONS.includes(s.tolerance)) s.tolerance = DEFAULTS.tolerance;
  if (!(s.sensitivity in SENSITIVITY)) s.sensitivity = DEFAULTS.sensitivity;
  if (!THEME_OPTIONS.includes(s.theme)) s.theme = DEFAULTS.theme;
  s.confirmSound = Boolean(s.confirmSound);
  s.onboarded = Boolean(s.onboarded);
  return s;
}

/** Converte as configurações da versão 1 (somente violão). */
function migrate(v1) {
  const { tuningId, mode, stringIndex, ...rest } = v1;
  return {
    ...rest,
    instrument: v1.onboarded ? 'guitar' : null,
    profiles: { guitar: { tuningId, mode, stringIndex } },
  };
}

function load() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) return sanitize(JSON.parse(current));
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return sanitize(migrate(JSON.parse(legacy)));
  } catch {
    // Dados corrompidos: começa do padrão.
  }
  return sanitize({});
}

export const settings = createStore(load());

settings.subscribe((state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Armazenamento indisponível (ex.: navegação privada): segue só em memória.
  }
});

/** Instrumento atual (cai no violão se nenhum foi escolhido ainda). */
export function currentInstrument() {
  return getInstrument(settings.get().instrument);
}

/** Perfil (afinação, modo, corda) do instrumento atual. */
export function currentProfile() {
  const { instrument, profiles } = settings.get();
  const id = getInstrument(instrument).id;
  return profiles[id] ?? sanitizeProfile(id);
}

/** Atualiza só o perfil do instrumento atual. */
export function updateProfile(patch) {
  const { profiles } = settings.get();
  const id = currentInstrument().id;
  settings.set({ profiles: { ...profiles, [id]: sanitizeProfile(id, { ...profiles[id], ...patch }) } });
}
