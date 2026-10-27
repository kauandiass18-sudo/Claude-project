/*
 * Ilustrações provisórias (SVG) usadas enquanto um item não tem foto.
 * XN_ARTE.desenho(tipo) devolve o SVG; XN_ARTE.icone(tipo) devolve o ícone de linha da categoria.
 */
(function () {
  var seq = 0;

  function burger(p, camadas) {
    // camadas = true devolve cada camada num <g data-camada>, usado na montagem por scroll
    var g = function (nome, conteudo) {
      return camadas ? '<g data-camada="' + nome + '">' + conteudo + "</g>" : conteudo;
    };
    var gergelim = "";
    [[86, 58, -20], [112, 50, 10], [140, 54, -8], [164, 66, 24], [98, 76, 30], [128, 72, -14], [152, 84, 6], [72, 80, -30], [176, 88, 40], [118, 92, 18]].forEach(function (s) {
      gergelim += '<ellipse cx="' + s[0] + '" cy="' + s[1] + '" rx="4.2" ry="2.2" transform="rotate(' + s[2] + " " + s[0] + " " + s[1] + ')" fill="#FFF0CC"/>';
    });
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + p + 'pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7B955"/><stop offset=".55" stop-color="#E08A2E"/><stop offset="1" stop-color="#B9611C"/></linearGradient>' +
      '<linearGradient id="' + p + 'pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9993E"/><stop offset="1" stop-color="#A9561A"/></linearGradient>' +
      '<linearGradient id="' + p + 'cn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6B3519"/><stop offset="1" stop-color="#341607"/></linearGradient>' +
      '<linearGradient id="' + p + 'qj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD54A"/><stop offset="1" stop-color="#F5A814"/></linearGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<ellipse cx="120" cy="182" rx="98" ry="12" fill="url(#' + p + 'sh)"/>' +
      g("pao-base", '<path d="M38 152 Q38 178 64 179 L176 179 Q202 178 202 152 Z" fill="url(#' + p + 'pb)"/><path d="M46 158 L194 158" stroke="#FFD08A" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>') +
      g("salada", '<path d="M30 146 q8 -9 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 L210 156 L30 156 Z" fill="#6DB33F"/><path d="M34 150 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#A6E36E" stroke-width="2"/>') +
      g("tomate", '<rect x="40" y="132" width="160" height="14" rx="7" fill="#E2412E"/><rect x="48" y="135" width="60" height="3" rx="1.5" fill="#FF8A70" opacity=".7"/>') +
      g("carne", '<rect x="32" y="106" width="176" height="30" rx="15" fill="url(#' + p + 'cn)"/><g fill="#8A4A26" opacity=".7"><circle cx="58" cy="118" r="2"/><circle cx="84" cy="126" r="1.6"/><circle cx="112" cy="116" r="2"/><circle cx="140" cy="127" r="1.6"/><circle cx="168" cy="117" r="2"/><circle cx="190" cy="125" r="1.6"/></g>') +
      g("queijo", '<path d="M30 100 L210 100 L206 110 Q194 110 192 124 Q190 132 185 124 L180 112 L150 112 Q146 132 139 134 Q132 132 130 112 L96 112 Q92 126 86 128 Q80 126 78 112 L44 112 Z" fill="url(#' + p + 'qj)"/>') +
      g("pao-topo", '<path d="M34 96 Q34 30 120 28 Q206 30 206 96 Q206 106 196 106 L44 106 Q34 106 34 96 Z" fill="url(#' + p + 'pt)"/><path d="M62 52 Q90 36 128 36" fill="none" stroke="#FFE2A8" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/>' + gergelim) +
      "</svg>"
    );
  }

  function xis(p) {
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + p + 'pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3B457"/><stop offset="1" stop-color="#C46E24"/></linearGradient>' +
      '<linearGradient id="' + p + 'pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E1913A"/><stop offset="1" stop-color="#9F5118"/></linearGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<ellipse cx="120" cy="164" rx="110" ry="12" fill="url(#' + p + 'sh)"/>' +
      '<path d="M16 136 Q16 156 40 157 L200 157 Q224 156 224 136 Z" fill="url(#' + p + 'pb)"/>' +
      '<rect x="18" y="122" width="204" height="16" rx="8" fill="#5A2C14"/>' +
      '<path d="M10 118 q9 -8 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 L226 128 L10 128 Z" fill="#6DB33F"/>' +
      '<ellipse cx="74" cy="114" rx="26" ry="8" fill="#FFF7E8"/><ellipse cx="74" cy="113" rx="10" ry="5" fill="#FFB321"/>' +
      '<rect x="112" y="108" width="54" height="10" rx="5" fill="#E2412E"/>' +
      '<g fill="#FFD54A"><circle cx="176" cy="114" r="3"/><circle cx="186" cy="111" r="3"/><circle cx="196" cy="115" r="3"/><circle cx="104" cy="116" r="3"/></g>' +
      '<g fill="#7FC94B"><circle cx="182" cy="118" r="3"/><circle cx="192" cy="119" r="3"/><circle cx="98" cy="112" r="3"/></g>' +
      '<path d="M14 104 Q16 58 120 54 Q224 58 226 104 Q226 112 216 112 L24 112 Q14 112 14 104 Z" fill="url(#' + p + 'pt)"/>' +
      '<g stroke="#7A3C12" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"><path d="M50 84 L80 70"/><path d="M86 90 L126 68"/><path d="M134 92 L172 70"/><path d="M178 92 L200 80"/></g>' +
      '<path d="M48 70 Q90 58 140 60" fill="none" stroke="#FFE2A8" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function pastel(p) {
    var bolhas = "";
    [[78, 92, 7], [104, 80, 5], [150, 96, 8], [124, 112, 6], [170, 118, 5], [88, 124, 5], [140, 132, 4]].forEach(function (b) {
      bolhas += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="#FFE2A0" opacity=".55"/><circle cx="' + (b[0] - b[2] / 3) + '" cy="' + (b[1] - b[2] / 3) + '" r="' + b[2] / 3 + '" fill="#FFF6DE" opacity=".8"/>';
    });
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + p + 'ps" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8C766"/><stop offset=".6" stop-color="#E59A38"/><stop offset="1" stop-color="#BF6A1E"/></linearGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<ellipse cx="122" cy="174" rx="96" ry="12" fill="url(#' + p + 'sh)"/>' +
      '<g transform="rotate(-8 120 112)">' +
      '<rect x="32" y="52" width="176" height="114" rx="22" fill="url(#' + p + 'ps)"/>' +
      '<rect x="42" y="62" width="156" height="94" rx="16" fill="none" stroke="#A9581A" stroke-opacity=".55" stroke-width="5" stroke-dasharray="2 7" stroke-linecap="round"/>' +
      bolhas +
      '<path d="M54 70 Q100 60 150 64" fill="none" stroke="#FFF0C8" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>' +
      "</g></svg>"
    );
  }

  function porcao(p) {
    var batatas = "";
    [[78, 46, -12], [92, 34, -6], [106, 40, -2], [120, 28, 3], [134, 38, 7], [148, 32, 11], [160, 46, 15], [100, 56, -9], [128, 50, 0], [154, 58, 9], [86, 62, -14], [140, 60, 4]].forEach(function (b, i) {
      batatas += '<rect x="' + b[0] + '" y="' + b[1] + '" width="13" height="96" rx="4" transform="rotate(' + b[2] + " " + (b[0] + 6) + ' 140)" fill="url(#' + p + (i % 2 ? "b1" : "b2") + ')"/>';
    });
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + p + 'b1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFD25C"/><stop offset="1" stop-color="#F0A92B"/></linearGradient>' +
      '<linearGradient id="' + p + 'b2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE07A"/><stop offset="1" stop-color="#E9A12A"/></linearGradient>' +
      '<linearGradient id="' + p + 'cx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6A2A"/><stop offset="1" stop-color="#C2300F"/></linearGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<ellipse cx="120" cy="184" rx="70" ry="10" fill="url(#' + p + 'sh)"/>' +
      batatas +
      '<path d="M62 96 Q120 120 178 96 L162 182 L78 182 Z" fill="url(#' + p + 'cx)"/>' +
      '<path d="M62 96 Q120 120 178 96" fill="none" stroke="#FF9A62" stroke-width="3"/>' +
      '<text x="120" y="158" text-anchor="middle" font-family="Archivo, Arial Black, sans-serif" font-weight="900" font-size="30" fill="#FFC531">X</text>' +
      "</svg>"
    );
  }

  function bebida(p) {
    return (
      '<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + p + 'lq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A3A16"/><stop offset="1" stop-color="#2A0F05"/></linearGradient>' +
      '<radialGradient id="' + p + 'sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<ellipse cx="120" cy="184" rx="56" ry="9" fill="url(#' + p + 'sh)"/>' +
      '<rect x="128" y="10" width="10" height="90" rx="5" transform="rotate(14 133 55)" fill="#FF7A1A"/>' +
      '<path d="M78 46 L162 46 L152 180 L88 180 Z" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>' +
      '<path d="M82 66 L158 66 L151 176 L89 176 Z" fill="url(#' + p + 'lq)"/>' +
      '<g fill="#fff" fill-opacity=".28" stroke="#fff" stroke-opacity=".5"><rect x="92" y="62" width="24" height="22" rx="5" transform="rotate(-10 104 73)"/><rect x="120" y="70" width="24" height="22" rx="5" transform="rotate(12 132 81)"/></g>' +
      '<rect x="80" y="62" width="80" height="6" rx="3" fill="#C9875A" opacity=".8"/>' +
      '<path d="M94 92 L98 168" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>' +
      '<g fill="#fff" opacity=".5"><circle cx="138" cy="120" r="2"/><circle cx="130" cy="140" r="1.6"/><circle cx="142" cy="156" r="2"/><circle cx="118" cy="110" r="1.4"/></g>' +
      "</svg>"
    );
  }

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
    icone: function (tipo) { return icones[tipo] || icones.todos; }
  };
})();
