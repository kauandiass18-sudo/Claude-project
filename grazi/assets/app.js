/* =========================================================================
   GRAZI · MANICURE & PEDICURE
   Monta a página a partir de config.js e cuida das interações.
   Nada aqui precisa ser editado no dia a dia: mexa só em config.js.
   ========================================================================= */
(function () {
  'use strict';

  var C = window.GRAZI || {};
  var raiz = document.documentElement;
  var calmo = false;
  try { calmo = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ===================================================== 1. LINKS E TEXTOS */

  function linkWhatsapp(tipo) {
    var mensagens = {
      agendamento: C.mensagemAgendamento,
      spa: C.mensagemSpa,
      endereco: C.mensagemEndereco
    };
    var numero = String(C.whatsapp || '').replace(/\D/g, '');
    var texto = mensagens[tipo] || C.mensagemAgendamento || '';
    return 'https://wa.me/' + numero + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  var instagram = C.instagram || 'https://www.instagram.com/graziimanicurepedicure/';

  $$('[data-wa]').forEach(function (a) { a.href = linkWhatsapp(a.getAttribute('data-wa')); });
  $$('[data-insta]').forEach(function (a) { a.href = instagram; });
  if (C.instagramUsuario) $$('[data-insta-user]').forEach(function (a) { a.textContent = C.instagramUsuario; });
  if (C.cidade) $$('[data-cidade]').forEach(function (e) { e.textContent = C.cidade; });
  if (C.estado) $$('[data-estado]').forEach(function (e) { e.textContent = C.estado; });
  $('#ano').textContent = new Date().getFullYear();

  /* ====================================== 2. FOTOS E MOLDURAS DE ESPERA */

  var TONS = ['blush', 'creme', 'salvia', 'champ'];
  var ORNAMENTOS = ['orn-rosa', 'orn-folhas', 'orn-flor', 'orn-vidro'];

  function moldura(ornamento, rotulo) {
    return '<span class="ph" aria-hidden="true">' +
      '<svg viewBox="0 0 120 150"><use href="#' + ornamento + '"/></svg>' +
      (rotulo ? '<b>' + esc(rotulo) + '</b>' : '') + '</span>';
  }

  function preencheFoto(el, foto, opcoes) {
    var o = opcoes || {};
    el.classList.add('tom-' + (o.tom || 'creme'));
    if (foto && foto.src) {
      el.innerHTML = '<img src="' + esc(foto.src) + '" alt="' + esc(foto.alt || '') + '" decoding="async"' +
        (o.prioritaria ? ' fetchpriority="high">' : ' loading="lazy">');
    } else {
      el.innerHTML = moldura(o.ornamento || 'orn-rosa', o.rotulo);
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', ((foto && foto.alt) || 'Foto') + ' (em breve)');
    }
  }

  var fotos = C.fotos || {};
  $$('[data-foto]').forEach(function (el) {
    var chave = el.getAttribute('data-foto');
    preencheFoto(el, fotos[chave], {
      tom: el.getAttribute('data-tom'),
      rotulo: el.getAttribute('data-rotulo'),
      ornamento: chave === 'spa' ? 'orn-folhas' : 'orn-rosa',
      prioritaria: chave === 'hero'
    });
  });

  /* =============================================================== 3. GALERIA */

  var galeria = (C.galeria || []).filter(Boolean);
  var listaGaleria = $('#galeria');

  listaGaleria.innerHTML = galeria.map(function (g, i) {
    var titulo = g.alt || 'Trabalho ' + (i + 1);
    return '<li><button type="button" class="peca" data-i="' + i + '"' +
      ' data-formato="' + esc(g.formato || 'retrato') + '"' +
      ' aria-label="Ampliar: ' + esc(titulo) + '">' +
      '<span class="foto"></span>' +
      '<span class="peca__mais" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><use href="#ico-mais"/></svg></span>' +
      '</button></li>';
  }).join('');

  $$('.peca .foto', listaGaleria).forEach(function (el, i) {
    preencheFoto(el, galeria[i], {
      tom: TONS[i % TONS.length],
      ornamento: ORNAMENTOS[(i * 3) % ORNAMENTOS.length],
      rotulo: galeria[i].src ? '' : 'Foto ' + String(i + 1).padStart(2, '0')
    });
  });

  /* ============================================================ 4. INSTAGRAM */

  var posts = (C.instagramPosts || []).filter(function (p) { return p && p.src; });
  var grade = $('#insta-grade');
  if (!posts.length) {
    $('#instagram').classList.add('insta--vazio');
  } else {
    grade.hidden = false;
    grade.innerHTML = posts.map(function (p) {
      return '<li><a href="' + esc(p.link || instagram) + '" target="_blank" rel="noopener"' +
        ' aria-label="' + esc(p.alt || 'Abrir publicação no Instagram') + '"><span class="foto"></span></a></li>';
    }).join('');
    $$('.foto', grade).forEach(function (el, i) {
      preencheFoto(el, posts[i], { tom: TONS[(i + 1) % TONS.length] });
    });
  }

  /* ========================================================== 5. DEPOIMENTOS */

  var depoimentos = (C.depoimentos || []).filter(function (d) { return d && d.texto; });
  var secaoDepo = $('#depoimentos');

  if (!depoimentos.length) {
    secaoDepo.hidden = true;
    var itemMenu = $('[data-item-depoimentos]');
    if (itemMenu) itemMenu.hidden = true;
  } else {
    var estrela = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.8 6.2 20.1l1.5-6.4-4.9-4.3 6.5-.6z"/></svg>';
    $('#depoimentos-lista').innerHTML = depoimentos.map(function (d) {
      return '<figure class="depo__card">' +
        '<div class="estrelas" role="img" aria-label="Cinco estrelas">' + estrela.repeat(5) + '</div>' +
        '<blockquote>' + esc(d.texto) + '</blockquote>' +
        '<figcaption><span>' + esc(d.nome || '') + '</span>' +
        (d.exemplo ? '<span class="etiqueta">Exemplo</span>' : '') +
        '</figcaption></figure>';
    }).join('');
  }

  /* ======================================== 6. ENDEREÇO, HORÁRIOS E MAPA */

  var endereco = String(C.endereco || '').trim();
  var cidadeEstado = [C.cidade, C.estado].filter(Boolean).join(' - ');

  if (endereco) {
    $('#endereco').textContent = endereco;
    var noRodape = $('#rodape-end');
    noRodape.textContent = endereco;
    noRodape.hidden = false;

    var botao = $('#btn-local');
    botao.removeAttribute('data-wa');
    botao.href = 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(endereco + (cidadeEstado ? ', ' + cidadeEstado : ''));
    botao.textContent = 'Abrir no Google Maps';
  }

  var horarios = (C.horarios || []).filter(function (h) { return h && h.dias; });
  if (horarios.length) {
    var lista = $('#horarios');
    lista.hidden = false;
    lista.innerHTML = horarios.map(function (h) {
      return '<li><span>' + esc(h.dias) + '</span><b>' + esc(h.horas || '') + '</b></li>';
    }).join('');
  }

  if (C.mapa) {
    $('#mapa').innerHTML = '<iframe src="' + esc(C.mapa) + '" title="Mapa com a localização do espaço da Grazi"' +
      ' loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
  }

  /* ================================================ 7. DADOS PARA BUSCADORES */

  (function dadosEstruturados() {
    var dados = {
      '@context': 'https://schema.org',
      '@type': 'NailSalon',
      name: 'Grazi Manicure & Pedicure',
      description: 'Manicure, pedicure e Spa dos Pés em ' + (C.cidade || 'Faxinal dos Guedes') + '.',
      url: location.href.split('#')[0],
      priceRange: '$$',
      sameAs: [instagram]
    };

    var endr = { '@type': 'PostalAddress', addressCountry: 'BR' };
    if (C.cidade) endr.addressLocality = C.cidade;
    if (C.estado) endr.addressRegion = C.estado;
    if (endereco) endr.streetAddress = endereco;
    dados.address = endr;
    if (C.cidade) dados.areaServed = C.cidade;

    var numero = String(C.whatsapp || '').replace(/\D/g, '');
    if (numero) dados.telephone = '+' + numero;
    if (fotos.hero && fotos.hero.src) dados.image = new URL(fotos.hero.src, location.href).href;

    if (horarios.length) {
      dados.openingHours = horarios.map(function (h) {
        return [h.dias, h.horas].filter(Boolean).join(' ');
      });
    }

    dados.makesOffer = ['Manicure', 'Pedicure', 'Spa dos Pés'].map(function (nome) {
      return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: nome } };
    });

    var tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(dados);
    document.head.appendChild(tag);
  })();

  /* ============================================================== 8. LIGHTBOX */

  var lb = $('#lb');
  var lbFig = $('#lb-fig');
  var lbLegenda = $('#lb-legenda');
  var lbConta = $('#lb-conta');
  var atual = 0;
  var focoAnterior = null;

  function precarrega(i) {
    var g = galeria[(i + galeria.length) % galeria.length];
    if (g && g.src) { var im = new Image(); im.src = g.src; }
  }

  function mostra(i, imediato) {
    atual = (i + galeria.length) % galeria.length;
    var g = galeria[atual];

    var monta = function () {
      if (g.src) {
        lbFig.innerHTML = '<img src="' + esc(g.src) + '" alt="' + esc(g.alt || '') + '">';
      } else {
        lbFig.innerHTML = '<span class="foto"></span>';
        preencheFoto($('.foto', lbFig), g, {
          tom: TONS[atual % TONS.length],
          ornamento: ORNAMENTOS[(atual * 3) % ORNAMENTOS.length],
          rotulo: 'Foto ' + String(atual + 1).padStart(2, '0')
        });
      }
      lbLegenda.textContent = g.src ? (g.alt || '') : 'Esta foto ainda vai entrar aqui';
      lbConta.textContent = String(atual + 1).padStart(2, '0') + ' / ' + String(galeria.length).padStart(2, '0');
      lbFig.classList.remove('trocando');
      precarrega(atual + 1);
      precarrega(atual - 1);
    };

    if (imediato) monta();
    else { lbFig.classList.add('trocando'); setTimeout(monta, 220); }
  }

  function abreLightbox(i) {
    focoAnterior = document.activeElement;
    mostra(i, true);
    lb.classList.add('aberto');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
    setTimeout(function () { $('.lb__fechar').focus(); }, 60);
  }

  function fechaLightbox() {
    lb.classList.remove('aberto');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
    if (focoAnterior) focoAnterior.focus();
  }

  listaGaleria.addEventListener('click', function (e) {
    var botao = e.target.closest('.peca');
    if (botao) abreLightbox(Number(botao.getAttribute('data-i')));
  });

  lb.addEventListener('click', function (e) {
    var botao = e.target.closest('[data-lb]');
    if (botao) {
      var acao = botao.getAttribute('data-lb');
      if (acao === 'fechar') fechaLightbox();
      else mostra(atual + (acao === 'prox' ? 1 : -1));
      return;
    }
    if (!e.target.closest('.lb__fig')) fechaLightbox();
  });

  var toqueX = null;
  lb.addEventListener('touchstart', function (e) { toqueX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (toqueX === null) return;
    var dx = e.changedTouches[0].clientX - toqueX;
    toqueX = null;
    if (Math.abs(dx) > 50) mostra(atual + (dx < 0 ? 1 : -1));
  });

  /* ================================================================= 9. MENU */

  var botaoMenu = $('.menu-btn');
  var menu = $('#menu');

  function alternaMenu(abrir) {
    raiz.classList.toggle('menu-aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    menu.setAttribute('aria-hidden', String(!abrir));
    document.body.style.overflow = abrir ? 'hidden' : '';
    if (window.__lenis) { if (abrir) window.__lenis.stop(); else window.__lenis.start(); }
    if (abrir) setTimeout(function () { var a = $('a', menu); if (a) a.focus(); }, 300);
  }

  botaoMenu.addEventListener('click', function () {
    alternaMenu(!raiz.classList.contains('menu-aberto'));
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () { alternaMenu(false); });
  });

  /* ============================== 10. TECLADO (lightbox, menu e armadilhas) */

  function focaveis(caixa) {
    return $$('a[href], button:not([disabled])', caixa).filter(function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  document.addEventListener('keydown', function (e) {
    var lightboxAberto = lb.classList.contains('aberto');
    var menuAberto = raiz.classList.contains('menu-aberto');
    if (!lightboxAberto && !menuAberto) return;

    if (e.key === 'Escape') {
      if (lightboxAberto) fechaLightbox(); else alternaMenu(false);
      return;
    }
    if (lightboxAberto && e.key === 'ArrowRight') { mostra(atual + 1); return; }
    if (lightboxAberto && e.key === 'ArrowLeft') { mostra(atual - 1); return; }

    if (e.key === 'Tab') {
      var lista = focaveis(lightboxAberto ? lb : menu);
      if (!lista.length) return;
      var pos = lista.indexOf(document.activeElement);
      e.preventDefault();
      lista[(pos + (e.shiftKey ? -1 : 1) + lista.length) % lista.length].focus();
    }
  });

  /* ================================= 11. NAV, PROGRESSO E BOTÃO FLUTUANTE */

  var nav = $('#nav');
  var progresso = $('#progresso');
  var waFlutuante = $('#wa-flutuante');
  var ultimoY = 0;
  var aguardando = false;

  function aoRolar() {
    var y = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;

    nav.classList.toggle('solida', y > 30);
    nav.classList.toggle('recolhida', y > 520 && y > ultimoY && !raiz.classList.contains('menu-aberto'));
    waFlutuante.classList.toggle('visivel', y > window.innerHeight * 0.5);
    progresso.style.transform = 'scaleX(' + (total > 0 ? Math.min(y / total, 1) : 0) + ')';

    ultimoY = y;
    aguardando = false;
  }

  window.addEventListener('scroll', function () {
    if (!aguardando) { aguardando = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  aoRolar();

  /* ============================================= 12. ÂNCORAS COM RESPIRO */

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2 || a.hasAttribute('data-wa')) return;
      var alvo = $(id);
      if (!alvo) return;
      e.preventDefault();
      var folga = id === '#inicio' ? 0 : -60;
      if (window.__lenis) window.__lenis.scrollTo(alvo, { offset: folga, duration: 1.4 });
      else window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY + folga, behavior: calmo ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ========================================================= 13. MOVIMENTO */

  function semAnimacao() {
    raiz.classList.remove('intro');
    $$('.ramo').forEach(function (r) { r.classList.add('cheio'); });
  }

  if (calmo) { semAnimacao(); return; }

  window.addEventListener('load', function () {
    var gsap = window.gsap;
    if (!gsap || !window.ScrollTrigger) { semAnimacao(); return; }
    gsap.registerPlugin(window.ScrollTrigger);

    /* rolagem suave */
    if (window.Lenis) {
      var lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* transforma o <use> em traços que podem ser desenhados */
    function preparaRamo(svg) {
      var uso = svg.querySelector('use');
      var simbolo = uso && document.querySelector(uso.getAttribute('href'));
      if (!simbolo) return [];
      var grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      svg.setAttribute('viewBox', simbolo.getAttribute('viewBox'));
      grupo.innerHTML = simbolo.innerHTML;
      svg.replaceChild(grupo, uso);
      return $$('.traco', grupo).map(function (p) {
        var comprimento = p.getTotalLength();
        p.style.strokeDasharray = comprimento;
        p.style.strokeDashoffset = comprimento;
        return p;
      });
    }

    /* ------------------------------------------------------------ abertura */
    var nome = $('[data-letras]');
    nome.innerHTML = nome.textContent.split('').map(function (l) {
      return '<span class="letra">' + l + '</span>';
    }).join('');

    var ramosDoHero = $$('.hero .ramo').map(preparaRamo);

    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.arco',
        { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 18px 18px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 18px 18px)', duration: 1.6, ease: 'expo.inOut' }, 0)
      .fromTo('.arco__img', { scale: 1.22 }, { scale: 1, duration: 2.2 }, .15)
      .fromTo('.arco__aro', { opacity: 0, scale: .96 }, { opacity: .5, scale: 1, duration: 1.4 }, .9)
      .from('.hero__detalhe', { scale: 0, duration: 1.3 }, 1)
      .from('.selo', { opacity: 0, rotate: -40, duration: 1.5 }, 1.1)
      .from('.hero__nome .letra', { yPercent: 110, opacity: 0, duration: 1.5, stagger: .065 }, .35)
      .from('.hero__local, .hero__oficio, .hero__frase, .hero__sub, .hero .botoes',
        { y: 24, opacity: 0, duration: 1.2, stagger: .09 }, .75);

    ramosDoHero.forEach(function (tracos, i) {
      tl.to(tracos, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', stagger: .05 }, .8 + i * .2);
    });
    tl.add(function () {
      $$('.hero .ramo').forEach(function (r) { r.classList.add('cheio'); });
    }, 2.4);

    raiz.classList.remove('intro');

    /* ------------------------------------------------- parallax da abertura */
    gsap.to('.arco__img', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__texto', {
      y: -40, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* ------------------------------------------------- títulos palavra a palavra */
    $$('[data-split]').forEach(function (titulo) {
      (function percorre(no) {
        Array.prototype.slice.call(no.childNodes).forEach(function (filho) {
          if (filho.nodeType === 3) {
            var pedaco = document.createDocumentFragment();
            filho.textContent.split(/(\s+)/).forEach(function (palavra) {
              if (!palavra) return;
              if (/^\s+$/.test(palavra)) { pedaco.appendChild(document.createTextNode(' ')); return; }
              var fora = document.createElement('span');
              fora.className = 'palavra';
              var dentro = document.createElement('span');
              dentro.textContent = palavra;
              fora.appendChild(dentro);
              pedaco.appendChild(fora);
            });
            filho.parentNode.replaceChild(pedaco, filho);
          } else if (filho.nodeType === 1) percorre(filho);
        });
      })(titulo);

      gsap.from($$('.palavra > span', titulo), {
        yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: .06,
        scrollTrigger: { trigger: titulo, start: 'top 86%', once: true }
      });
    });

    /* ------------------------------------------------------------- revelações */
    $$('[data-revela]').forEach(function (el) {
      gsap.from(el, {
        y: 36, opacity: 0, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    $$('[data-revela-lista]').forEach(function (el) {
      if (!el.children.length) return;
      gsap.from(el.children, {
        y: 40, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .1,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
    });

    /* --------------------------------------------------- galeria em lotes */
    if (listaGaleria.children.length) {
      gsap.set('#galeria li', { y: 50, opacity: 0 });
      window.ScrollTrigger.batch('#galeria li', {
        start: 'top 92%', once: true,
        onEnter: function (lote) {
          gsap.to(lote, { y: 0, opacity: 1, duration: 1.4, ease: 'expo.out', stagger: .09 });
        }
      });
    }

    /* ------------------------------------------------ fotos com parallax */
    $$('[data-parallax]').forEach(function (el) {
      gsap.fromTo(el,
        { yPercent: -6, scale: 1.12 },
        {
          yPercent: 6, scale: 1.12, ease: 'none',
          scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    /* --------------------------------- ramos que se desenham com a rolagem */
    $$('[data-desenha]').forEach(function (svg) {
      if (svg.closest('.hero')) return;
      var tracos = preparaRamo(svg);
      if (!tracos.length) return;
      gsap.to(tracos, {
        strokeDashoffset: 0, ease: 'none', stagger: .04,
        scrollTrigger: {
          trigger: svg, start: 'top 95%', end: 'top 45%', scrub: 1,
          onLeave: function () { svg.classList.add('cheio'); }
        }
      });
    });

    window.ScrollTrigger.refresh();
  });
})();
