/**
 * Sessão de afinação: conecta microfone → detector → motor e entrega
 * "retratos" do estado para a interface, em tempo real.
 */
import { Microphone } from '../audio/microphone.js';
import { PitchDetector } from '../audio/pitch-detector.js';
import { playChime } from '../audio/chime.js';
import { TunerEngine } from '../core/tuner-engine.js';

const ANALYSIS_INTERVAL_MS = 30; // ~33 análises por segundo
const CHIME_MUTE_MS = 320; // ignora o próprio som de confirmação
const WORKER_TIMEOUT_MS = 500;
const SILENT = Object.freeze({ freq: null, clarity: 0, rms: 0 });

export class TunerSession {
  constructor() {
    this.mic = new Microphone();
    this.engine = new TunerEngine();
    this.detector = null;
    this.listeners = new Set();
    this.frame = 0;
    this.lastAnalysis = 0;
    this.muteUntil = 0;
    this.confirmSound = true;
    this.wakeLock = null;
    this.worker = undefined; // undefined = ainda não criado; null = indisponível
    this.busySince = 0;
    this.loop = this.loop.bind(this);
  }

  configure({ confirmSound, ...engineConfig }) {
    if (confirmSound !== undefined) this.confirmSound = confirmSound;
    this.engine.configure(engineConfig);
    this.applyAnalysis();
  }

  /** Ajusta detector e filtros do microfone ao instrumento atual. */
  applyAnalysis() {
    const a = this.engine.analysis;
    const sampleRate = this.mic.ctx?.sampleRate;
    if (!sampleRate) return;
    const d = this.detector;
    if (!d || d.sampleRate !== sampleRate || d.minFreq !== a.minFreq || d.maxFreq !== a.maxFreq || d.threshold !== a.threshold) {
      this.detector = new PitchDetector({ sampleRate, minFreq: a.minFreq, maxFreq: a.maxFreq, threshold: a.threshold });
      this.busySince = 0;
    }
    this.mic.configure({ highpass: a.highpass, lowpass: a.lowpass, bufferSize: this.detector.bufferSize });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  get running() {
    return this.mic.running;
  }

  get suspended() {
    return this.mic.suspended;
  }

  /** Prepara o áudio dentro de um gesto do usuário (necessário no iOS). */
  unlock() {
    this.mic.ensureContext();
  }

  async start() {
    this.mic.ensureContext();
    this.applyAnalysis();
    await this.mic.start(this.detector.bufferSize);
    this.applyAnalysis();
    this.createWorker();
    this.engine.reset();
    this.requestWakeLock();
    if (!this.frame) this.frame = requestAnimationFrame(this.loop);
  }

  /** Retoma o AudioContext (após um toque, se o navegador exigir). */
  async resume() {
    await this.mic.ctx?.resume();
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.busySince = 0;
    this.mic.stop();
    this.wakeLock?.release().catch(() => {});
    this.wakeLock = null;
  }

  createWorker() {
    if (this.worker !== undefined) return;
    try {
      this.worker = new Worker(new URL('../audio/pitch-worker.js', import.meta.url), { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        this.busySince = 0;
        if (this.frame) this.handle(data.result, data.t);
      };
      // Navegadores sem suporte a módulos em workers: analisa na thread principal.
      this.worker.onerror = () => {
        this.worker?.terminate();
        this.worker = null;
        this.busySince = 0;
      };
    } catch {
      this.worker = null;
    }
  }

  loop(now) {
    this.frame = requestAnimationFrame(this.loop);
    if (now - this.lastAnalysis < ANALYSIS_INTERVAL_MS) return;
    if (this.busySince && now - this.busySince < WORKER_TIMEOUT_MS) return;
    this.lastAnalysis = now;

    // Enquanto o som de confirmação toca, a tela mantém o último estado.
    if (now < this.muteUntil) return;

    const samples = this.mic.running ? this.mic.read() : null;
    if (!samples) {
      this.handle(SILENT, now);
      return;
    }

    const hintHz = this.engine.hintHz;
    const minRms = this.engine.gate.rms * 0.3;
    const { minFreq, maxFreq, threshold } = this.detector;

    if (this.worker) {
      const copy = samples.slice(samples.length - this.detector.bufferSize);
      this.busySince = now;
      this.worker.postMessage(
        { samples: copy, sampleRate: this.detector.sampleRate, minFreq, maxFreq, threshold, hintHz, minRms, t: now },
        [copy.buffer],
      );
    } else {
      this.handle(this.detector.detect(samples, hintHz, minRms), now);
    }
  }

  handle(reading, t) {
    const snapshot = this.engine.process({ ...reading, t });
    snapshot.suspended = this.mic.suspended;

    if (snapshot.justTuned) {
      if (this.confirmSound) {
        playChime(this.mic.ctx);
        this.muteUntil = performance.now() + CHIME_MUTE_MS;
      }
      navigator.vibrate?.(12);
    }

    for (const listener of this.listeners) listener(snapshot);
  }

  /** Mantém a tela acesa enquanto afina (quando suportado). */
  async requestWakeLock() {
    try {
      if (!this.wakeLock && 'wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => (this.wakeLock = null));
      }
    } catch {
      // Não suportado ou negado: segue normalmente.
    }
  }
}
