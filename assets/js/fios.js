/* =============================================================
   Mechas de cabelo desenhadas no fundo de todas as páginas.
   É só decoração: fica atrás do conteúdo e não recebe toques.
   Os fios balançam devagar, e ficam parados para quem pediu ao
   celular para reduzir animações.
   Normalmente você NÃO precisa editar este arquivo.
   ============================================================= */
(function () {
  "use strict";

  const canvas = document.createElement("canvas");
  canvas.className = "fios";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduzir =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tons de cabelo: castanho escuro, castanho, mel, caramelo e loiro.
  const CORES = [
    [51, 33, 26],
    [106, 66, 40],
    [160, 110, 64],
    [205, 158, 99],
    [238, 208, 156]
  ];
  // Reflexos dourados que brilham entre os fios.
  const OURO = [[201, 162, 78], [236, 206, 128]];

  // Sorteio com semente fixa: o desenho sai sempre igual.
  let semente = 11;
  const sorteio = () => (semente = (semente * 16807) % 2147483647) / 2147483647;

  /* Cada mecha é uma curva (em frações da tela) que se abre nas pontas.
     esp = largura da mecha em relação ao menor lado da tela. */
  function criarMecha(pontos, quantidade, esp) {
    const fios = [];
    for (let i = 0; i < quantidade; i++) {
      const reflexo = sorteio() < 0.22;
      fios.push({
        d: i / (quantidade - 1) - 0.5 + (sorteio() - 0.5) * 0.12,
        j: [0, 1, 2, 3].map(() => (sorteio() - 0.5) * 0.35),
        cor: reflexo ? OURO[Math.floor(sorteio() * 2)] : CORES[Math.floor(sorteio() * 4)],
        alfa: reflexo ? 0.55 + sorteio() * 0.3 : 0.1 + sorteio() * 0.2,
        largura: reflexo ? 0.7 : 0.5 + sorteio() * 1.1,
        fase: sorteio() * Math.PI * 2
      });
    }
    return { pontos, fios, esp };
  }

  const mechas = [
    // Mecha de cima: entra pela esquerda, passa atrás da foto e sai pela direita
    criarMecha([[-0.2, 0.06], [0.38, -0.08], [0.52, 0.42], [1.2, 0.2]], 46, 0.2),
    // Mecha de baixo: entra pela direita e cai para a esquerda
    criarMecha([[1.2, 0.6], [0.62, 0.5], [0.4, 1.02], [-0.2, 0.84]], 38, 0.18)
  ];

  // Pó de ouro: pontinhos que cintilam em volta das mechas.
  const brilhos = [];
  for (let i = 0; i < 46; i++) {
    const mecha = mechas[i % mechas.length];
    brilhos.push({
      mecha,
      t: sorteio(),                       // posição ao longo da mecha
      d: (sorteio() - 0.5) * 1.6,         // distância do centro da mecha
      raio: 0.6 + sorteio() * 1.6,
      fase: sorteio() * Math.PI * 2,
      ritmo: 0.6 + sorteio() * 0.9
    });
  }

  // Ponto de uma curva de Bézier cúbica
  function bezier(P, t) {
    const u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return [
      a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0],
      a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1]
    ];
  }

  function desenharBrilhos(tempo, lado) {
    for (const b of brilhos) {
      const P = b.mecha.pontos.map(([x, y]) => [x * largura, y * altura]);
      const [x, y0] = bezier(P, b.t);
      const y = y0 + b.d * lado * b.mecha.esp * (0.4 + b.t);
      const luz = reduzir ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(tempo / 900 * b.ritmo + b.fase));
      const r = b.raio * (0.7 + luz * 0.5);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      g.addColorStop(0, `rgba(255, 244, 205, ${0.95 * luz})`);
      g.addColorStop(0.3, `rgba(226, 190, 110, ${0.6 * luz})`);
      g.addColorStop(1, "rgba(201, 162, 78, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Quanto cada ponto da curva se abre: raiz fechada, pontas soltas.
  const ABERTURA = [0.35, 0.8, 1.15, 1.7];

  let largura = 0;
  let altura = 0;

  function ajustarTamanho() {
    const caixa = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = caixa.width || window.innerWidth;
    altura = caixa.height || window.innerHeight;
    canvas.width = Math.round(largura * dpr);
    canvas.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
  }

  function desenhar(tempo) {
    ctx.clearRect(0, 0, largura, altura);
    const lado = Math.min(largura, altura * 0.8);
    for (const mecha of mechas) {
      const esp = lado * mecha.esp;
      const P = mecha.pontos.map(([x, y]) => [x * largura, y * altura]);
      for (const fio of mecha.fios) {
        const balanco = reduzir ? 0 : Math.sin(tempo / 2800 + fio.fase) * 7;
        const ponto = (i) => [
          P[i][0] + fio.j[i] * esp * 0.4,
          P[i][1] + fio.d * esp * ABERTURA[i] + fio.j[i] * esp * 0.25 + balanco * (i / 3) * 1.4
        ];
        const [a, b, c, d] = [ponto(0), ponto(1), ponto(2), ponto(3)];
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.bezierCurveTo(b[0], b[1], c[0], c[1], d[0], d[1]);
        ctx.strokeStyle = `rgba(${fio.cor.join(",")},${fio.alfa})`;
        ctx.lineWidth = fio.largura;
        ctx.stroke();
      }
    }
    desenharBrilhos(tempo, lado);
  }

  let quadro = 0;
  function animar(tempo) {
    desenhar(tempo);
    quadro = requestAnimationFrame(animar);
  }

  function iniciar() {
    ajustarTamanho();
    if (reduzir) {
      desenhar(0);
      return;
    }
    cancelAnimationFrame(quadro);
    quadro = requestAnimationFrame(animar);
  }

  let espera;
  window.addEventListener("resize", () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      ajustarTamanho();
      if (reduzir) desenhar(0);
    }, 120);
  });

  // Economiza bateria: para de desenhar quando a aba fica escondida.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(quadro);
    else if (!reduzir) quadro = requestAnimationFrame(animar);
  });

  iniciar();
})();
