/**
 * Registro de instrumentos.
 *
 * Para adicionar um instrumento (guitarra, baixo, cavaquinho, bandolim…):
 *   1. crie um arquivo nesta pasta seguindo o formato de `guitar.js`;
 *   2. importe-o e inclua-o em INSTRUMENTS;
 *   3. adicione o ícone em `js/ui/icons.js` (instrumentIcons) e o arquivo no `sw.js`.
 *
 * Cada instrumento define:
 *   - tunings: afinações, com as notas da corda de número mais alto até a 1ª;
 *   - analysis: parâmetros de detecção próprios (faixa de frequência, filtros,
 *     limiar do YIN, energia mínima, suavização e alcance do modo automático).
 */
import guitar from './guitar.js';
import violin from './violin.js';
import ukulele from './ukulele.js';

export const INSTRUMENTS = [guitar, violin, ukulele];
export const DEFAULT_INSTRUMENT_ID = 'guitar';

export function getInstrument(id) {
  return INSTRUMENTS.find((i) => i.id === id) ?? INSTRUMENTS[0];
}

/** Afinação de um instrumento; cai na primeira (padrão) se não existir. */
export function getTuning(instrumentId, tuningId) {
  const instrument = getInstrument(instrumentId);
  return instrument.tunings.find((t) => t.id === tuningId) ?? instrument.tunings[0];
}
