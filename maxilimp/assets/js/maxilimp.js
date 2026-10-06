/* Maxilimp — interações do site */
(function () {
  'use strict';

  /* ---------- Configuração ---------- */
  var WHATSAPP = '5555999816001';
  var MSG_ORCAMENTO = 'Olá! Gostaria de solicitar um orçamento com a Maxilimp.';

  /* Antes e depois.
     Para cada categoria, coloque as fotos em assets/img/ e preencha "antes" e "depois".
     Enquanto estiverem vazias, o site mostra um espaço reservado. */
  var ANTES_DEPOIS = [
    { id: 'pisos',      nome: 'Pisos',      legenda: 'Polimento e recuperação de piso',        antes: '', depois: '' },
    { id: 'vidros',     nome: 'Vidros',     legenda: 'Remoção de marcas d’água em vidros',     antes: '', depois: '' },
    { id: 'fachadas',   nome: 'Fachadas',   legenda: 'Higienização de fachada',                antes: '', depois: '' },
    { id: 'piscinas',   nome: 'Piscinas',   legenda: 'Restauração de piscina',                 antes: '', depois: '' },
    { id: 'pos-obra',   nome: 'Pós-obra',   legenda: 'Limpeza pós-obra',                       antes: '', depois: '' },
    { id: 'superficies',nome: 'Superfícies',legenda: 'Restauração e impermeabilização',        antes: '', depois: '' }
  ];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var waUrl = function (text) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text); };

  /* ---------- Links de WhatsApp ---------- */
  $$('[data-wa]').forEach(function (a) { a.href = waUrl(MSG_ORCAMENTO); });
  $$('[data-wa-service]').forEach(function (a) {
    var svc = a.getAttribute('data-wa-service');
    var text = a.hasAttribute('data-wa-budget')
      ? 'Olá! Gostaria de solicitar um orçamento de ' + svc + ' com a Maxilimp.'
      : 'Olá! Gostaria de saber mais sobre o serviço de ' + svc + ' da Maxilimp.';
    a.href = waUrl(text);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Cabeçalho e menu ---------- */
  var header = $('.header');
  var burger = $('.burger');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var setMenu = function (open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  /* Link ativo no menu */
  var links = $$('.nav__list a');
  var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Revelar ao rolar ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) {
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(sib, 6) * 70 + 'ms');
      io.observe(el);
    });
  }

  /* ---------- Antes e depois ---------- */
  var ba = $('.ba');
  if (ba) {
    var tabs = $('.ba__tabs', ba);
    var compare = $('.ba__compare', ba);
    var range = $('.ba__range', ba);
    var before = $('.ba__layer--before', ba);
    var after = $('.ba__layer--after', ba);
    var caption = $('.ba__caption', ba);

    var fill = function (layer, src, kind, item) {
      layer.innerHTML = '';
      layer.classList.toggle('is-empty', !src);
      if (src) {
        var img = new Image();
        img.src = src;
        img.alt = item.legenda + ' — ' + kind;
        img.decoding = 'async';
        layer.appendChild(img);
      } else {
        layer.innerHTML = '<div class="ba__ph"><svg class="ico"><use href="#i-image"/></svg>' +
          '<span>Foto do ' + kind + '</span><small>' + item.nome + '</small></div>';
      }
    };
    var setPos = function (v) {
      compare.style.setProperty('--pos', v + '%');
      range.setAttribute('aria-valuetext', 'Antes ' + Math.round(v) + '%');
    };
    var select = function (i) {
      var item = ANTES_DEPOIS[i];
      $$('button', tabs).forEach(function (b, j) {
        b.setAttribute('aria-selected', String(i === j));
        b.tabIndex = i === j ? 0 : -1;
      });
      fill(before, item.antes, 'antes', item);
      fill(after, item.depois, 'depois', item);
      caption.textContent = item.legenda;
      range.value = 50; setPos(50);
    };

    ANTES_DEPOIS.forEach(function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ba__tab';
      b.setAttribute('role', 'tab');
      b.textContent = item.nome;
      b.addEventListener('click', function () { select(i); });
      b.addEventListener('keydown', function (e) {
        var n = ANTES_DEPOIS.length, k = null;
        if (e.key === 'ArrowRight') k = (i + 1) % n;
        if (e.key === 'ArrowLeft') k = (i - 1 + n) % n;
        if (k !== null) { e.preventDefault(); select(k); tabs.children[k].focus(); }
      });
      tabs.appendChild(b);
    });

    range.addEventListener('input', function () { setPos(range.value); });

    /* Arrastar em qualquer ponto da imagem */
    var dragging = false;
    var fromEvent = function (e) {
      var r = compare.getBoundingClientRect();
      var v = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      range.value = v; setPos(v);
    };
    compare.addEventListener('pointerdown', function (e) {
      dragging = true; compare.setPointerCapture(e.pointerId); fromEvent(e);
    });
    compare.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    ['pointerup', 'pointercancel'].forEach(function (t) {
      compare.addEventListener(t, function () { dragging = false; });
    });

    select(0);
  }

  /* ---------- Galeria / lightbox ---------- */
  var lb = $('.lightbox');
  var items = $$('.gal__item');
  if (lb && items.length) {
    var lbImg = $('img', lb);
    var lbCap = $('figcaption', lb);
    var current = 0;
    var lastFocus = null;

    var show = function (i) {
      current = (i + items.length) % items.length;
      var img = $('img', items[current]);
      var cap = $('figcaption', items[current]);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.innerHTML = cap ? cap.innerHTML : '';
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      document.body.classList.add('no-scroll');
      $('.lightbox__close', lb).focus();
    };
    var close = function () {
      lb.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(function () { lb.hidden = true; }, 250);
      if (lastFocus) lastFocus.focus();
    };

    items.forEach(function (fig, i) {
      $('.gal__btn', fig).addEventListener('click', function () { open(i); });
    });
    $('.lightbox__close', lb).addEventListener('click', close);
    $('.lightbox__nav--prev', lb).addEventListener('click', function () { show(current - 1); });
    $('.lightbox__nav--next', lb).addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'Tab') {
        var f = $$('button', lb);
        var idx = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });

    /* Deslizar no celular */
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }
})();
