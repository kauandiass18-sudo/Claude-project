# Afina · Afinador de cordas

Afinador profissional para **violão, violino e ukulele** que roda direto no
navegador do celular e pode ser **instalado na tela inicial** como um aplicativo (PWA).

- Abre em segundos, sem cadastro, sem anúncios.
- Detecta a frequência pelo microfone com **precisão abaixo de 1 cent**.
- Funciona **sem internet** depois do primeiro acesso.
- Nenhum áudio é gravado, salvo ou enviado: toda a análise acontece no aparelho.

Feito com **HTML, CSS e JavaScript puro**. Não precisa instalar nada nem rodar build.

---

## Como usar

1. Abra o endereço (precisa ser `https://` — exigência dos navegadores para o microfone).
2. Em **Escolha seu instrumento**, toque em Violão, Violino ou Ukulele e permita o microfone.
3. Toque uma corda solta. O Afina mostra a nota, a frequência, o desvio em cents e
   se a corda está **grave**, **afinada** ou **aguda**.

Nas próximas aberturas o app vai direto para o último instrumento usado. Para mudar,
toque no nome do instrumento no topo do afinador (**Trocar instrumento**).

Para instalar como aplicativo:

- **iPhone (Safari):** Compartilhar › *Adicionar à Tela de Início*.
- **Android (Chrome):** menu ⋮ › *Instalar aplicativo*.

## Rodar localmente

```bash
cd afinador
npm start        # servidor em http://localhost:8080 (localhost também libera o microfone)
npm test         # testes do motor de detecção e da lógica do afinador (Node 18+)
```

---

## Funcionalidades

| | |
|---|---|
| Instrumentos | **Violão** (6 cordas), **Violino** (4 cordas), **Ukulele** (4 cordas) |
| Violão | Padrão (E A D G B E), Drop D, Eb Standard, D Standard, DADGAD, Open G, Open D |
| Violino | Padrão (G3 D4 A4 E5) |
| Ukulele | Padrão reentrante (G4 C4 E4 A4) e Low G (G3 C4 E4 A4) |
| Perfis | Afinação, modo e corda ficam salvos **separadamente para cada instrumento** |
| Modos | **Automático** (identifica a corda) ou **Manual** (escolhe a corda) |
| Estados | Muito grave · Ligeiramente grave · Afinado · Ligeiramente agudo · Muito agudo |
| Calibração | A4 de 430 a 450 Hz (padrão 440 Hz) |
| Precisão | Tolerância de ±3, ±5 ou ±10 cents para considerar afinado |
| Sensibilidade | Baixa (ambientes barulhentos), Média, Alta |
| Tema | Escuro (padrão), Claro ou Sistema |
| Som de confirmação | Aviso curto ao afinar (opcional) |
| Mensagens | "Aguardando som…", "Sinal muito fraco", "Sinal instável", "Toque a corda novamente" |

Outros cuidados: mantém a tela acesa durante a afinação, libera o microfone ao sair
do app, marca as cordas já afinadas, respeita *Reduzir movimento* e o tamanho de
texto do sistema, e nunca indica estado só por cor (sempre há texto e seta).

---

## Estrutura

```
afinador/
├── index.html              Página única + splash
├── manifest.webmanifest    Instalação como aplicativo
├── sw.js                   Service worker (funcionamento offline)
├── css/
│   ├── tokens.css          Cores, tipografia, espaçamentos (tema escuro e claro)
│   ├── base.css            Reset, estrutura das telas e transições
│   ├── components.css      Botões, listas, controles, seletor de cordas
│   └── screens.css         Layout de cada tela
├── js/
│   ├── app.js              Inicialização: tema, navegação, microfone, ciclo de vida
│   ├── core/               Lógica pura (sem DOM, testável)
│   │   ├── instruments/    Um arquivo por instrumento  ← adicione novos aqui
│   │   │   ├── index.js    Registro de instrumentos
│   │   │   ├── guitar.js   Violão: afinações + parâmetros de análise
│   │   │   ├── violin.js   Violino
│   │   │   └── ukulele.js  Ukulele
│   │   ├── music.js        Frequência ⇄ nota ⇄ cents, nomes em português
│   │   ├── tunings.js      Resolve as cordas de uma afinação
│   │   └── tuner-engine.js Suavização, estabilidade, escolha de corda, zonas
│   ├── audio/
│   │   ├── microphone.js   Captura com Web Audio (sem gravar nada)
│   │   ├── pitch-detector.js  Algoritmo YIN (frequência fundamental)
│   │   ├── pitch-worker.js    Roda o detector fora da thread da interface
│   │   └── chime.js        Som de confirmação sintetizado
│   ├── session/
│   │   └── tuner-session.js   Microfone → detector → motor → interface
│   ├── state/              Store observável e configurações salvas no aparelho
│   └── ui/
│       ├── router.js       Navegação entre telas
│       ├── components/     Mostrador, seletor de cordas, controles
│       └── screens/        Instrumentos, permissão, afinador, afinações, configurações, sobre
└── tests/                  Testes automatizados (node --test)
```

