/**
 * Inicialização do aplicativo: tema, navegação, microfone e ciclo de vida.
 */
import { Router } from './ui/router.js';
import { settings } from './state/settings.js';
import { TunerSession } from './session/tuner-session.js';
import { MicError, queryMicPermission } from './audio/microphone.js';
import { introScreen } from './ui/screens/intro.js';
import { permissionScreen } from './ui/screens/permission.js';
import { deniedScreen } from './ui/screens/denied.js';
import { tunerScreen } from './ui/screens/tuner.js';
import { tuningsScreen } from './ui/screens/tunings.js';
import { settingsScreen } from './ui/screens/settings.js';
import { aboutScreen } from './ui/screens/about.js';

const SPLASH_MIN_MS = 650;
const bootStarted = performance.now();

/* ---------- Tema ---------- */

const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme() {
  const { theme } = settings.get();
  const resolved = theme === 'system' ? (systemDark.matches ? 'dark' : 'light') : theme;
  document.documentElement.dataset.theme = resolved;
  const color = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', color));
}

systemDark.addEventListener('change', applyTheme);
applyTheme();

/* ---------- Sessão de afinação ---------- */

const session = new TunerSession();

function syncSession() {
  const s = settings.get();
  session.configure({
    tuningId: s.tuningId,
    a4: s.a4,
    mode: s.mode,
    stringIndex: s.stringIndex,
    tolerance: s.tolerance,
    sensitivity: s.sensitivity,
    confirmSound: s.confirmSound,
  });
}

syncSession();
settings.subscribe((state, prev, changed) => {
  if (changed.includes('theme')) applyTheme();
  syncSession();
});

/* ---------- Navegação ---------- */

const router = new Router(document.getElementById('app'), {
  intro: introScreen,
  permission: permissionScreen,
  denied: deniedScreen,
  tuner: tunerScreen,
  tunings: tuningsScreen,
  settings: settingsScreen,
  about: aboutScreen,
});

let requesting = false;

/**
 * Pede o microfone e entra no afinador.
 * Deve ser chamada a partir de um toque do usuário sempre que possível
 * (o iOS só libera o áudio dentro de um gesto).
 */
async function requestMic() {
  if (requesting) return;
  requesting = true;
  try {
    session.unlock();
  } catch {
    // tratado em start()
  }

  if (router.current?.name !== 'permission') router.reset('permission', { pending: true });
  else router.current.setPending?.(true);

  try {
    await session.start();
    settings.set({ onboarded: true });
    router.reset('tuner');
  } catch (error) {
    router.reset('denied', { kind: await errorKind(error) });
  } finally {
    requesting = false;
  }
}

async function errorKind(error) {
  const kind = error instanceof MicError ? error.kind : 'unknown';
  if (kind === 'unknown' && (await queryMicPermission()) === 'denied') return 'denied';
  return kind;
}

router.ctx = { session, requestMic };

/** Liga o microfone sem gesto (permissão já concedida). */
async function resumeTuner() {
  try {
    await session.start();
  } catch (error) {
    router.reset('denied', { kind: await errorKind(error) });
  }
}

/* ---------- Ciclo de vida ---------- */

// Fora da tela, o microfone é liberado (privacidade e bateria).
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    session.stop();
  } else if (router.stack.some((view) => view.name === 'tuner')) {
    resumeTuner();
  }
});

// Primeiro toque em qualquer lugar destrava o áudio, se o navegador exigir.
document.addEventListener('pointerdown', () => session.suspended && session.resume(), { capture: true });

/* ---------- Início ---------- */

async function boot() {
  const { onboarded } = settings.get();
  let route = 'intro';
  if (onboarded) {
    const permission = await queryMicPermission();
    route = permission === 'granted' ? 'tuner' : permission === 'denied' ? 'denied' : 'permission';
  }

  const wait = SPLASH_MIN_MS - (performance.now() - bootStarted);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

  history.replaceState({ depth: 1 }, '');
  router.reset(route, route === 'denied' ? { kind: 'denied' } : undefined);
  if (route === 'tuner') resumeTuner();

  const splash = document.getElementById('splash');
  splash?.classList.add('is-hidden');
  splash?.addEventListener('transitionend', () => splash.remove(), { once: true });
  setTimeout(() => splash?.remove(), 800);
}

boot();

/* ---------- Offline ---------- */

const secureHost = location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname);
if ('serviceWorker' in navigator && secureHost) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
