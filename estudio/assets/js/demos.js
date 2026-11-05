/*
 * Demonstrações conceituais da galeria
 * ---------------------------------------------------------------
 * Cada demonstração é um mini-site completo, com estrutura, tipografia,
 * paleta e interações próprias. Todas as marcas, produtos e preços são
 * fictícios e aparecem identificados como "demonstração conceitual".
 *
 * As fotos vêm do Unsplash (licença gratuita). Para trocar uma foto,
 * altere o código em FOTOS. Se alguma não carregar, o espaço mostra um
 * fundo de cor coerente com a demonstração (nunca um ícone quebrado).
 */
(function () {
  "use strict";

  var FOTOS = {
    pizza1: "1513104890138-7c749659a591",
    pizza2: "1565299624946-b28f40a0ae38",
    pizza3: "1574071318508-1cdbab80d002",
    pizza4: "1593560708920-61dd98c46a4e",
    burger1: "1568901346375-23c9450c58cd",
    burger2: "1550547660-d9450f859349",
    burger3: "1571091718767-18b5b1457add",
    burger4: "1553979459-d2229ba7433b",
    fritas: "1573080496219-bb080dd4f877",
    rest1: "1517248135467-4c7edcad34c4",
    rest2: "1414235077428-338989a2e8c0",
    prato1: "1504674900247-0877df9cc836",
    prato2: "1546069901-ba9599a7e63c",
    prato3: "1540189549336-e6e99c3679fe",
    bolo1: "1578985545062-69928b1d9587",
    bolo2: "1563729784474-d77dbb933a9e",
    donut: "1551024601-bec78aea704b",
    doce3: "1488477181946-6428a0291777",
    moda1: "1515886657613-9f3515b0c78f",
    moda2: "1445205170230-053b83016050",
    moda3: "1441986300917-64674bd600d8",
    moda4: "1490481651871-ab68de25d43d",
    moda5: "1483985988355-763728e1935b",
    cosm1: "1556228578-8c89e6adf883",
    cosm2: "1522335789203-aabd1fc54bc9",
    cosm3: "1571781926291-c477ebfd024b",
    clin1: "1519494026892-80bbd2d6fd0d",
    clin2: "1576091160399-112ba8d25d1d",
    clin3: "1579684385127-1ef15d508118",
    spa1: "1544161515-4ab6ce6db874",
    spa2: "1540555700478-4be289fbecef",
    spa3: "1570172619644-dfd03ed5d881",
    limp1: "1581578731548-c64695cc6952",
    limp2: "1527515637462-cff94eecc1ac",
    obra1: "1504307651254-35680f356dfd",
    obra2: "1541888946425-d81bb19240f5",
    obra3: "1503387762-592deb58ef4e",
    casa1: "1600585154340-be6161a56a0c",
    casa2: "1600210492486-724fe5c67fb0",
    agro1: "1625246333195-78d9c38ad449",
    agro2: "1500937386664-56d1dfef3854",
    agro3: "1464226184884-fa280b87c399",
    agro4: "1574943320219-553eb213f72d"
  };

  function url(chave, largura) {
    return "https://images.unsplash.com/photo-" + FOTOS[chave] +
      "?auto=format&fit=crop&w=" + (largura || 900) + "&q=70";
  }

  /* Foto com fundo de segurança (classe dm-ph). */
  function foto(chave, alt, classe, largura) {
    return '<div class="dm-ph ' + (classe || "") + '"><img src="' + url(chave, largura) +
      '" alt="' + alt + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.classList.add(\'is-broken\')"></div>';
  }

  function brl(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
  }
  function preco(v) { return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  var CART = '<div class="dm-cart" role="status" aria-live="polite">' +
    '<span class="dm-cart__info"><b data-cart-count>0</b> <span data-cart-label>itens</span> · <b data-cart-total>R$ 0,00</b></span>' +
    '<button type="button" class="dm-cart__btn" data-acao="Na versão real, este botão abre o WhatsApp da empresa com o pedido completo já escrito.">Finalizar pelo WhatsApp</button></div>';

  /* ============================================================
   * GASTRONOMIA
   * ============================================================ */

  function pizzaria() {
    function item(nome, desc, v, img) {
      return '<article class="pz-item">' + foto(img, "Pizza " + nome, "pz-item__img", 400) +
        '<div class="pz-item__txt"><h4>' + nome + '</h4><p>' + desc + '</p>' +
        '<div class="pz-item__row"><span class="pz-item__preco">' + preco(v) + '</span>' +
        '<button type="button" class="pz-add" data-add data-name="' + nome + '" data-price="' + v + '" aria-label="Adicionar ' + nome + '">+</button></div></div></article>';
    }
    return '' +
      '<header class="pz-top"><span class="pz-logo">Forno <i>Brasa</i></span>' +
      '<nav class="pz-nav"><button type="button" data-goto="cardapio">Cardápio</button><button type="button" data-goto="monte">Monte a sua</button><button type="button" data-goto="entrega">Entrega</button></nav>' +
      '<button type="button" class="pz-btn pz-btn--sm" data-goto="cardapio">Pedir agora</button></header>' +

      '<section class="pz-hero">' + foto("pizza1", "Pizza artesanal saindo do forno", "pz-hero__img", 1600) +
      '<div class="pz-hero__txt"><p class="pz-kicker">Pizzaria de bairro · forno a lenha</p>' +
      '<h1>Massa de 48 horas.<br><i>Borda que estala.</i></h1>' +
      '<p>Fermentação lenta, molho de tomate pelati e ingredientes separados no mesmo dia.</p>' +
      '<div class="pz-hero__cta"><button type="button" class="pz-btn" data-goto="cardapio">Ver cardápio</button>' +
      '<button type="button" class="pz-btn pz-btn--ghost" data-acao="Na versão real, abre o WhatsApp da pizzaria com uma mensagem pronta.">Pedir pelo WhatsApp</button></div></div>' +
      '<ul class="pz-strip"><li><b>Hoje</b> 18h às 23h30</li><li><b>Entrega</b> média de 40 min</li><li><b>Retirada</b> no balcão</li></ul></section>' +

      '<section class="pz-menu" data-sec="cardapio" data-tabset><div class="pz-menu__head"><h2>Cardápio</h2>' +
      '<div class="pz-tabs" role="tablist"><button type="button" role="tab" class="is-on" aria-selected="true" data-tab="trad">Tradicionais</button>' +
      '<button type="button" role="tab" aria-selected="false" data-tab="esp">Especiais</button><button type="button" role="tab" aria-selected="false" data-tab="doce">Doces</button></div></div>' +
      '<div class="pz-grid" data-panel="trad">' +
      item("Margherita", "Molho pelati, muçarela de búfala, manjericão fresco e azeite.", 62, "pizza3") +
      item("Calabresa da casa", "Calabresa fatiada fina, cebola roxa e orégano.", 58, "pizza4") +
      item("Quatro queijos", "Muçarela, gorgonzola, parmesão e provolone.", 66, "pizza2") +
      item("Portuguesa", "Presunto, ovos, cebola, ervilha e azeitonas pretas.", 64, "pizza1") +
      '</div><div class="pz-grid" data-panel="esp" hidden>' +
      item("Brasa", "Linguiça artesanal, pimenta biquinho e mel picante.", 74, "pizza2") +
      item("Burrata", "Burrata inteira, tomate confit e pesto de manjericão.", 82, "pizza3") +
      item("Funghi", "Mix de cogumelos, creme de parmesão e tomilho.", 76, "pizza1") +
      '</div><div class="pz-grid" data-panel="doce" hidden>' +
      item("Banana com canela", "Banana, açúcar mascavo, canela e muçarela.", 54, "pizza4") +
      item("Chocolate e morango", "Chocolate meio amargo e morangos frescos.", 59, "pizza2") +
      '</div></section>' +

      '<section class="pz-monte" data-sec="monte" data-calc data-base="0"><div class="pz-monte__txt"><p class="pz-kicker">Monte a sua</p><h2>Do seu jeito, <i>meio a meio</i> se quiser.</h2>' +
      '<p>Escolha o tamanho e a borda. O valor aparece na hora.</p></div><div class="pz-monte__form">' +
      '<p class="pz-label">Tamanho</p><div class="pz-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="48" data-label="Broto">Broto <small>4 fatias</small></button>' +
      '<button type="button" data-pick data-price="58" data-label="Média">Média <small>6 fatias</small></button><button type="button" data-pick data-price="68" data-label="Grande">Grande <small>8 fatias</small></button></div>' +
      '<p class="pz-label">Borda</p><div class="pz-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="0" data-label="Tradicional">Tradicional</button>' +
      '<button type="button" data-pick data-price="9" data-label="Catupiry">Catupiry <small>+ R$ 9</small></button><button type="button" data-pick data-price="11" data-label="Cheddar">Cheddar <small>+ R$ 11</small></button></div>' +
      '<div class="pz-monte__total"><span data-calc-summary>Broto · Tradicional</span><b data-calc-total>R$ 48,00</b></div>' +
      '<button type="button" class="pz-btn" data-add-calc data-name="Pizza montada">Adicionar ao pedido</button></div></section>' +

      '<section class="pz-entrega" data-sec="entrega"><div><p class="pz-kicker">Entrega</p><h2>Chega quente.<br><i>Sem surpresa na taxa.</i></h2></div>' +
      '<ul class="pz-bairros"><li><span>Centro</span><b>R$ 5,00</b></li><li><span>Jardim das Flores</span><b>R$ 7,00</b></li><li><span>Vila Nova</span><b>R$ 8,00</b></li><li><span>Parque Industrial</span><b>R$ 10,00</b></li></ul>' +
      '<div class="pz-horario"><p><b>Terça a domingo</b><br>18h às 23h30</p><p><b>Segunda</b><br>fechado</p></div></section>' +
      '<footer class="pz-foot"><span class="pz-logo">Forno <i>Brasa</i></span><span>Rua Exemplo, 120 · Centro</span></footer>' + CART;
  }

  function hamburgueria() {
    function linha(n, nome, desc, v, img) {
      return '<li class="hb-row">' + foto(img, nome, "hb-row__img", 400) + '<span class="hb-row__n">' + n + '</span><div class="hb-row__txt"><h4>' + nome + '</h4><p>' + desc + '</p></div>' +
        '<span class="hb-row__preco">' + preco(v) + '</span><button type="button" class="hb-add" data-add data-name="' + nome + '" data-price="' + v + '">Adicionar</button></li>';
    }
    return '' +
      '<div class="hb-ticker" aria-hidden="true"><span>Smash na chapa · Pão brioche da casa · Molho secreto · Batata rústica · </span><span>Smash na chapa · Pão brioche da casa · Molho secreto · Batata rústica · </span></div>' +
      '<header class="hb-top"><span class="hb-logo">CHAPA<b>77</b></span><nav class="hb-nav"><button type="button" data-goto="menu">Menu</button><button type="button" data-goto="combo">Combo</button></nav>' +
      '<button type="button" class="hb-btn" data-goto="menu">Peça já</button></header>' +
      '<section class="hb-hero"><h1><span>Smash</span><span class="hb-out">sem</span><span>pressa.</span></h1>' +
      foto("burger1", "Hambúrguer smash com cheddar", "hb-hero__img", 1000) +
      '<div class="hb-sticker"><small>Combo da semana</small><b>R$ 39</b></div>' +
      '<p class="hb-hero__p">Carne prensada na chapa bem quente, crosta caramelizada e queijo derretido por cima. Do jeito que tem que ser.</p></section>' +
      '<section class="hb-menu" data-sec="menu"><div class="hb-menu__head"><h2>O menu</h2><p>Todos acompanham batata rústica.</p></div><ol class="hb-list">' +
      linha("01", "Clássico", "Pão brioche, 2 smash de 90 g, cheddar e picles.", 32, "burger2") +
      linha("02", "Bacon duplo", "2 smash, bacon crocante, cheddar e maionese defumada.", 38, "burger1") +
      linha("03", "Cebola caramelizada", "Smash de 160 g, queijo prato e cebola na manteiga.", 36, "burger3") +
      linha("04", "Da casa", "3 smash, cheddar triplo e molho secreto.", 44, "burger4") +
      '</ol></section>' +
      '<section class="hb-combo" data-sec="combo" data-calc data-base="0"><h2>Monte o <span>combo</span></h2><div class="hb-steps">' +
      '<div><p class="hb-step">1 · Burger</p><div class="hb-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="32" data-label="Clássico">Clássico</button><button type="button" data-pick data-price="38" data-label="Bacon duplo">Bacon duplo</button><button type="button" data-pick data-price="44" data-label="Da casa">Da casa</button></div></div>' +
      '<div><p class="hb-step">2 · Lado</p><div class="hb-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="0" data-label="Batata rústica">Rústica</button><button type="button" data-pick data-price="8" data-label="Batata com cheddar">Com cheddar</button><button type="button" data-pick data-price="10" data-label="Onion rings">Onion rings</button></div></div>' +
      '<div><p class="hb-step">3 · Bebida</p><div class="hb-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="0" data-label="Sem bebida">Sem</button><button type="button" data-pick data-price="7" data-label="Refrigerante">Refri</button><button type="button" data-pick data-price="12" data-label="Milk-shake">Shake</button></div></div>' +
      '</div><div class="hb-combo__total"><span data-calc-summary>Clássico · Batata rústica · Sem bebida</span><b data-calc-total>R$ 32,00</b><button type="button" class="hb-btn" data-add-calc data-name="Combo">Quero esse</button></div></section>' +
      '<section class="hb-fritas">' + foto("fritas", "Batata frita rústica", "hb-fritas__img", 900) + '<div><h2>Delivery próprio<br>ou retirada.</h2><p>Terça a domingo · 18h às 23h</p></div></section>' +
      '<footer class="hb-foot"><span class="hb-logo">CHAPA<b>77</b></span><span>@chapa77 · exemplo</span></footer>' + CART;
  }

  function restaurante() {
    function prato(nome, desc, v) {
      return '<li><div class="rs-dish"><span>' + nome + '</span><i></i><b>' + v + '</b></div><p>' + desc + '</p></li>';
    }
    return '' +
      '<header class="rs-top"><nav><button type="button" data-goto="menu">Menu</button><button type="button" data-goto="casa">A casa</button></nav>' +
      '<span class="rs-logo">Casa Alecrim</span><button type="button" class="rs-link" data-goto="reserva">Reservar mesa</button></header>' +
      '<section class="rs-hero"><div class="rs-hero__txt"><p class="rs-kicker">Cozinha de estação</p><h1>Ingredientes do dia, <em>servidos sem pressa.</em></h1>' +
      '<p>Um menu curto que muda com a estação, pensado para ser dividido à mesa.</p><button type="button" class="rs-btn" data-goto="reserva">Reservar uma mesa</button></div>' +
      foto("rest1", "Salão do restaurante à meia-luz", "rs-hero__img", 1200) + '</section>' +
      '<section class="rs-menu" data-sec="menu"><h2>Menu de <em>outono</em></h2><div class="rs-cols">' +
      '<div><h3>Para começar</h3><ul>' + prato("Burrata e tomates assados", "Azeite de manjericão e pão de fermentação natural.", "58") + prato("Croquetas de cogumelos", "Aioli de limão-siciliano.", "42") + '</ul>' +
      '<h3>Sobremesas</h3><ul>' + prato("Pudim de doce de leite", "Calda de café.", "32") + '</ul></div>' +
      '<div><h3>Principais</h3><ul>' + prato("Risoto de abóbora", "Sálvia na manteiga e parmesão 24 meses.", "84") + prato("Peixe da estação", "Purê de mandioquinha e beurre blanc.", "112") + prato("Ancho na brasa", "Batatas confitadas e chimichurri.", "136") + '</ul></div></div>' +
      '<div class="rs-photos">' + foto("prato1", "Prato servido com legumes", "", 700) + foto("rest2", "Mesa posta com pratos", "", 700) + foto("prato3", "Prato colorido da estação", "", 700) + '</div></section>' +
      '<section class="rs-casa" data-sec="casa"><p class="rs-quote">“Cozinhar o que a estação oferece, com calma e respeito ao ingrediente.”</p><p class="rs-sign">Nota da cozinha · texto de exemplo</p></section>' +
      '<section class="rs-reserva" data-sec="reserva" data-calc><div><p class="rs-kicker">Reservas</p><h2>Escolha sua <em>noite.</em></h2><p>Confirmação pelo WhatsApp em poucos minutos.</p></div><div class="rs-form">' +
      '<p class="rs-label">Dia</p><div class="rs-chips" data-pickgroup><button type="button" data-pick data-label="Qui, 14">Qui <b>14</b></button><button type="button" class="is-on" data-pick data-label="Sex, 15">Sex <b>15</b></button><button type="button" data-pick data-label="Sáb, 16">Sáb <b>16</b></button><button type="button" data-pick data-label="Dom, 17">Dom <b>17</b></button></div>' +
      '<p class="rs-label">Horário</p><div class="rs-chips rs-chips--h" data-pickgroup><button type="button" data-pick data-label="19h30">19h30</button><button type="button" class="is-on" data-pick data-label="20h30">20h30</button><button type="button" data-pick data-label="21h30">21h30</button></div>' +
      '<p class="rs-label">Pessoas</p><div class="rs-qty"><button type="button" data-qty="-1" aria-label="Menos pessoas">−</button><span data-qty-val data-label-suffix=" pessoas">2</span><button type="button" data-qty="1" aria-label="Mais pessoas">+</button></div>' +
      '<p class="rs-resumo" data-calc-summary>Sex, 15 · 20h30</p>' +
      '<button type="button" class="rs-btn" data-acao="Na versão real, a solicitação de reserva chega no WhatsApp do restaurante com dia, horário e número de pessoas.">Solicitar reserva</button></div></section>' +
      '<footer class="rs-foot"><span class="rs-logo">Casa Alecrim</span><span>Quarta a domingo · 19h às 23h</span><span>Rua Exemplo, 88</span></footer>';
  }

  function doceria() {
    return '' +
      '<header class="dc-top"><span class="dc-logo">Ateliê <em>Cacau</em></span><nav><button type="button" data-goto="doces">Doces</button><button type="button" data-goto="encomenda">Encomendas</button></nav>' +
      '<button type="button" class="dc-btn dc-btn--sm" data-goto="encomenda">Encomendar</button></header>' +
      '<section class="dc-hero"><div class="dc-hero__txt"><p class="dc-kicker">Confeitaria artesanal</p><h1>Bolos que viram <em>lembrança.</em></h1>' +
      '<p>Receitas de família, feitas por encomenda para aniversários, casamentos e cafés da tarde.</p>' +
      '<button type="button" class="dc-btn" data-goto="encomenda">Fazer uma encomenda</button></div>' +
      '<div class="dc-arch">' + foto("bolo1", "Bolo de chocolate decorado", "", 900) + '</div><span class="dc-seal">feito<br>à mão</span></section>' +
      '<section class="dc-doces" data-sec="doces"><h2>Da vitrine</h2><div class="dc-grid">' +
      '<article>' + foto("bolo2", "Bolo de aniversário", "", 600) + '<h4>Bolo de festa</h4><p>a partir de ' + preco(120) + '</p><button type="button" class="dc-mini" data-add data-name="Bolo de festa" data-price="120">Adicionar</button></article>' +
      '<article>' + foto("donut", "Donuts confeitados", "", 600) + '<h4>Donuts recheados</h4><p>caixa com 6 · ' + preco(48) + '</p><button type="button" class="dc-mini" data-add data-name="Donuts" data-price="48">Adicionar</button></article>' +
      '<article>' + foto("doce3", "Taça de doce com frutas vermelhas", "", 600) + '<h4>Taça de frutas vermelhas</h4><p>individual · ' + preco(22) + '</p><button type="button" class="dc-mini" data-add data-name="Taça de frutas vermelhas" data-price="22">Adicionar</button></article>' +
      '</div></section>' +
      '<section class="dc-enc" data-sec="encomenda" data-calc data-base="0"><div class="dc-enc__head"><p class="dc-kicker">Encomenda em 3 passos</p><h2>Monte o seu <em>bolo.</em></h2></div><ol class="dc-passos">' +
      '<li><span>1</span><p>Sabor</p><div class="dc-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="0" data-label="Chocolate belga">Chocolate belga</button><button type="button" data-pick data-price="10" data-label="Ninho com morango">Ninho com morango</button><button type="button" data-pick data-price="15" data-label="Pistache">Pistache</button></div></li>' +
      '<li><span>2</span><p>Tamanho</p><div class="dc-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="120" data-label="15 fatias">15 fatias</button><button type="button" data-pick data-price="180" data-label="25 fatias">25 fatias</button><button type="button" data-pick data-price="260" data-label="40 fatias">40 fatias</button></div></li>' +
      '<li><span>3</span><p>Retirada</p><div class="dc-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="0" data-label="Retirar na loja">Na loja</button><button type="button" data-pick data-price="15" data-label="Entrega">Entrega</button></div></li></ol>' +
      '<div class="dc-total"><span data-calc-summary>Chocolate belga · 15 fatias · Retirar na loja</span><b data-calc-total>R$ 120,00</b>' +
      '<button type="button" class="dc-btn" data-acao="Na versão real, a encomenda chega no WhatsApp da confeitaria com sabor, tamanho e forma de retirada.">Enviar encomenda</button></div>' +
      '<p class="dc-nota">Encomendas com 48 horas de antecedência.</p></section>' +
      '<footer class="dc-foot"><span class="dc-logo">Ateliê <em>Cacau</em></span><span>Terça a sábado · 9h às 19h</span></footer>' + CART;
  }

  /* ============================================================
   * MODA E VAREJO
   * ============================================================ */

  function moda() {
    function peca(cat, nome, v, img) {
      return '<article class="vs-card" data-cat="' + cat + '">' + foto(img, nome, "vs-card__img", 600) +
        '<div class="vs-card__row"><h4>' + nome + '</h4><span>' + preco(v) + '</span></div>' +
        '<div class="vs-sizes" data-pickgroup><button type="button" data-pick>P</button><button type="button" class="is-on" data-pick>M</button><button type="button" data-pick>G</button></div>' +
        '<button type="button" class="vs-add" data-add data-name="' + nome + '" data-price="' + v + '">Adicionar à sacola</button></article>';
    }
    return '' +
      '<p class="vs-bar">Frete grátis acima de R$ 299 · Troca fácil em 30 dias</p>' +
      '<header class="vs-top"><nav><button type="button" data-goto="colecao">Coleção</button><button type="button" data-goto="sobre">Sobre</button></nav>' +
      '<span class="vs-logo">VERSO</span><span class="vs-bag">Sacola (<b data-cart-count>0</b>)</span></header>' +
      '<section class="vs-hero">' + foto("moda1", "Modelo vestindo peça da coleção", "vs-hero__a", 1100) +
      '<div class="vs-hero__txt"><p>Coleção 04</p><h1>Linhas <em>simples,</em> caimento exato.</h1><button type="button" class="vs-link" data-goto="colecao">Ver a coleção →</button></div>' +
      foto("moda2", "Arara com roupas em tons neutros", "vs-hero__b", 700) + '</section>' +
      '<section class="vs-col" data-sec="colecao" data-filterset><div class="vs-col__head"><h2>A coleção</h2><div class="vs-filters">' +
      '<button type="button" class="is-on" data-filter="*">Tudo</button><button type="button" data-filter="vestidos">Vestidos</button><button type="button" data-filter="alfaiataria">Alfaiataria</button><button type="button" data-filter="basicos">Básicos</button></div></div><div class="vs-grid">' +
      peca("vestidos", "Vestido Ana", 289, "moda4") + peca("alfaiataria", "Blazer Reto", 419, "moda3") + peca("basicos", "Camisa Linho", 199, "moda5") +
      peca("alfaiataria", "Calça Pala", 259, "moda2") + peca("vestidos", "Vestido Lua", 319, "moda1") + peca("basicos", "Regata Canelada", 89, "moda4") +
      '</div></section>' +
      '<section class="vs-sobre" data-sec="sobre"><h2>Feito em pequenas tiragens, <em>pensado para durar.</em></h2><p>Peças desenhadas para combinar entre si e atravessar estações.</p></section>' +
      '<footer class="vs-foot"><span class="vs-logo">VERSO</span><span>Atendimento · Trocas · Instagram</span></footer>' + CART;
  }

  function cosmeticos() {
    function prod(nome, uso, v, img) {
      return '<article class="fl-prod">' + foto(img, nome, "fl-prod__img", 500) + '<p class="fl-prod__uso">' + uso + '</p><h4>' + nome + '</h4>' +
        '<div class="fl-prod__row"><span>' + preco(v) + '</span><button type="button" data-add data-name="' + nome + '" data-price="' + v + '">Comprar</button></div></article>';
    }
    function rotina(a, b, c) {
      return '<ol class="fl-rotina"><li><span>Limpar</span><b>' + a + '</b></li><li><span>Tratar</span><b>' + b + '</b></li><li><span>Proteger</span><b>' + c + '</b></li></ol>';
    }
    return '' +
      '<header class="fl-top"><span class="fl-logo">flora<em>pele</em></span><nav><button type="button" data-goto="rotina">Encontre sua rotina</button><button type="button" data-goto="produtos">Produtos</button></nav>' +
      '<span class="fl-bag">Sacola · <b data-cart-count>0</b></span></header>' +
      '<section class="fl-hero"><div class="fl-hero__txt"><h1>Cuidado diário, <em>sem complicação.</em></h1><p>Três passos, fórmulas leves e embalagens com refil.</p>' +
      '<button type="button" class="fl-btn" data-goto="rotina">Descobrir minha rotina</button></div>' + foto("cosm1", "Frascos de skincare sobre pedra", "fl-hero__img", 1000) + '</section>' +
      '<section class="fl-quiz" data-sec="rotina" data-tabset><p class="fl-kicker">Rotina em 1 clique</p><h2>Como é a sua pele?</h2>' +
      '<div class="fl-opts" role="tablist"><button type="button" role="tab" class="is-on" aria-selected="true" data-tab="seca">Seca</button><button type="button" role="tab" aria-selected="false" data-tab="mista">Mista</button><button type="button" role="tab" aria-selected="false" data-tab="oleosa">Oleosa</button><button type="button" role="tab" aria-selected="false" data-tab="sensivel">Sensível</button></div>' +
      '<div data-panel="seca">' + rotina("Gel cremoso de limpeza", "Sérum de hialurônico", "Hidratante FPS 30") + '</div>' +
      '<div data-panel="mista" hidden>' + rotina("Gel de limpeza suave", "Sérum de niacinamida", "Fluido FPS 50") + '</div>' +
      '<div data-panel="oleosa" hidden>' + rotina("Espuma purificante", "Tônico de ácido salicílico", "Gel FPS 50 toque seco") + '</div>' +
      '<div data-panel="sensivel" hidden>' + rotina("Leite de limpeza", "Sérum calmante", "Protetor mineral FPS 50") + '</div></section>' +
      '<section class="fl-prods" data-sec="produtos"><h2>Os essenciais</h2><div class="fl-grid">' +
      prod("Sérum Hialurônico", "Tratar", 89, "cosm3") + prod("Gel de Limpeza", "Limpar", 54, "cosm1") + prod("Fluido FPS 50", "Proteger", 79, "cosm2") +
      '</div></section>' +
      '<footer class="fl-foot"><span class="fl-logo">flora<em>pele</em></span><span>Envio para todo o Brasil</span></footer>' + CART;
  }

  /* ============================================================
   * SAÚDE E ESTÉTICA
   * ============================================================ */

  function clinica() {
    var esp = ["Clínica geral", "Cardiologia", "Dermatologia", "Pediatria", "Ginecologia", "Nutrição"];
    return '' +
      '<header class="cl-top"><span class="cl-logo"><i></i>Clínica Lumen</span><nav><button type="button" data-goto="esp">Especialidades</button><button type="button" data-goto="agenda">Agendamento</button><button type="button" data-goto="info">Como chegar</button></nav>' +
      '<button type="button" class="cl-btn cl-btn--sm" data-goto="agenda">Agendar consulta</button></header>' +
      '<section class="cl-hero"><div class="cl-hero__txt"><p class="cl-tag">Atendimento particular e convênios</p><h1>Cuidado completo,<br>perto de você.</h1>' +
      '<p>Consultas e exames no mesmo endereço, com agendamento simples e lembrete pelo WhatsApp.</p>' +
      '<div class="cl-hero__cta"><button type="button" class="cl-btn" data-goto="agenda">Agendar consulta</button><button type="button" class="cl-btn cl-btn--line" data-goto="esp">Ver especialidades</button></div></div>' +
      foto("clin2", "Consultório médico iluminado", "cl-hero__img", 1000) + '</section>' +
      '<section class="cl-esp" data-sec="esp"><h2>Especialidades</h2><div class="cl-esp__grid">' +
      esp.map(function (e, i) { return '<button type="button" class="cl-esp__item" data-goto="agenda"><span>0' + (i + 1) + '</span>' + e + '<i>→</i></button>'; }).join("") +
      '</div></section>' +
      '<section class="cl-agenda" data-sec="agenda" data-calc><div class="cl-agenda__head"><h2>Agende em menos de um minuto</h2><p>Escolha a especialidade, o dia e o horário. A recepção confirma com você.</p></div><div class="cl-agenda__box">' +
      '<p class="cl-label">Especialidade</p><div class="cl-chips" data-pickgroup>' + esp.slice(0, 4).map(function (e, i) { return '<button type="button"' + (i === 0 ? ' class="is-on"' : "") + ' data-pick data-label="' + e + '">' + e + '</button>'; }).join("") + '</div>' +
      '<p class="cl-label">Dia</p><div class="cl-chips cl-chips--d" data-pickgroup><button type="button" data-pick data-label="Seg, 11">Seg<b>11</b></button><button type="button" class="is-on" data-pick data-label="Ter, 12">Ter<b>12</b></button><button type="button" data-pick data-label="Qua, 13">Qua<b>13</b></button><button type="button" data-pick data-label="Qui, 14">Qui<b>14</b></button><button type="button" data-pick data-label="Sex, 15">Sex<b>15</b></button></div>' +
      '<p class="cl-label">Horário</p><div class="cl-chips" data-pickgroup><button type="button" data-pick data-label="8h00">8h00</button><button type="button" class="is-on" data-pick data-label="9h30">9h30</button><button type="button" data-pick data-label="14h00">14h00</button><button type="button" data-pick data-label="16h30">16h30</button></div>' +
      '<div class="cl-resumo"><span data-calc-summary>Clínica geral · Ter, 12 · 9h30</span><button type="button" class="cl-btn" data-acao="Na versão real, a solicitação chega para a recepção, que confirma o horário com o paciente.">Solicitar agendamento</button></div></div></section>' +
      '<section class="cl-info" data-sec="info"><div><h3>Endereço</h3><p>Av. Exemplo, 1000 · sala 12</p></div><div><h3>Horário</h3><p>Segunda a sexta, 7h às 19h<br>Sábado, 8h às 12h</p></div><div><h3>Convênios</h3><p>Consulte a lista atualizada pelo WhatsApp.</p></div></section>' +
      '<footer class="cl-foot"><span>Clínica Lumen · Responsável técnico: dados do profissional</span></footer>';
  }

  function estetica() {
    function trat(nome, dur, v) {
      return '<li class="ms-trat"><div><h4>' + nome + '</h4><p>' + dur + '</p></div><span>a partir de ' + preco(v) + '</span>' +
        '<button type="button" data-acao="Na versão real, abre o WhatsApp do espaço com o procedimento escolhido.">Reservar</button></li>';
    }
    return '' +
      '<header class="ms-top"><button type="button" data-goto="trat">Tratamentos</button><span class="ms-logo">Maison <em>Lis</em></span><button type="button" data-goto="visita">Primeira visita</button></header>' +
      '<section class="ms-hero">' + foto("spa1", "Ambiente de spa com toalhas e pedras", "ms-hero__img", 1600) +
      '<div class="ms-hero__txt"><p>Estética facial e corporal</p><h1>Um tempo <em>só seu.</em></h1><button type="button" class="ms-btn" data-goto="trat">Conhecer tratamentos</button></div></section>' +
      '<section class="ms-intro"><p>Protocolos personalizados depois de uma avaliação individual, em um ambiente pensado para desacelerar.</p>' + foto("spa3", "Cuidado facial", "ms-intro__img", 700) + '</section>' +
      '<section class="ms-trats" data-sec="trat" data-tabset><div class="ms-tabs" role="tablist"><button type="button" role="tab" class="is-on" aria-selected="true" data-tab="facial">Facial</button><button type="button" role="tab" aria-selected="false" data-tab="corporal">Corporal</button><button type="button" role="tab" aria-selected="false" data-tab="pacotes">Pacotes</button></div>' +
      '<ul data-panel="facial">' + trat("Limpeza de pele profunda", "75 minutos", 180) + trat("Revitalização com vitamina C", "50 minutos", 210) + trat("Hidratação intensiva", "45 minutos", 160) + '</ul>' +
      '<ul data-panel="corporal" hidden>' + trat("Drenagem linfática", "60 minutos", 150) + trat("Massagem relaxante", "60 minutos", 170) + '</ul>' +
      '<ul data-panel="pacotes" hidden>' + trat("Ritual facial · 4 sessões", "uma por semana", 620) + trat("Pausa completa", "facial + massagem", 300) + '</ul></section>' +
      '<section class="ms-visita" data-sec="visita"><h2>Sua <em>primeira</em> visita</h2><ol><li><b>I</b><p>Avaliação e conversa sobre seus objetivos.</p></li><li><b>II</b><p>Indicação do protocolo mais adequado.</p></li><li><b>III</b><p>Agendamento das sessões no horário que preferir.</p></li></ol>' +
      '<button type="button" class="ms-btn" data-acao="Na versão real, abre o WhatsApp do espaço para agendar a avaliação.">Agendar avaliação</button></section>' +
      '<footer class="ms-foot"><span class="ms-logo">Maison <em>Lis</em></span><span>Atendimento com hora marcada</span></footer>';
  }

  /* ============================================================
   * SERVIÇOS
   * ============================================================ */

  function limpeza() {
    return '' +
      '<header class="lp-top"><span class="lp-logo"><i></i>clara<b>.</b>limpeza</span><nav><button type="button" data-goto="calc">Orçamento</button><button type="button" data-goto="serv">Serviços</button></nav>' +
      '<button type="button" class="lp-btn lp-btn--sm" data-goto="calc">Calcular agora</button></header>' +
      '<section class="lp-hero"><div class="lp-hero__txt"><span class="lp-pill">Residencial · Comercial · Pós-obra</span><h1>Sua casa limpa,<br><span>sua agenda livre.</span></h1>' +
      '<ul class="lp-check"><li>Equipe uniformizada</li><li>Produtos inclusos</li><li>Horário marcado</li></ul>' +
      '<button type="button" class="lp-btn" data-goto="calc">Ver estimativa em 30 segundos</button></div>' + foto("limp1", "Profissional de limpeza organizando ambiente", "lp-hero__img", 1000) + '</section>' +
      '<section class="lp-calc" data-sec="calc" data-calc data-base="0"><h2>Estimativa rápida</h2><div class="lp-calc__grid"><div>' +
      '<p class="lp-label">Tipo de limpeza</p><div class="lp-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="160" data-label="Residencial">Residencial</button><button type="button" data-pick data-price="220" data-label="Comercial">Comercial</button><button type="button" data-pick data-price="380" data-label="Pós-obra">Pós-obra</button></div>' +
      '<p class="lp-label">Tamanho do imóvel</p><div class="lp-chips" data-pickgroup><button type="button" class="is-on" data-pick data-price="0" data-label="até 60 m²">até 60 m²</button><button type="button" data-pick data-price="60" data-label="60 a 120 m²">60 a 120 m²</button><button type="button" data-pick data-price="140" data-label="acima de 120 m²">+120 m²</button></div>' +
      '<p class="lp-label">Frequência</p><div class="lp-chips" data-pickgroup><button type="button" class="is-on" data-pick data-mult="1" data-label="Avulsa">Avulsa</button><button type="button" data-pick data-mult="0.9" data-label="Quinzenal">Quinzenal −10%</button><button type="button" data-pick data-mult="0.85" data-label="Semanal">Semanal −15%</button></div>' +
      '</div><div class="lp-result"><p>Estimativa a partir de</p><b data-calc-total>R$ 160,00</b><span data-calc-summary>Residencial · até 60 m² · Avulsa</span>' +
      '<button type="button" class="lp-btn" data-acao="Na versão real, a estimativa vai para o WhatsApp da empresa, que confirma o valor final.">Confirmar pelo WhatsApp</button><small>Valor final confirmado após avaliação.</small></div></div></section>' +
      '<section class="lp-serv" data-sec="serv"><h2>O que está incluso</h2><div class="lp-serv__grid">' +
      '<div><b>01</b><h4>Cozinha</h4><p>Bancadas, fogão por fora, armários por fora e piso.</p></div><div><b>02</b><h4>Banheiros</h4><p>Box, louças, azulejos e espelhos.</p></div>' +
      '<div><b>03</b><h4>Quartos e sala</h4><p>Pó, superfícies, aspiração e organização leve.</p></div><div><b>04</b><h4>Áreas externas</h4><p>Varanda, quintal e garagem, se contratado.</p></div></div>' +
      foto("limp2", "Ambiente limpo e organizado", "lp-serv__img", 1000) + '</section>' +
      '<footer class="lp-foot"><span class="lp-logo"><i></i>clara<b>.</b>limpeza</span><span>Segunda a sábado · 7h às 18h</span></footer>';
  }

  function construcao() {
    function obra(cat, nome, local, img) {
      return '<article class="pr-obra" data-cat="' + cat + '">' + foto(img, nome, "pr-obra__img", 700) + '<div><span>' + local + '</span><h4>' + nome + '</h4></div></article>';
    }
    return '' +
      '<header class="pr-top"><span class="pr-logo">PRUMO<span>engenharia</span></span><nav><button type="button" data-goto="obras">Obras</button><button type="button" data-goto="metodo">Método</button><button type="button" data-goto="orc">Orçamento</button></nav></header>' +
      '<section class="pr-hero">' + foto("obra1", "Estrutura de obra em andamento", "pr-hero__img", 1600) +
      '<div class="pr-hero__txt"><p>Construção · Reformas · Projetos</p><h1>Do projeto à entrega das chaves.</h1>' +
      '<button type="button" class="pr-btn" data-goto="orc">Solicitar orçamento</button></div><div class="pr-hero__grid" aria-hidden="true"></div></section>' +
      '<section class="pr-obras" data-sec="obras" data-filterset><div class="pr-obras__head"><h2>Obras</h2><div class="pr-filters"><button type="button" class="is-on" data-filter="*">Todas</button><button type="button" data-filter="res">Residencial</button><button type="button" data-filter="com">Comercial</button><button type="button" data-filter="ref">Reformas</button></div></div><div class="pr-grid">' +
      obra("res", "Residência Ipê", "Projeto ilustrativo", "casa1") + obra("com", "Galpão Logístico", "Projeto ilustrativo", "obra2") + obra("ref", "Reforma de interiores", "Projeto ilustrativo", "casa2") + obra("com", "Sala comercial", "Projeto ilustrativo", "obra3") +
      '</div></section>' +
      '<section class="pr-metodo" data-sec="metodo"><h2>Método</h2><ol><li><b>01</b><h4>Visita técnica</h4><p>Levantamento do local e das necessidades.</p></li><li><b>02</b><h4>Projeto e orçamento</h4><p>Escopo, cronograma e valores detalhados.</p></li><li><b>03</b><h4>Execução</h4><p>Acompanhamento com relatórios de obra.</p></li><li><b>04</b><h4>Entrega</h4><p>Vistoria final e documentação.</p></li></ol></section>' +
      '<section class="pr-orc" data-sec="orc" data-calc><h2>Conte sobre a sua obra</h2><form class="pr-form" data-msg="Na versão real, os dados chegam no WhatsApp da construtora para agendar a visita técnica.">' +
      '<p class="pr-label">Tipo</p><div class="pr-chips" data-pickgroup><button type="button" class="is-on" data-pick data-label="Construção">Construção</button><button type="button" data-pick data-label="Reforma">Reforma</button><button type="button" data-pick data-label="Projeto">Projeto</button></div>' +
      '<label class="pr-field"><span>Metragem aproximada</span><input type="text" inputmode="numeric" placeholder="ex.: 120 m²"></label>' +
      '<label class="pr-field"><span>Cidade</span><input type="text" placeholder="Sua cidade"></label>' +
      '<button type="submit" class="pr-btn">Enviar pelo WhatsApp</button></form></section>' +
      '<footer class="pr-foot"><span class="pr-logo">PRUMO<span>engenharia</span></span><span>CREA · dados do responsável técnico</span></footer>';
  }

  /* ============================================================
   * AGRONEGÓCIO
   * ============================================================ */

  function agro() {
    function sol(id, titulo, txt, itens, img, oculto) {
      return '<div class="cv-sol" data-panel="' + id + '"' + (oculto ? " hidden" : "") + '>' + foto(img, titulo, "cv-sol__img", 900) +
        '<div><h3>' + titulo + '</h3><p>' + txt + '</p><ul>' + itens.map(function (i) { return "<li>" + i + "</li>"; }).join("") + '</ul></div></div>';
    }
    return '' +
      '<header class="cv-top"><span class="cv-logo">Campo<em>Vivo</em></span><nav><button type="button" data-goto="sol">Soluções</button><button type="button" data-goto="visita">Visita técnica</button></nav>' +
      '<button type="button" class="cv-btn cv-btn--sm" data-goto="visita">Falar com um técnico</button></header>' +
      '<section class="cv-hero">' + foto("agro1", "Lavoura vista do alto", "cv-hero__img", 1600) +
      '<div class="cv-hero__txt"><p class="cv-kicker">Soluções agrícolas</p><h1>Água de qualidade <em>da captação à lavoura.</em></h1>' +
      '<p>Tratamento de água, irrigação e análise de solo com acompanhamento técnico na propriedade.</p>' +
      '<button type="button" class="cv-btn" data-goto="visita">Agendar visita técnica</button></div></section>' +
      '<section class="cv-sols" data-sec="sol" data-tabset><div class="cv-sols__head"><h2>Soluções</h2><div class="cv-tabs" role="tablist">' +
      '<button type="button" role="tab" class="is-on" aria-selected="true" data-tab="agua">Tratamento de água</button><button type="button" role="tab" aria-selected="false" data-tab="irr">Irrigação</button><button type="button" role="tab" aria-selected="false" data-tab="solo">Análise de solo</button></div></div>' +
      sol("agua", "Tratamento de água", "Sistemas para adequar a água usada em pulverização, irrigação e dessedentação animal.", ["Análise da água da propriedade", "Dimensionamento do sistema", "Instalação e acompanhamento"], "agro3", false) +
      sol("irr", "Irrigação", "Projetos de irrigação por gotejamento e aspersão dimensionados para cada cultura.", ["Levantamento de área", "Projeto hidráulico", "Manutenção programada"], "agro2", true) +
      sol("solo", "Análise de solo", "Coleta e interpretação de amostras para orientar correção e adubação.", ["Coleta georreferenciada", "Laudo interpretado", "Recomendação técnica"], "agro4", true) +
      '</section>' +
      '<section class="cv-visita" data-sec="visita" data-calc><div><p class="cv-kicker">Atendimento na propriedade</p><h2>Solicite uma <em>visita técnica.</em></h2></div><form class="cv-form" data-msg="Na versão real, a solicitação chega para a equipe técnica com a cultura e a área informadas.">' +
      '<p class="cv-label">Cultura principal</p><div class="cv-chips" data-pickgroup><button type="button" class="is-on" data-pick data-label="Soja">Soja</button><button type="button" data-pick data-label="Milho">Milho</button><button type="button" data-pick data-label="Café">Café</button><button type="button" data-pick data-label="Hortifrúti">Hortifrúti</button><button type="button" data-pick data-label="Pecuária">Pecuária</button></div>' +
      '<label class="cv-field"><span>Área aproximada (ha)</span><input type="text" inputmode="numeric" placeholder="ex.: 250"></label>' +
      '<label class="cv-field"><span>Município</span><input type="text" placeholder="Cidade / UF"></label>' +
      '<button type="submit" class="cv-btn">Solicitar visita</button></form></section>' +
      '<footer class="cv-foot"><span class="cv-logo">Campo<em>Vivo</em></span><span>Atendimento técnico regional</span></footer>';
  }

  /* ============================================================
   * CATÁLOGO
   * ============================================================ */

  var CATEGORIAS = [
    { id: "gastronomia", nome: "Gastronomia", tambem: "Pizzarias, hamburguerias, restaurantes, docerias, lanchonetes e cafeterias." },
    { id: "moda", nome: "Moda e varejo", tambem: "Lojas de roupas, acessórios, cosméticos e lojas virtuais." },
    { id: "saude", nome: "Saúde e estética", tambem: "Clínicas, consultórios, espaços de estética e profissionais especializados." },
    { id: "servicos", nome: "Serviços", tambem: "Prestadores de serviços, empresas de limpeza, construção e empresas locais." },
    { id: "agro", nome: "Agronegócio", tambem: "Empresas agro, tratamento de água e soluções agrícolas." }
  ];

  var DEMOS = [
    {
      id: "pizzaria", cat: "gastronomia", segmento: "Pizzaria", nome: "Forno Brasa", classe: "dm-pz", render: pizzaria,
      chaves: ["pizzaria", "pizza", "pizzarias"],
      resumo: "Cardápio com abas, montagem de pizza com valor na hora e pedido reunido para enviar pelo WhatsApp.",
      resolve: ["Cliente vê sabores, preços e taxa de entrega sem precisar perguntar", "Pedido chega organizado, com tamanho e borda", "Horário e área de entrega sempre visíveis"],
      paleta: ["#1d1612", "#c2412d", "#f3e6cf", "#6b7a3c"], tipografia: "Fraunces + Manrope"
    },
    {
      id: "hamburgueria", cat: "gastronomia", segmento: "Hamburgueria", nome: "Chapa 77", classe: "dm-hb", render: hamburgueria,
      chaves: ["hamburgueria", "hamburguer", "burger", "lanchonete", "lanches", "lanche"],
      resumo: "Identidade urbana de tipografia forte, menu numerado e montagem de combo com total calculado.",
      resolve: ["Combos montados pelo próprio cliente", "Destaque para a promoção da semana", "Visual com a personalidade da marca"],
      paleta: ["#111111", "#f2b705", "#d7261e", "#f4efe6"], tipografia: "Anton + Space Grotesk"
    },
    {
      id: "restaurante", cat: "gastronomia", segmento: "Restaurante", nome: "Casa Alecrim", classe: "dm-rs", render: restaurante,
      chaves: ["restaurante", "restaurantes", "bistro", "cafeteria"],
      resumo: "Apresentação editorial do menu da estação e reserva de mesa com dia, horário e número de pessoas.",
      resolve: ["Reservas organizadas, sem troca longa de mensagens", "Menu apresentado com o mesmo cuidado da cozinha", "Atmosfera da casa transmitida antes da visita"],
      paleta: ["#f4efe4", "#4a5233", "#a2562f", "#2a2620"], tipografia: "Cormorant Garamond + Manrope"
    },
    {
      id: "doceria", cat: "gastronomia", segmento: "Doceria", nome: "Ateliê Cacau", classe: "dm-dc", render: doceria,
      chaves: ["doceria", "confeitaria", "doces", "bolos", "padaria"],
      resumo: "Vitrine delicada e encomenda guiada em três passos: sabor, tamanho e forma de retirada.",
      resolve: ["Encomendas com todas as informações de uma vez", "Valores claros por tamanho", "Produtos apresentados com o capricho da confeitaria"],
      paleta: ["#f6e3dc", "#4a2c22", "#c97b74", "#fffaf5"], tipografia: "Fraunces + Jost"
    },
    {
      id: "moda", cat: "moda", segmento: "Loja de roupas", nome: "Verso", classe: "dm-vs", render: moda,
      chaves: ["moda", "roupas", "loja", "boutique", "vestuario", "acessorios"],
      resumo: "Loja com linguagem de revista: coleção com filtros, escolha de tamanho e sacola.",
      resolve: ["Coleção organizada por categoria", "Escolha de tamanho antes do contato", "Marca com aparência de grife"],
      paleta: ["#f2efe9", "#121212", "#c9b8a0", "#8a7a66"], tipografia: "Bodoni Moda + Jost"
    },
    {
      id: "cosmeticos", cat: "moda", segmento: "Cosméticos", nome: "Flora Pele", classe: "dm-fl", render: cosmeticos,
      chaves: ["cosmeticos", "cosmetico", "skincare", "perfumaria", "beleza"],
      resumo: "Rotina recomendada por tipo de pele em um clique e vitrine enxuta dos produtos essenciais.",
      resolve: ["Ajuda o cliente a escolher sem precisar de atendimento", "Produtos ligados a uma rotina clara", "Compra direta pela vitrine"],
      paleta: ["#dfe3d6", "#2f3a2e", "#b8836a", "#f7f5ef"], tipografia: "Jost + Instrument Serif"
    },
    {
      id: "clinica", cat: "saude", segmento: "Clínica", nome: "Clínica Lumen", classe: "dm-cl", render: clinica,
      chaves: ["clinica", "consultorio", "medico", "saude", "odontologia", "dentista", "fisioterapia", "psicologia"],
      resumo: "Interface clara e acolhedora, com especialidades organizadas e solicitação de agendamento guiada.",
      resolve: ["Agendamento sem fila no telefone", "Especialidades e convênios em um só lugar", "Transmite seriedade e cuidado"],
      paleta: ["#ffffff", "#134e5e", "#e3f1ef", "#2a9d8f"], tipografia: "Manrope"
    },
    {
      id: "estetica", cat: "saude", segmento: "Estética", nome: "Maison Lis", classe: "dm-ms", render: estetica,
      chaves: ["estetica", "spa", "salao", "beleza-estetica", "massagem", "sobrancelha", "unhas"],
      resumo: "Atmosfera de pausa, tratamentos por categoria com duração e reserva direta de cada procedimento.",
      resolve: ["Tratamentos com duração e valor de referência", "Primeira visita explicada passo a passo", "Experiência que valoriza o ambiente"],
      paleta: ["#efe4dc", "#3b2a24", "#c9a28c", "#fbf7f3"], tipografia: "Cormorant Garamond + Jost"
    },
    {
      id: "limpeza", cat: "servicos", segmento: "Empresa de limpeza", nome: "Clara Limpeza", classe: "dm-lp", render: limpeza,
      chaves: ["limpeza", "servicos", "prestador", "diarista", "lavanderia"],
      resumo: "Estimativa de valor em segundos, com tipo de limpeza, tamanho do imóvel e frequência.",
      resolve: ["Orçamentos qualificados antes do primeiro contato", "Serviços inclusos explicados com clareza", "Menos tempo respondendo as mesmas perguntas"],
      paleta: ["#0f2a3d", "#0e7490", "#c5e86c", "#f3f8fa"], tipografia: "Jost + Manrope"
    },
    {
      id: "construcao", cat: "servicos", segmento: "Construção", nome: "Prumo Engenharia", classe: "dm-pr", render: construcao,
      chaves: ["construcao", "construtora", "engenharia", "reforma", "arquitetura", "empresa", "empresas"],
      resumo: "Portfólio filtrável, método de trabalho em etapas e formulário de orçamento direto.",
      resolve: ["Obras apresentadas por tipo", "Processo explicado para gerar confiança", "Pedidos de orçamento com as informações certas"],
      paleta: ["#1e1f21", "#e8641b", "#d9d6d0", "#f4f3f0"], tipografia: "Space Grotesk"
    },
    {
      id: "agro", cat: "agro", segmento: "Soluções agrícolas", nome: "Campo Vivo", classe: "dm-cv", render: agro,
      chaves: ["agro", "agronegocio", "agricola", "fazenda", "agua", "irrigacao", "tratamento-de-agua"],
      resumo: "Soluções técnicas apresentadas por abas e solicitação de visita com cultura e área da propriedade.",
      resolve: ["Serviços técnicos explicados com clareza", "Solicitações de visita já qualificadas", "Imagem sólida para atender produtores e empresas"],
      paleta: ["#1f3324", "#d9c08a", "#f1ecdf", "#3c7a89"], tipografia: "Fraunces + Space Grotesk"
    }
  ];

  /* ============================================================
   * Montagem e interações
   * ============================================================ */

  function criar(demo, interativo) {
    var raiz = document.createElement("div");
    raiz.className = "dm " + demo.classe;
    raiz.setAttribute("data-demo", demo.id);
    raiz.innerHTML = demo.render();
    if (interativo) ligar(raiz);
    return raiz;
  }

  function textoPick(b) {
    return b.getAttribute("data-label") || b.textContent.trim();
  }

  function recalcular(box) {
    if (!box) return;
    var base = parseFloat(box.getAttribute("data-base") || "0");
    var soma = base, mult = 1, rotulos = [];
    box.querySelectorAll("[data-pickgroup]").forEach(function (g) {
      var on = g.querySelector(".is-on");
      if (!on) return;
      soma += parseFloat(on.getAttribute("data-price") || "0");
      if (on.hasAttribute("data-mult")) mult *= parseFloat(on.getAttribute("data-mult"));
      rotulos.push(textoPick(on));
    });
    box.querySelectorAll("[data-qty-val]").forEach(function (q) {
      rotulos.push(q.textContent + (q.getAttribute("data-label-suffix") || ""));
    });
    var total = soma * mult;
    box._total = total;
    box._resumo = rotulos.join(" · ");
    var t = box.querySelector("[data-calc-total]");
    var s = box.querySelector("[data-calc-summary]");
    if (t) t.textContent = brl(total);
    if (s) s.textContent = box._resumo;
  }

  function aviso(raiz, msg) {
    var host = raiz.closest("[data-dm-host]");
    var alvo = host && host.querySelector("[data-dm-toast]");
    if (!alvo) return;
    alvo.textContent = msg;
    alvo.classList.remove("is-on");
    void alvo.offsetWidth;
    alvo.classList.add("is-on");
    clearTimeout(alvo._t);
    alvo._t = setTimeout(function () { alvo.classList.remove("is-on"); }, 3600);
  }

  function irPara(raiz, id) {
    var alvo = raiz.querySelector('[data-sec="' + id + '"]');
    var rolagem = raiz.closest("[data-dm-scroll]");
    if (!alvo || !rolagem) return;
    var topo = alvo.getBoundingClientRect().top - rolagem.getBoundingClientRect().top + rolagem.scrollTop - 8;
    var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rolagem.scrollTo({ top: topo, behavior: reduzir ? "auto" : "smooth" });
  }

  function ligar(raiz) {
    var carrinho = { qtd: 0, total: 0 };
    raiz.querySelectorAll("[data-calc]").forEach(recalcular);

    function somar(nome, valor) {
      carrinho.qtd += 1;
      carrinho.total += valor;
      raiz.classList.add("has-cart");
      raiz.querySelectorAll("[data-cart-count]").forEach(function (e) { e.textContent = carrinho.qtd; });
      raiz.querySelectorAll("[data-cart-label]").forEach(function (e) { e.textContent = carrinho.qtd === 1 ? "item" : "itens"; });
      raiz.querySelectorAll("[data-cart-total]").forEach(function (e) { e.textContent = brl(carrinho.total); });
      aviso(raiz, "Adicionado: " + nome + " · " + brl(valor));
    }

    raiz.addEventListener("click", function (ev) {
      var b = ev.target.closest("button, a");
      if (!b || !raiz.contains(b)) return;

      if (b.hasAttribute("data-goto")) { ev.preventDefault(); irPara(raiz, b.getAttribute("data-goto")); return; }

      if (b.hasAttribute("data-tab")) {
        var set = b.closest("[data-tabset]");
        var id = b.getAttribute("data-tab");
        set.querySelectorAll("[data-tab]").forEach(function (x) {
          var on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-selected", on ? "true" : "false");
        });
        set.querySelectorAll("[data-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== id; });
        return;
      }

      if (b.hasAttribute("data-pick")) {
        var g = b.closest("[data-pickgroup]");
        g.querySelectorAll("[data-pick]").forEach(function (x) { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        recalcular(b.closest("[data-calc]"));
        return;
      }

      if (b.hasAttribute("data-filter")) {
        var fs = b.closest("[data-filterset]");
        var f = b.getAttribute("data-filter");
        fs.querySelectorAll("[data-filter]").forEach(function (x) { x.classList.toggle("is-on", x === b); });
        fs.querySelectorAll("[data-cat]").forEach(function (it) { it.hidden = !(f === "*" || it.getAttribute("data-cat") === f); });
        return;
      }

      if (b.hasAttribute("data-qty")) {
        var caixa = b.parentElement.querySelector("[data-qty-val]");
        var n = Math.min(20, Math.max(1, parseInt(caixa.textContent, 10) + parseInt(b.getAttribute("data-qty"), 10)));
        caixa.textContent = n;
        recalcular(b.closest("[data-calc]"));
        return;
      }

      if (b.hasAttribute("data-add")) { somar(b.getAttribute("data-name"), parseFloat(b.getAttribute("data-price"))); return; }

      if (b.hasAttribute("data-add-calc")) {
        var c = b.closest("[data-calc]");
        recalcular(c);
        somar(b.getAttribute("data-name") + " (" + c._resumo + ")", c._total);
        return;
      }

      if (b.hasAttribute("data-acao")) { aviso(raiz, b.getAttribute("data-acao")); return; }
    });

    raiz.addEventListener("submit", function (ev) {
      ev.preventDefault();
      aviso(raiz, ev.target.getAttribute("data-msg") || "Formulário de demonstração.");
    });

    // Pick groups começam com aria-pressed coerente.
    raiz.querySelectorAll("[data-pick]").forEach(function (x) { x.setAttribute("aria-pressed", x.classList.contains("is-on") ? "true" : "false"); });
  }

  window.ESTUDIO_DEMOS = {
    categorias: CATEGORIAS,
    lista: DEMOS,
    criar: criar,
    porId: function (id) { return DEMOS.filter(function (d) { return d.id === id; })[0]; }
  };
})();
