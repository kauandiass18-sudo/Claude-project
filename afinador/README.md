# Afina · Afinador de violão

Afinador de violão profissional que roda direto no navegador do celular e pode
ser **instalado na tela inicial** como um aplicativo (PWA).

- Abre em segundos, sem cadastro, sem anúncios.
- Detecta a frequência pelo microfone com **precisão abaixo de 1 cent**.
- Funciona **sem internet** depois do primeiro acesso.
- Nenhum áudio é gravado, salvo ou enviado: toda a análise acontece no aparelho.

Feito com **HTML, CSS e JavaScript puro**. Não precisa instalar nada nem rodar build.

---

## Como usar

1. Abra o endereço (precisa ser `https://` — exigência dos navegadores para o microfone).
2. Toque em **Começar** e permita o microfone.
3. Toque uma corda solta. O Afina mostra a nota, a frequência, o desvio em cents e
   se a corda está **grave**, **afinada** ou **aguda**.

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
| Afinações | Padrão (E A D G B E), Drop D, DADGAD, Meio tom abaixo (E♭), Open G, Open D |
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
│   │   ├── music.js        Frequência ⇄ nota ⇄ cents, nomes em português
│   │   ├── tunings.js      Catálogo de afinações  ← adicione novas aqui
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
│       └── screens/        Introdução, permissão, afinador, afinações, configurações, sobre
└── tests/                  Testes automatizados (node --test)
```

### Adicionar uma afinação

Inclua um objeto em `js/core/tunings.js` (notas da 6ª para a 1ª corda):

```js
{ id: 'open-e', name: 'Open E', notes: ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'] },
```

Ela aparece automaticamente na tela de afinações e funciona nos dois modos.

### Publicar uma nova versão

Ao mudar qualquer arquivo, aumente `CACHE_VERSION` em `sw.js` (e `APP_VERSION` em
`js/version.js`) para que os aparelhos baixem a versão nova. Se criar um arquivo
novo, inclua-o na lista `ASSETS` do `sw.js` — um teste avisa se faltar algum.

---

## Como a detecção funciona

1. O áudio do microfone passa por filtros (corta abaixo de 45 Hz e acima de 1,4 kHz),
   com cancelamento de eco, supressão de ruído e ganho automático **desligados**
   (eles distorcem a nota).
2. ~33 vezes por segundo, o **YIN** estima a frequência fundamental em uma janela de
   ~50 ms, com interpolação parabólica e correção de oitava (o Mi grave costuma chegar
   ao microfone do celular com o 2º harmônico mais forte que a fundamental).
3. O **motor** só aceita uma nota nova após leituras consistentes, descarta leituras
   isoladas, aplica mediana + suavização adaptativa e só troca de zona quando ela se
   mantém por um instante — o ponteiro não treme e a nota não fica pulando.
4. No modo automático, se a frequência estiver no meio do caminho entre duas cordas,
   o app **não chuta**: pede para tocar a corda novamente.
5. "Afinado" é confirmado após ~0,35 s estável dentro da tolerância.
