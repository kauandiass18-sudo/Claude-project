/** Tela principal: o afinador. */
import { h, setText } from '../dom.js';
import { icons, instrumentIcons } from '../icons.js';
import { Gauge } from '../components/gauge.js';
import { StringSelector } from '../components/string-selector.js';
import { Status, Zone } from '../../core/tuner-engine.js';
import { formatCents, formatHz } from '../../core/music.js';
import { resolveStrings } from '../../core/tunings.js';
import { getTuning } from '../../core/instruments/index.js';
import { currentInstrument, currentProfile, settings, updateProfile } from '../../state/settings.js';

const TEXT_INTERVAL_MS = 90; // números mudam no máximo ~11×/s para serem legíveis

const ZONE_COPY = {
  [Zone.FLAT_FAR]: { label: 'Muito grave', hint: 'Aperte a corda', icon: icons.up },
  [Zone.FLAT]: { label: 'Ligeiramente grave', hint: 'Aperte só um pouco', icon: icons.up },
  [Zone.IN_TUNE]: { label: 'Afinado', hint: '', icon: icons.check },
  [Zone.SHARP]: { label: 'Ligeiramente agudo', hint: 'Afrouxe só um pouco', icon: icons.down },
  [Zone.SHARP_FAR]: { label: 'Muito agudo', hint: 'Afrouxe a corda', icon: icons.down },
};

function statusCopy(snap, mode, selected) {
  const waiting = {
    label: 'Aguardando som…',
    hint: mode === 'manual' ? `Toque a ${selected.number}ª corda` : 'Toque qualquer corda solta',
  };
  switch (snap.status) {
    case Status.ACTIVE:
    case Status.HOLD:
      return ZONE_COPY[snap.zone] ?? waiting;
    case Status.WEAK:
      return { label: 'Sinal muito fraco', hint: 'Aproxime o instrumento do microfone' };
    case Status.UNSTABLE:
      return { label: 'Sinal instável', hint: 'Toque uma corda por vez, em um lugar silencioso' };
    case Status.AMBIGUOUS:
      return { label: 'Toque a corda novamente', hint: 'Não deu para identificar qual corda soou' };
    default:
      return waiting;
  }
}

