/*
 * Ilustrações provisórias (SVG) usadas enquanto um item não tem foto.
 * XN_ARTE.desenho(tipo) devolve o SVG; XN_ARTE.icone(tipo) devolve o ícone de linha da categoria.
 */
(function () {
  var seq = 0;

  // pequenos geradores reaproveitados pelos dois lanches
  function semente(seed) {
    // gergelim espalhado pela cúpula do pão (posições estáveis, sem amontoar)
    var s = "", r = seed;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    [[42, 8, 90], [56, 6, 150], [72, 5, 170]].forEach(function (linha) {
      var y = linha[0], n = linha[1], larg = linha[2];
      for (var i = 0; i < n; i++) {
        var x = 120 - larg / 2 + (i + .5) * larg / n + (rnd() - .5) * 10;
        var yy = y + (rnd() - .5) * 8 + Math.pow((x - 120) / 90, 2) * 14;
        var a = (x - 120) * .5 + (rnd() - .5) * 60;
        s += '<g transform="rotate(' + a.toFixed(0) + " " + x.toFixed(1) + " " + yy.toFixed(1) + ')">' +
          '<ellipse cx="' + (x + .8).toFixed(1) + '" cy="' + (yy + 1.3).toFixed(1) + '" rx="4.4" ry="2.3" fill="#7A3A0E" opacity=".3"/>' +
          '<ellipse cx="' + x.toFixed(1) + '" cy="' + yy.toFixed(1) + '" rx="4.2" ry="2.2" fill="url(#SEM)"/>' +
          '<ellipse cx="' + (x - 1.2).toFixed(1) + '" cy="' + (yy - .7).toFixed(1) + '" rx="1.6" ry=".7" fill="#fff" opacity=".8"/></g>';
      }
    });
    return s;
  }
  function babado(x0, x1, yTopo, yBase, passo) {
    // folha de alface: topo reto, borda de baixo em babados caindo
    var d = "M" + x0 + " " + yTopo + " L" + x1 + " " + yTopo + " L" + x1 + " " + (yBase - 3), x = x1, i = 0;
    while (x > x0) {
      var nx = Math.max(x - passo, x0);
      var fundo = yBase + (i % 3 === 0 ? 5 : i % 3 === 1 ? 1 : 3);
      d += " Q" + ((x + nx) / 2) + " " + (fundo + 4) + " " + nx + " " + (yBase - 2);
      x = nx; i++;
    }
    return d + " Z";
  }
  function onda(x0, x1, y, amp, passo) {
    // borda ondulada (alface)
    var d = "M" + x0 + " " + y, x = x0, alt = true;
    while (x < x1) {
      var nx = Math.min(x + passo, x1);
      d += " Q" + (x + passo / 2) + " " + (y + (alt ? amp : -amp * .6)) + " " + nx + " " + y;
      x = nx; alt = !alt;
    }
    return d;
  }
  function crosta(n, x0, x1, y0, y1, seed, cor, rmax, op) {
    var s = "", r = seed;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    for (var i = 0; i < n; i++) {
      s += '<ellipse cx="' + (x0 + rnd() * (x1 - x0)).toFixed(1) + '" cy="' + (y0 + rnd() * (y1 - y0)).toFixed(1) + '" rx="' + (.8 + rnd() * rmax).toFixed(1) + '" ry="' + (.6 + rnd() * rmax * .6).toFixed(1) + '" fill="' + cor + '" opacity="' + op + '"/>';
    }
    return s;
  }
  function defsComuns(p) {
    return '<linearGradient id="' + p + 'sem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8E6"/><stop offset="1" stop-color="#EBCF9A"/></linearGradient>' +
      '<radialGradient id="' + p + 'pt" cx=".36" cy=".22" r=".95"><stop offset="0" stop-color="#FFD98E"/><stop offset=".3" stop-color="#F5A847"/><stop offset=".68" stop-color="#D97B24"/><stop offset="1" stop-color="#9C4C14"/></radialGradient>' +
      '<linearGradient id="' + p + 'ptb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9661E" stop-opacity="0"/><stop offset="1" stop-color="#6E3209" stop-opacity=".7"/></linearGradient>' +
      '<radialGradient id="' + p + 'brilho" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6DD" stop-opacity=".75"/><stop offset="1" stop-color="#FFF6DD" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + p + 'pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9A050"/><stop offset=".55" stop-color="#C46F22"/><stop offset="1" stop-color="#8A430F"/></linearGradient>' +
      '<linearGradient id="' + p + 'miolo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE3B4"/><stop offset="1" stop-color="#E9B46A"/></linearGradient>' +
      '<radialGradient id="' + p + 'cn" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#8A4A26"/><stop offset=".55" stop-color="#5A2A12"/><stop offset="1" stop-color="#2E1206"/></radialGradient>' +
      '<linearGradient id="' + p + 'qj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE37A"/><stop offset=".55" stop-color="#FDBA22"/><stop offset="1" stop-color="#E7900B"/></linearGradient>' +
      '<linearGradient id="' + p + 'tm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6A4A"/><stop offset="1" stop-color="#B8241A"/></linearGradient>' +
      '<linearGradient id="' + p + 'al" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BDD5A"/><stop offset="1" stop-color="#4E9A2A"/></linearGradient>' +
      '<linearGradient id="' + p + 'al2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5DA833"/><stop offset="1" stop-color="#2F6E1A"/></linearGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>';
  }

  function burger(p, camadas) {
    // camadas = true devolve cada camada num <g data-camada>, usado na montagem por scroll
    var g = function (nome, conteudo) {
      return camadas ? '<g data-camada="' + nome + '">' + conteudo + "</g>" : conteudo;
    };
    var u = function (id) { return "url(#" + p + id + ")"; };
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" + defsComuns(p) + "</defs>" +
      '<ellipse cx="120" cy="184" rx="100" ry="11" fill="' + u("sh") + '"/>' +
      // pão de baixo: casca dourada + miolo tostado no corte
      g("pao-base",
        '<path d="M34 152 C34 168 44 181 66 182 L174 182 C196 181 206 168 206 152 Z" fill="' + u("pb") + '"/>' +
        '<path d="M34 152 L206 152 L204 159 C170 162 70 162 36 159 Z" fill="' + u("miolo") + '"/>' +
        '<path d="M48 170 C80 176 160 176 192 170" fill="none" stroke="#FFD08A" stroke-opacity=".25" stroke-width="3" stroke-linecap="round"/>' +
        crosta(10, 50, 190, 162, 176, 7, "#7A3A0E", 1.4, .35)) +
      // alface em duas camadas com nervuras
      g("salada",
        '<path d="' + babado(24, 216, 144, 156, 10) + '" fill="' + u("al2") + '"/>' +
        '<path d="' + babado(30, 210, 141, 151, 12) + '" fill="' + u("al") + '"/>' +
        '<path d="M40 146 q4 4 2 8 M66 145 q5 4 3 9 M94 146 q4 4 2 8 M122 145 q5 4 3 9 M150 146 q4 4 2 8 M178 145 q5 4 3 9" fill="none" stroke="#C8F09A" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>') +
      // duas fatias de tomate com sementes
      g("tomate",
        '<rect x="40" y="132" width="84" height="14" rx="7" fill="' + u("tm") + '"/>' +
        '<rect x="116" y="134" width="86" height="13" rx="6.5" fill="' + u("tm") + '"/>' +
        '<rect x="48" y="135" width="68" height="4" rx="2" fill="#FF9C80" opacity=".55"/>' +
        '<rect x="124" y="137" width="70" height="3.5" rx="1.75" fill="#FF9C80" opacity=".5"/>' +
        '<g fill="#FFD9A8" opacity=".85"><ellipse cx="66" cy="141" rx="2" ry="1.1"/><ellipse cx="82" cy="142" rx="2" ry="1.1"/><ellipse cx="100" cy="141" rx="2" ry="1.1"/><ellipse cx="146" cy="142.5" rx="2" ry="1.1"/><ellipse cx="164" cy="143" rx="2" ry="1.1"/><ellipse cx="182" cy="142" rx="2" ry="1.1"/></g>') +
      // carne com borda irregular, crosta e brilho de suculência
      g("carne",
        '<path d="M36 112 C30 112 28 120 30 126 C28 133 34 140 44 139 C70 142 170 142 196 139 C206 140 212 133 210 126 C212 119 208 112 202 112 C176 106 64 106 36 112 Z" fill="' + u("cn") + '"/>' +
        crosta(26, 40, 200, 114, 136, 11, "#2A0F04", 2.2, .55) +
        crosta(18, 42, 198, 112, 132, 23, "#A0592E", 1.8, .45) +
        '<path d="M50 114 C90 109 150 109 190 114" fill="none" stroke="#C98552" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>') +
      // queijo derretido com pontas, gotas e reflexo
      g("queijo",
        '<path d="M30 102 L210 102 C214 102 216 106 214 110 L206 120 C202 124 199 122 198 118 L197 126 C196 134 188 134 187 126 L185 114 L156 114 C153 126 150 138 143 138 C136 138 134 126 132 114 L98 114 C95 124 92 130 86 130 C80 130 79 124 78 114 L48 114 L38 122 C34 125 30 122 31 118 L26 108 C25 104 27 102 30 102 Z" fill="' + u("qj") + '"/>' +
        '<path d="M40 105 C80 103 160 103 200 105" fill="none" stroke="#FFF6C8" stroke-opacity=".7" stroke-width="2.5" stroke-linecap="round"/>' +
        '<ellipse cx="141" cy="131" rx="2.2" ry="3.5" fill="#FFF3B8" opacity=".7"/><ellipse cx="190" cy="124" rx="1.6" ry="2.6" fill="#FFF3B8" opacity=".6"/>') +
      // pão de cima: cúpula brilhante com gergelim
      g("pao-topo",
        '<path d="M30 96 C30 50 70 24 120 24 C170 24 210 50 210 96 C210 106 203 109 194 109 L46 109 C37 109 30 106 30 96 Z" fill="' + u("pt") + '"/>' +
        '<path d="M30 96 C30 106 37 109 46 109 L194 109 C203 109 210 106 210 96 C200 101 40 101 30 96 Z" fill="' + u("ptb") + '"/>' +
        '<ellipse cx="88" cy="46" rx="42" ry="14" transform="rotate(-14 88 46)" fill="' + u("brilho") + '"/>' +
        semente(5).replace(/url\(#SEM\)/g, u("sem"))) +
      "</svg>"
    );
  }

  function xis(p) {
    var u = function (id) { return "url(#" + p + id + ")"; };
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" + defsComuns(p) +
      '<radialGradient id="' + p + 'gema" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFD35A"/><stop offset="1" stop-color="#F08A0C"/></radialGradient>' +
      '<linearGradient id="' + p + 'pr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7A9A2"/><stop offset="1" stop-color="#D9716B"/></linearGradient>' +
      "</defs>" +
      '<ellipse cx="120" cy="170" rx="112" ry="11" fill="' + u("sh") + '"/>' +
      // pão de baixo
      '<path d="M18 144 C18 158 30 165 48 165 L192 165 C210 165 222 158 222 144 Z" fill="' + u("pb") + '"/>' +
      '<path d="M18 144 L222 144 L220 149 C180 152 60 152 20 149 Z" fill="' + u("miolo") + '"/>' +
      // presunto ondulado
      '<path d="M16 136 C50 132 190 132 224 136 C226 141 222 145 214 145 C180 147 60 147 26 145 C18 145 14 141 16 136 Z" fill="' + u("pr") + '"/>' +
      // carne
      '<path d="M20 128 C18 120 28 116 42 117 C80 114 160 114 198 117 C212 116 222 120 220 128 C222 135 212 138 198 137 L42 137 C28 138 18 135 20 128 Z" fill="' + u("cn") + '"/>' +
      crosta(24, 28, 212, 119, 134, 3, "#2A0F04", 1.8, .55) + crosta(14, 30, 210, 118, 130, 17, "#A0592E", 1.5, .45) +
      // queijo escorrendo
      '<path d="M22 114 L218 114 L214 121 C209 121 207 127 205 133 C203 138 197 137 197 131 L195 123 L120 123 C118 131 115 136 111 136 C107 136 105 131 104 123 L60 123 C58 130 55 135 51 135 C47 135 45 130 45 123 L26 123 Z" fill="' + u("qj") + '"/>' +
      '<path d="M34 116 C80 115 160 115 206 116" stroke="#FFF6C8" stroke-opacity=".6" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      // alface em babados
      '<path d="' + babado(12, 228, 104, 116, 10) + '" fill="' + u("al2") + '"/>' +
      '<path d="' + babado(18, 222, 102, 112, 12) + '" fill="' + u("al") + '"/>' +
      '<g transform="translate(0 7)">' +
      // tomate saindo pela direita
      '<rect x="150" y="96" width="82" height="12" rx="6" fill="' + u("tm") + '"/><rect x="158" y="98" width="62" height="3" rx="1.5" fill="#FF9C80" opacity=".6"/>' +
      '<g fill="#FFD9A8"><ellipse cx="180" cy="104" rx="1.8" ry="1"/><ellipse cx="196" cy="104.5" rx="1.8" ry="1"/><ellipse cx="212" cy="104" rx="1.8" ry="1"/></g>' +
      // ovo saindo pela esquerda
      '<path d="M2 102 C2 92 22 88 46 90 C70 88 92 94 90 102 C92 108 70 110 46 109 C22 110 2 108 2 102 Z" fill="#FFF9EE"/>' +
      '<path d="M4 104 C20 109 70 110 88 104" fill="none" stroke="#EAD3B2" stroke-width="1.5"/>' +
      '<ellipse cx="38" cy="98" rx="13" ry="7" fill="' + u("gema") + '"/><ellipse cx="33" cy="95.5" rx="4" ry="1.8" fill="#fff" opacity=".75"/>' +
      // milho e ervilha
      '<g fill="#FFD54A" stroke="#E0A20E" stroke-width=".8"><circle cx="112" cy="104" r="3.2"/><circle cx="124" cy="101" r="3.2"/><circle cx="136" cy="105" r="3.2"/></g>' +
      '<g fill="#76C043" stroke="#4E8F27" stroke-width=".8"><circle cx="118" cy="108" r="3.2"/><circle cx="130" cy="109" r="3.2"/><circle cx="100" cy="102" r="3"/></g>' +
      "</g>" +
      // pão de cima prensado na chapa
      '<path d="M16 92 C18 58 58 42 120 42 C182 42 222 58 224 92 C224 100 218 102 210 102 L30 102 C22 102 16 100 16 92 Z" fill="' + u("pt") + '"/>' +
      '<path d="M16 92 C16 100 22 102 30 102 L210 102 C218 102 224 100 224 92 C206 96 34 96 16 92 Z" fill="' + u("ptb") + '"/>' +
      '<g stroke="#6A2E08" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"><path d="M44 80 L74 60"/><path d="M82 88 L124 58"/><path d="M130 90 L172 60"/><path d="M180 88 L206 70"/></g>' +
      '<g stroke="#FFE2A8" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"><path d="M48 78 L74 60"/><path d="M86 86 L124 58"/><path d="M134 88 L172 60"/></g>' +
      '<ellipse cx="88" cy="55" rx="48" ry="9" transform="rotate(-6 88 55)" fill="' + u("brilho") + '"/>' +
      "</svg>"
    );
  }

  function pastel(p) {
    var u = function (id) { return "url(#" + p + id + ")"; };
    var bolhas = "", r = 13;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    for (var i = 0; i < 16; i++) {
      var x = 50 + rnd() * 140, y = 64 + rnd() * 80, raio = 2.5 + rnd() * 6;
      bolhas += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + raio.toFixed(1) + '" ry="' + (raio * .8).toFixed(1) + '" fill="' + u("bo") + '"/>' +
        '<ellipse cx="' + (x - raio * .3).toFixed(1) + '" cy="' + (y - raio * .35).toFixed(1) + '" rx="' + (raio * .35).toFixed(1) + '" ry="' + (raio * .22).toFixed(1) + '" fill="#FFF8E4" opacity=".85"/>';
    }
    var dobra = "";
    for (var k = 0; k < 15; k++) dobra += '<path d="M' + (40 + k * 11) + ' 152 l4 10" />';
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + p + 'ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCD27A"/><stop offset=".45" stop-color="#F0A846"/><stop offset="1" stop-color="#C7701F"/></linearGradient>' +
      '<radialGradient id="' + p + 'bo" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFE9B4"/><stop offset="1" stop-color="#E9A24A"/></radialGradient>' +
      '<radialGradient id="' + p + 'br" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF6DD" stop-opacity=".7"/><stop offset="1" stop-color="#FFF6DD" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<ellipse cx="122" cy="178" rx="104" ry="11" fill="' + u("sh") + '"/>' +
      '<g transform="rotate(-6 120 112)">' +
      // sombra da espessura
      '<path d="M30 70 C30 54 40 48 56 48 L184 48 C200 48 210 54 210 70 L212 152 C212 166 202 172 188 172 L52 172 C38 172 28 166 28 152 Z" fill="#A85A18"/>' +
      '<path d="M30 64 C30 50 40 44 56 44 L184 44 C200 44 210 50 210 64 L210 146 C210 160 200 166 186 166 L54 166 C40 166 30 160 30 146 Z" fill="' + u("ps") + '"/>' +
      // borda prensada com garfo
      '<g stroke="#B9651C" stroke-width="2.4" stroke-linecap="round" opacity=".8">' + dobra + "</g>" +
      '<path d="M38 62 L38 150 M202 62 L202 150" stroke="#B9651C" stroke-width="2.4" stroke-dasharray="1 9" stroke-linecap="round" opacity=".8"/>' +
      bolhas +
      '<ellipse cx="96" cy="66" rx="58" ry="12" fill="' + u("br") + '"/>' +
      "</g>" +
      "</svg>"
    );
  }

  function porcao(p) {
    var u = function (id) { return "url(#" + p + id + ")"; };
    var batatas = "";
    [[74, 40, -16, 1], [88, 26, -9, 0], [101, 34, -4, 1], [114, 18, 1, 0], [127, 30, 5, 1], [140, 22, 9, 0], [151, 36, 10, 1], [160, 46, 11, 0], [96, 52, -11, 0], [120, 44, -1, 1], [146, 50, 7, 0], [82, 60, -18, 1], [152, 62, 9, 1]].forEach(function (b) {
      var cx = b[0] + 6.5;
      batatas += '<g transform="rotate(' + b[2] + " " + cx + ' 150)">' +
        '<rect x="' + b[0] + '" y="' + b[1] + '" width="13" height="110" rx="3.5" fill="' + u(b[3] ? "b1" : "b2") + '"/>' +
        '<rect x="' + (b[0] + 2) + '" y="' + (b[1] + 2) + '" width="3" height="100" rx="1.5" fill="#FFF3C4" opacity=".55"/>' +
        '<rect x="' + b[0] + '" y="' + b[1] + '" width="13" height="7" rx="3" fill="#D98E1C" opacity=".6"/></g>';
    });
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + p + 'b1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFD866"/><stop offset="1" stop-color="#EFA528"/></linearGradient>' +
      '<linearGradient id="' + p + 'b2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE68A"/><stop offset="1" stop-color="#F2B23A"/></linearGradient>' +
      '<linearGradient id="' + p + 'cx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8260F"/><stop offset=".35" stop-color="#E8401C"/><stop offset=".7" stop-color="#F25A2A"/><stop offset="1" stop-color="#B8260F"/></linearGradient>' +
      '<linearGradient id="' + p + 'cxi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A1608"/><stop offset="1" stop-color="#B8260F"/></linearGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<ellipse cx="120" cy="186" rx="74" ry="10" fill="' + u("sh") + '"/>' +
      // fundo interno da caixa
      '<path d="M58 92 Q120 76 182 92 L176 106 Q120 92 64 106 Z" fill="' + u("cxi") + '"/>' +
      batatas +
      // frente da caixa com aba curva
      '<path d="M58 96 Q90 120 120 104 Q150 120 182 96 L164 184 L76 184 Z" fill="' + u("cx") + '"/>' +
      '<path d="M58 96 Q90 120 120 104 Q150 120 182 96" fill="none" stroke="#FF8A5A" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M78 120 L86 178" stroke="#fff" stroke-opacity=".18" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="120" cy="146" r="20" fill="#FFC21A"/><circle cx="120" cy="146" r="20" fill="none" stroke="#1E0C06" stroke-opacity=".25" stroke-width="2"/>' +
      '<path d="M111 137 L129 155 M129 137 L111 155" stroke="#1E0C06" stroke-width="5" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function bebida(p) {
    var u = function (id) { return "url(#" + p + id + ")"; };
    var bolhas = "", r = 29;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    for (var i = 0; i < 14; i++) bolhas += '<circle cx="' + (94 + rnd() * 52).toFixed(1) + '" cy="' + (96 + rnd() * 76).toFixed(1) + '" r="' + (.8 + rnd() * 1.8).toFixed(1) + '" fill="#FFE2C4" opacity=".55"/>';
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + p + 'lq" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2A0E04"/><stop offset=".45" stop-color="#6A2A0E"/><stop offset=".7" stop-color="#4A1A08"/><stop offset="1" stop-color="#1E0802"/></linearGradient>' +
      '<linearGradient id="' + p + 'vd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".3" stop-color="#fff" stop-opacity=".06"/><stop offset=".8" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity=".22"/></linearGradient>' +
      '<linearGradient id="' + p + 'gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#CFE8FF" stop-opacity=".45"/></linearGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<ellipse cx="120" cy="186" rx="58" ry="9" fill="' + u("sh") + '"/>' +
      // canudo listrado
      '<g transform="rotate(14 136 60)"><rect x="130" y="4" width="12" height="104" rx="6" fill="#fff"/><path d="M130 14 l12 -6 M130 30 l12 -6 M130 46 l12 -6 M130 62 l12 -6 M130 78 l12 -6 M130 94 l12 -6" stroke="#E8401C" stroke-width="5"/></g>' +
      // líquido
      '<path d="M82 70 L158 70 L150 178 Q120 186 90 178 Z" fill="' + u("lq") + '"/>' +
      bolhas +
      // espuma
      '<path d="M82 70 Q92 62 102 69 Q112 62 122 69 Q132 62 142 69 Q150 63 158 70 L157 76 Q120 80 83 76 Z" fill="#E9C9A8" opacity=".9"/>' +
      // gelo
      '<g><rect x="90" y="62" width="28" height="26" rx="6" transform="rotate(-12 104 75)" fill="' + u("gl") + '" opacity=".75"/><rect x="118" y="66" width="28" height="26" rx="6" transform="rotate(10 132 79)" fill="' + u("gl") + '" opacity=".65"/><rect x="104" y="88" width="24" height="22" rx="5" transform="rotate(4 116 99)" fill="' + u("gl") + '" opacity=".35"/></g>' +
      // copo de vidro
      '<path d="M76 40 L164 40 L152 180 Q120 190 88 180 Z" fill="' + u("vd") + '" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>' +
      '<ellipse cx="120" cy="40" rx="44" ry="5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>' +
      '<path d="M86 52 L95 172" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>' +
      // gotas de condensação
      '<g fill="#fff" opacity=".7"><ellipse cx="140" cy="118" rx="1.6" ry="2.4"/><ellipse cx="146" cy="138" rx="1.4" ry="2.1"/><ellipse cx="132" cy="158" rx="1.6" ry="2.4"/><ellipse cx="100" cy="132" rx="1.2" ry="1.8"/></g>' +
      // rodela de limão na borda
      '<g transform="translate(150 38)"><circle r="15" fill="#B9E05A"/><circle r="12" fill="#E8F7B0"/><path d="M0 -11 L0 11 M-11 0 L11 0 M-8 -8 L8 8 M8 -8 L-8 8" stroke="#B9E05A" stroke-width="1.6"/></g>' +
      "</svg>"
    );
  }


  // ingredientes soltos que flutuam pela abertura
  var ingredientes = {
    tomate: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#D9301E"/><circle cx="30" cy="30" r="22" fill="#F0573C"/><g fill="#C9261A"><path d="M30 10 Q36 20 30 30 Q24 20 30 10Z"/><path d="M48 36 Q37 37 30 30 Q40 26 48 36Z"/><path d="M12 36 Q20 26 30 30 Q23 37 12 36Z"/></g><g fill="#FFD9A8"><ellipse cx="30" cy="19" rx="2" ry="3"/><ellipse cx="40" cy="33" rx="3" ry="2" transform="rotate(30 40 33)"/><ellipse cx="20" cy="33" rx="3" ry="2" transform="rotate(-30 20 33)"/></g><ellipse cx="22" cy="16" rx="7" ry="3" fill="#fff" opacity=".35" transform="rotate(-30 22 16)"/></svg>',
    alface: '<svg viewBox="0 0 70 56"><path d="M6 30 C2 16 16 4 30 8 C40 0 58 4 62 16 C70 22 66 40 56 44 C50 54 30 54 22 48 C10 50 2 42 6 30Z" fill="#5DAA33"/><path d="M10 30 C8 20 18 10 30 13 C40 6 54 10 57 19 C63 24 60 37 52 40 C46 48 31 48 24 43 C14 45 7 38 10 30Z" fill="#8FD154"/><path d="M14 40 Q34 28 56 18 M30 32 L28 18 M40 27 L46 40 M22 36 L16 26" stroke="#C8F09A" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    queijo: '<svg viewBox="0 0 64 60"><path d="M4 8 L60 6 L58 34 C56 40 52 40 51 34 L50 30 L40 30 C38 44 34 52 30 52 C26 52 24 44 24 32 L14 32 C13 38 10 40 8 36 Z" fill="#FDBA22"/><path d="M4 8 L60 6 L59 12 L5 14 Z" fill="#FFE37A"/><circle cx="20" cy="20" r="3" fill="#E7900B" opacity=".6"/><circle cx="44" cy="18" r="2.4" fill="#E7900B" opacity=".6"/></svg>',
    cebola: '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="none" stroke="#F4E6F0" stroke-width="7"/><circle cx="30" cy="30" r="25" fill="none" stroke="#C9A2C4" stroke-width="2" opacity=".6"/><circle cx="30" cy="30" r="15" fill="none" stroke="#EDD9EA" stroke-width="5"/></svg>',
    batata: '<svg viewBox="0 0 24 80"><rect x="4" y="2" width="16" height="76" rx="4" fill="#F5B530"/><rect x="7" y="5" width="4" height="68" rx="2" fill="#FFF0B0" opacity=".7"/></svg>',
    gergelim: '<svg viewBox="0 0 20 12"><ellipse cx="10" cy="6" rx="9" ry="5" fill="#FFF3D6"/><ellipse cx="7" cy="4" rx="3" ry="1.4" fill="#fff"/></svg>',
    picles: '<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="#5E8A2A"/><circle cx="28" cy="28" r="19" fill="#A9CF5A"/><g fill="#E9F5C4"><circle cx="28" cy="18" r="3"/><circle cx="37" cy="31" r="3"/><circle cx="19" cy="31" r="3"/></g></svg>'
  };

  var desenhos = { burger: burger, xis: xis, pastel: pastel, porcao: porcao, bebida: bebida };

  var linha = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var icones = {
    todos: '<svg ' + linha + '><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>',
    burger: '<svg ' + linha + '><path d="M4 11a8 6 0 0 1 16 0z"/><path d="M3 14.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/><path d="M4 17h16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 8h.01M12 7h.01M15 8h.01"/></svg>',
    xis: '<svg ' + linha + '><path d="M2.5 11.5C3 8.5 7 7 12 7s9 1.5 9.5 4.5z"/><path d="M2 14c1.7-.9 3.3-.9 5 0s3.3.9 5 0 3.3-.9 5 0 3.3.9 5 0"/><path d="M3 16.5h18c0 1.4-1 2.5-2.5 2.5h-13C4 19 3 17.9 3 16.5z"/><path d="M8 9.5 10 8.5M13 9.5l2-1"/></svg>',
    pastel: '<svg ' + linha + '><rect x="3" y="6" width="18" height="12" rx="3" transform="rotate(-6 12 12)"/><path d="M6 9.5l.01 0M8.5 13l.01 0M12 10l.01 0M15.5 13.5l.01 0M17 9l.01 0" stroke-width="2.4"/></svg>',
    porcao: '<svg ' + linha + '><path d="M6 10l1.5 11h9L18 10"/><path d="M6 10c2 1.2 10 1.2 12 0"/><path d="M8 10 7 3M10.5 10.5 10 2.5M13.5 10.5 14 2.5M16 10l1-7"/></svg>',
    bebida: '<svg ' + linha + '><path d="M6 7h12l-1.5 14h-9z"/><path d="M5 7h14"/><path d="M12 7l2-5h3"/><path d="M8 12h8"/></svg>'
  };

  window.XN_ARTE = {
    desenho: function (tipo, camadas) {
      seq += 1;
      var fn = desenhos[tipo] || burger;
      return fn("a" + seq, camadas);
    },
    icone: function (tipo) { return icones[tipo] || icones.todos; },
    ingrediente: function (tipo) { return ingredientes[tipo] || ""; }
  };
})();