### Adicionar uma afinação

Inclua um objeto em `tunings` no arquivo do instrumento, por exemplo
`js/core/instruments/guitar.js` (notas da corda de número mais alto para a 1ª):

```js
{ id: 'open-e', name: 'Open E', notes: ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'] },
```

Ela aparece automaticamente na tela de afinações e funciona nos dois modos.

### Adicionar um instrumento (baixo, cavaquinho, bandolim…)

1. Crie `js/core/instruments/<id>.js` no mesmo formato de `guitar.js`, com as
   afinações e um bloco `analysis` próprio:

   ```js
   export default {
     id: 'cavaquinho',
     name: 'Cavaquinho',
     tunings: [{ id: 'standard', name: 'Padrão', notes: ['D4', 'G4', 'B4', 'D5'] }],
     analysis: {
       minFreq: 230, maxFreq: 900,   // faixa útil: corda mais grave/aguda com folga
       threshold: 0.14,              // limiar do YIN
       highpass: 180, lowpass: 3000, // filtros do microfone
       rmsScale: 0.9,                // energia mínima relativa (som mais fraco = menor)
       smoothing: 1.1,               // >1 responde mais rápido, <1 mais estável
       autoRange: 250,               // cents máximos para associar uma corda no automático
     },
   };
   ```

2. Registre-o em `js/core/instruments/index.js`.
3. Desenhe o ícone em `instrumentIcons` (`js/ui/icons.js`) e inclua o arquivo no `sw.js`.

Quantidade de cordas, seletor, modo automático e configurações se ajustam sozinhos.
Um teste verifica se a faixa e os filtros de cada instrumento cobrem todas as cordas.

### Publicar uma nova versão

Ao mudar qualquer arquivo, aumente `CACHE_VERSION` em `sw.js` (e `APP_VERSION` em
`js/version.js`) para que os aparelhos baixem a versão nova. Se criar um arquivo
novo, inclua-o na lista `ASSETS` do `sw.js` — um teste avisa se faltar algum.

---

## Como a detecção funciona

1. O áudio do microfone passa por filtros ajustados ao instrumento (violão: 45 Hz–1,4 kHz;
   violino: 120 Hz–3 kHz; ukulele: 120 Hz–2,5 kHz), com cancelamento de eco, supressão de
   ruído e ganho automático **desligados** (eles distorcem a nota).
2. ~33 vezes por segundo, o **YIN** estima a frequência fundamental com interpolação
   parabólica e correção de oitava. A faixa de busca é limitada ao instrumento: o 2º
   harmônico de uma corda aguda fica fora da faixa e não pode ser confundido com a nota,
   e frequências de outro instrumento são ignoradas. Energia mínima, limiar e suavização
   também mudam por instrumento (o violino, por exemplo, amortece o vibrato do arco).
3. O **motor** só aceita uma nota nova após leituras consistentes, descarta leituras
   isoladas, aplica mediana + suavização adaptativa e só troca de zona quando ela se
   mantém por um instante — o ponteiro não treme e a nota não fica pulando.
4. No modo automático, se a frequência estiver no meio do caminho entre duas cordas,
   o app **não chuta**: pede para tocar a corda novamente.
5. "Afinado" é confirmado após ~0,35 s estável dentro da tolerância.