export function tunerScreen(router) {
  const { session } = router.ctx;
  const gauge = new Gauge();

  // Cabeçalho: instrumento → afinação
  const instrumentArt = h('span', { class: 'instrument-chip-art', 'aria-hidden': 'true' });
  const instrumentName = h('span', { class: 'chip-title' });
  const instrumentChip = h(
    'button',
    { type: 'button', class: 'tuning-chip instrument-chip', onClick: () => router.push('instruments') },
    instrumentArt,
    instrumentName,
    h('span', { class: 'chip-icon', html: icons.chevronDown }),
  );

  const tuningName = h('span', { class: 'chip-title' });
  const tuningNotes = h('span', { class: 'chip-sub' });
  const tuningChip = h(
    'button',
    { type: 'button', class: 'tuning-link', onClick: () => router.push('tunings') },
    h('span', { class: 'chip-text' }, tuningName, tuningNotes),
    h('span', { class: 'chip-icon', html: icons.chevronDown }),
  );
  const settingsBtn = h('button', {
    type: 'button',
    class: 'icon-btn',
    'aria-label': 'Configurações',
    html: icons.settings,
    onClick: () => router.push('settings'),
  });

  // Nota
  const letter = h('span', { class: 'note-letter' });
  const accidental = h('span', { class: 'note-acc' });
  const octave = h('span', { class: 'note-octave' });
  const noteEl = h('div', { class: 'note' }, h('span', { class: 'note-ring', 'aria-hidden': 'true' }), letter, accidental, octave);
  const noteName = h('p', { class: 'note-name' });

  // Leituras
  const hz = h('span', { class: 'stat-value' });
  const cents = h('span', { class: 'stat-value' });
  const stats = h(
    'dl',
    { class: 'stats' },
    h('div', { class: 'stat' }, h('dt', { class: 'stat-label' }, 'Frequência'), h('dd', {}, hz)),
    h('div', { class: 'stat' }, h('dt', { class: 'stat-label' }, 'Desvio'), h('dd', {}, cents)),
  );

  // Estado
  const statusIcon = h('span', { class: 'status-icon', 'aria-hidden': 'true' });
  const statusLabel = h('span', { class: 'status-label' });
  const statusHint = h('p', { class: 'status-hint' });
  const status = h(
    'div',
    { class: 'status' },
    h('div', { class: 'status-pill', role: 'status', 'aria-live': 'polite' }, statusIcon, statusLabel),
    statusHint,
  );

  // Cordas
  const caption = h('span', { class: 'strings-caption' });
  const autoBtn = h('button', { type: 'button', class: 'auto-toggle', 'aria-label': 'Detecção automática da corda' }, 'Auto');
  autoBtn.addEventListener('click', () => {
    const { mode } = currentProfile();
    updateProfile({ mode: mode === 'auto' ? 'manual' : 'auto' });
  });
  const selector = new StringSelector({
    onSelect: (index) => updateProfile({ mode: 'manual', stringIndex: index }),
  });

  // Ativação do áudio quando o navegador exige um toque.
  const unlock = h(
    'button',
    { type: 'button', class: 'unlock', hidden: true },
    h('span', { class: 'unlock-icon', html: icons.mic, 'aria-hidden': 'true' }),
    'Toque para ativar o microfone',
  );
  unlock.addEventListener('click', async () => {
    await session.resume();
    if (!session.running) router.ctx.requestMic();
  });

  const el = h(
    'section',
    { class: 'tuner', 'aria-label': 'Afinador' },
    h('header', { class: 'topbar' }, instrumentChip, settingsBtn),
    h('div', { class: 'tuning-bar' }, tuningChip),
    h(
      'main',
      { class: 'tuner-main' },
      h('div', { class: 'dial' }, gauge.el, noteEl),
      noteName,
      stats,
      status,
    ),
    h(
      'footer',
      { class: 'strings-panel' },
      h('div', { class: 'strings-head' }, caption, autoBtn),
      selector.el,
    ),
    unlock,
  );

  let lastSnap = null;
  let lastTextAt = 0;
  let lastKey = '';

  function renderChrome() {
    const instrument = currentInstrument();
    const profile = currentProfile();
    const s = { ...settings.get(), ...profile };
    const tuning = getTuning(instrument.id, profile.tuningId);
    const strings = resolveStrings(tuning, s.a4);

    if (instrumentArt.dataset.id !== instrument.id) {
      instrumentArt.dataset.id = instrument.id;
      instrumentArt.innerHTML = instrumentIcons[instrument.id];
    }
    setText(instrumentName, instrument.name);
    instrumentChip.setAttribute('aria-label', `Instrumento: ${instrument.name}. Trocar instrumento`);
    el.dataset.instrument = instrument.id;

    setText(tuningName, tuning.name);
    setText(tuningNotes, strings.map((x) => x.letter + x.accidental).join(' '));
    tuningChip.setAttribute('aria-label', `Afinação: ${tuning.name}, ${strings.length} cordas. Alterar afinação`);
    autoBtn.setAttribute('aria-pressed', String(s.mode === 'auto'));
    gauge.setTolerance(s.tolerance);
    return { s, strings, instrument, tuning };
  }

  function render(snap) {
    const { s, strings, instrument, tuning } = renderChrome();
    // Leitura de outro instrumento/afinação (logo após a troca): descarta.
    if (snap && (snap.instrumentId !== instrument.id || snap.tuningId !== tuning.id)) snap = null;
    const mode = s.mode;
    const selected = strings[s.stringIndex];
    const reading = snap && (snap.status === Status.ACTIVE || snap.status === Status.HOLD);
    const target = snap?.target ?? (mode === 'manual' ? selected : null);
    const zone = reading ? snap.zone : '';

    el.dataset.status = snap?.status ?? Status.IDLE;
    el.dataset.zone = zone;
    el.dataset.confirmed = String(Boolean(reading && snap.inTune));
    unlock.hidden = !snap?.suspended;

    gauge.update(reading ? snap.cents : null, reading ? (snap.status === Status.HOLD ? 'hold' : 'active') : 'idle');

    // Nota
    const statusKey = `${snap?.status}|${zone}|${target?.index}|${mode}`;
    const now = performance.now();
    const textDue = statusKey !== lastKey || now - lastTextAt >= TEXT_INTERVAL_MS;

    noteEl.classList.toggle('is-empty', !target);
    if (target) {
      setText(letter, target.letter);
      setText(accidental, target.accidental);
      setText(octave, String(target.octave));
      setText(noteName, `${target.solfege.toUpperCase()} • ${target.name}`);
      noteEl.setAttribute('aria-label', `Nota ${target.solfege}, ${target.name}`);
    } else {
      setText(letter, '');
      setText(accidental, '');
      setText(octave, '');
      setText(noteName, '\u00a0');
      noteEl.setAttribute('aria-label', 'Nenhuma nota');
    }

    if (textDue) {
      lastTextAt = now;
      setText(hz, snap?.freq != null ? formatHz(snap.freq) : '— Hz');
      setText(cents, reading ? `${formatCents(snap.cents)} cents` : '— cents');
    }

    // Estado
    const copy = statusCopy(snap ?? { status: Status.IDLE }, mode, selected);
    if (statusKey !== lastKey) {
      statusIcon.innerHTML = copy.icon ?? '';
      setText(statusLabel, copy.label);
    }
    let hint = copy.hint;
    if (reading && snap.inTune) hint = mode === 'auto' ? 'Pode tocar a próxima corda' : 'Corda afinada';
    // No modo manual, avisa qual nota está soando se for outra.
    if (reading && mode === 'manual' && snap.detected && snap.detected.midi !== target.midi) {
      hint = `${hint} · soando ${snap.detected.name}`;
    }
    setText(statusHint, hint || ' ');
    lastKey = statusKey;

    // Cordas
    const active = reading ? snap.target?.index ?? null : null;
    setText(caption, target ? `${target.number}ª corda — ${target.letter}${target.accidental}` : 'Detecção automática');
    selector.update({
      strings,
      mode,
      selectedIndex: s.stringIndex,
      activeIndex: mode === 'auto' ? snap?.target?.index ?? null : active,
      tuned: snap?.tuned ?? [],
    });

    if (snap?.justTuned) celebrate();
  }

  function celebrate() {
    noteEl.classList.remove('celebrate');
    void noteEl.offsetWidth; // reinicia a animação
    noteEl.classList.add('celebrate');
  }
  noteEl.addEventListener('animationend', () => noteEl.classList.remove('celebrate'));

  const onSnapshot = (snap) => {
    lastSnap = snap;
    render(snap);
  };

  let unsubscribeSession = null;
  let unsubscribeSettings = null;

  return {
    el,
    enter() {
      unsubscribeSession ??= session.subscribe(onSnapshot);
      unsubscribeSettings ??= settings.subscribe(() => render(lastSnap));
      render(lastSnap);
    },
    leave() {
      unsubscribeSession?.();
      unsubscribeSettings?.();
      unsubscribeSession = unsubscribeSettings = null;
      gauge.destroy();
    },
  };
}
