/* =============================================================
   FAVORITOS (guardados no navegador do visitante)
   ============================================================= */
(function () {
  'use strict';

  var V = window.Vitrine;
  var h = V.h;
  var cat = V.catalogo();
  var area = document.querySelector('[data-area]');
  var contagem = document.querySelector('[data-contagem]');
  var botaoLimpar = document.querySelector('[data-limpar]');
  var primeira = true;

  function render() {
    var ids = V.favoritos.lista();
    var produtos = ids.map(function (id) { return cat.porId[id]; }).filter(Boolean);
    var foraDaVitrine = ids.length - produtos.length;
    area.textContent = '';
    botaoLimpar.hidden = !ids.length;
    contagem.textContent = produtos.length ? (produtos.length === 1 ? '1 produto salvo' : produtos.length + ' produtos salvos') : '';
    if (foraDaVitrine > 0) {
      contagem.textContent += (produtos.length ? ' · ' : '') + (foraDaVitrine === 1 ? '1 item salvo saiu da vitrine' : foraDaVitrine + ' itens salvos saíram da vitrine');
    }

    if (!produtos.length) {
      var sugestoes = cat.produtos.filter(function (p) { return p.destaque; }).slice(0, 4);
      area.appendChild(h('div', { class: 'estado' }, [
        h('span', { class: 'estado__icone' }, V.icone('coracao')),
        h('h2', null, 'Nenhum favorito por enquanto'),
        h('p', null, 'Toque no coração de um produto para guardar aqui e comparar com calma depois.'),
        h('div', { class: 'estado__acoes' }, h('a', { class: 'botao botao--escuro', href: V.url.pagina('catalogo.html') }, 'Explorar o catálogo'))
      ]));
      if (sugestoes.length) {
        area.appendChild(h('section', { 'aria-labelledby': 'titulo-sugestoes', style: { 'padding-bottom': 'var(--secao)' } }, [
          h('h2', { class: 'titulo-secao', id: 'titulo-sugestoes', style: { 'font-size': 'var(--t-xl)', 'margin-bottom': '24px' } }, 'Para começar'),
          h('div', { class: 'grade' }, sugestoes.map(function (p, i) { return V.cartao(p, { indice: i, origem: 'favoritos-sugestao', revelar: primeira }); }))
        ]));
      }
    } else {
      area.appendChild(h('div', { class: 'grade' }, produtos.map(function (p, i) {
        return V.cartao(p, { indice: i, origem: 'favoritos', revelar: primeira, tituloTag: 'h2' });
      })));
    }
    if (primeira) V.revelar(area);
    primeira = false;
  }

  botaoLimpar.addEventListener('click', function () {
    if (window.confirm('Remover todos os produtos dos favoritos?')) {
      V.favoritos.limpar();
      V.avisar('Lista de favoritos limpa');
    }
  });
  document.addEventListener('vitrine:favoritos', function () {
    var foco = document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-produto]');
    render();
    if (foco) {
      var primeiro = area.querySelector('.cartao__link') || document.querySelector('h1');
      if (primeiro) primeiro.focus({ preventScroll: true });
    }
  });

  render();
})();
