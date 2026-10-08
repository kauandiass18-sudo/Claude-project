/**
 * Captura do microfone com Web Audio.
 *
 * O áudio é analisado apenas em memória, quadro a quadro. Nada é gravado,
 * armazenado ou enviado: o fluxo não é conectado a nenhum gravador e as
 * amostras são sobrescritas a cada leitura.
 */

export class MicError extends Error {
  /** @param {'denied'|'not-found'|'unsupported'|'insecure'|'unknown'} kind */
  constructor(kind, cause) {
    super(kind);
    this.kind = kind;
    this.cause = cause;
  }
}

/** Estado atual da permissão, quando o navegador informa. */
export async function queryMicPermission() {
  try {
    const status = await navigator.permissions.query({ name: 'microphone' });
    return status.state; // 'granted' | 'denied' | 'prompt'
  } catch {
    return 'unknown';
  }
}

function fftSizeFor(bufferSize) {
  let size = 2048;
  while (size < bufferSize && size < 32768) size *= 2;
  return size;
}

export class Microphone {
  constructor() {
    this.ctx = null;
    this.stream = null;
    this.nodes = [];
    this.analyser = null;
    this.buffer = null;
    this.band = { highpass: 45, lowpass: 1400, bufferSize: 4096 };
  }

  /** Ajusta filtros e tamanho da janela ao instrumento (também com o microfone aberto). */
  configure({ highpass, lowpass, bufferSize }) {
    this.band = { highpass, lowpass, bufferSize };
    if (!this.analyser) return;
    this.highpass.frequency.value = highpass;
    this.lowpass.frequency.value = lowpass;
    const fftSize = fftSizeFor(bufferSize);
    if (this.analyser.fftSize !== fftSize) {
      this.analyser.fftSize = fftSize;
      this.buffer = new Float32Array(fftSize);
    }
  }

  get running() {
    return Boolean(this.stream) && this.ctx?.state === 'running';
  }

  get suspended() {
    return Boolean(this.stream) && this.ctx?.state !== 'running';
  }

  /** Cria (ou reaproveita) o AudioContext. Chamar dentro de um toque do usuário quando possível. */
  ensureContext() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) throw new MicError('unsupported');
      this.ctx = new Ctx({ latencyHint: 'interactive' });
    }
    if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  /**
   * Abre o microfone e prepara a cadeia de análise.
   * @param {number} bufferSize número mínimo de amostras por análise
   */
  async start(bufferSize = this.band.bufferSize) {
    if (this.stream) return;
    if (!window.isSecureContext) throw new MicError('insecure');
    if (!navigator.mediaDevices?.getUserMedia) throw new MicError('unsupported');

    const ctx = this.ensureContext();

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Processamentos de voz distorcem a altura e a dinâmica da corda.
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
        },
      });
    } catch (error) {
      const name = error?.name;
      if (name === 'NotAllowedError' || name === 'SecurityError') throw new MicError('denied', error);
      if (name === 'NotFoundError' || name === 'OverconstrainedError') throw new MicError('not-found', error);
      throw new MicError('unknown', error);
    }

    this.stream = stream;
    const source = ctx.createMediaStreamSource(stream);

    // Remove ruído abaixo e acima da faixa do instrumento (vento, manuseio, chiado).
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = this.band.highpass;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = this.band.lowpass;

    const analyser = ctx.createAnalyser();
    const fftSize = fftSizeFor(bufferSize);
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = 0;

    // Saída silenciosa: alguns navegadores só processam nós ligados ao destino.
    const mute = ctx.createGain();
    mute.gain.value = 0;

    source.connect(highpass).connect(lowpass).connect(analyser).connect(mute).connect(ctx.destination);
    this.nodes = [source, highpass, lowpass, analyser, mute];
    this.analyser = analyser;
    this.highpass = highpass;
    this.lowpass = lowpass;
    this.buffer = new Float32Array(fftSize);

    // Se o microfone for desconectado ou revogado, encerra a captura.
    stream.getAudioTracks().forEach((track) => track.addEventListener('ended', () => this.stop()));
  }

  /** Amostras mais recentes (o mesmo buffer é reutilizado a cada chamada). */
  read() {
    if (!this.analyser) return null;
    this.analyser.getFloatTimeDomainData(this.buffer);
    return this.buffer;
  }

  get sampleRate() {
    return this.ctx?.sampleRate ?? 48000;
  }

  /** Libera o microfone (o indicador de gravação do sistema se apaga). */
  stop() {
    for (const node of this.nodes) {
      try {
        node.disconnect();
      } catch {
        // já desconectado
      }
    }
    this.nodes = [];
    this.analyser = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }
}
