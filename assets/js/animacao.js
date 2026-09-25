/* =============================================================
   Animação de entrada: ao abrir a página, textos, fotos, botões e
   produtos sobem de baixo e param no seu lugar, um depois do outro.
   O que está mais abaixo sobe quando a pessoa rola até lá.
   Quem pediu ao celular para reduzir animações vê tudo parado.
   Normalmente você NÃO precisa editar este arquivo.
   ============================================================= */
(function () {
  "use strict";

  const reduzir =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzir) return;

  // Peças que sobem, na ordem em que aparecem na página
  const PECAS = [
    ".arco", ".capa__nome", ".frases", ".social",
    ".botao-marca",
    ".topo", ".loja__hero",
    ".vitrine__cabecalho", ".busca", ".chips__titulo", ".chip",
    ".secao__cabecalho", ".card", ".nota-precos",
    ".vazio", ".botao-loja",
    ".rodape > *"
  ].join(",");

  const PASSO = 110;      // intervalo entre uma peça e a próxima (ms)
  const MAX_ATRASO = 1300; // ninguém espera mais que isso para subir

  const pecas = Array.from(document.querySelectorAll(PECAS)).filter(
    (el) => !el.closest("[hidden]")
  );

  // Tira a animação antiga para cada peça seguir um só ritmo
  pecas.forEach((el) => {
    el.classList.remove("revelar");
    el.style.removeProperty("--i");
  });

  function subir(el, atraso) {
    el.style.setProperty("--atraso", `${Math.min(atraso, MAX_ATRASO)}ms`);
    el.classList.remove("subir-espera");
    el.classList.add("subir");
  }

  // Quando a animação acaba, limpa as classes para o toque e o
  // passar do dedo nos botões voltarem a funcionar normalmente
  document.addEventListener("animationend", (e) => {
    if (e.animationName !== "subir") return;
    const el = e.target;
    el.classList.remove("subir", "revelar");
    el.style.removeProperty("--atraso");
  });

  const alturaTela = window.innerHeight || document.documentElement.clientHeight;
  const naTela = [];
  const abaixo = [];
  pecas.forEach((el) => {
    const topo = el.getBoundingClientRect().top;
    (topo < alturaTela * 0.95 ? naTela : abaixo).push(el);
  });

  // 1) O que já está na tela sobe ao abrir, em sequência
  naTela.forEach((el, i) => subir(el, i * PASSO));

  // 2) O resto espera lá embaixo e sobe quando a pessoa rola até ele.
  //    Tudo que já passou pela tela (mesmo num pulo rápido) também sobe.
  if (!abaixo.length) return;
  let esperando = abaixo.slice();
  esperando.forEach((el) => el.classList.add("subir-espera"));

  let agendado = false;
  function conferir() {
    agendado = false;
    const alturaAgora = window.innerHeight || document.documentElement.clientHeight;
    // a peça que espera está 90px mais baixa (translateY): desconta isso
    const limite = alturaAgora * 0.94 + 90;
    const noFim = window.scrollY + alturaAgora >= document.documentElement.scrollHeight - 4;
    let ordem = 0;
    esperando = esperando.filter((el) => {
      if (!el.isConnected) return false;
      if (noFim || el.getBoundingClientRect().top < limite) {
        subir(el, ordem++ * PASSO);
        return false;
      }
      return true;
    });
    if (!esperando.length) {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    }
  }
  function agendar() {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(conferir);
  }
  window.addEventListener("scroll", agendar, { passive: true });
  window.addEventListener("resize", agendar);
})();
