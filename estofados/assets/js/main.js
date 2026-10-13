/* Alvéa — interações do site. Os dados editáveis ficam em config.js. */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var marca = SITE.marca || {};
  var NOME = marca.nome || 'Alvéa';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp ---------- */
  var numero = String(SITE.whatsapp || '').replace(/\D/g, '');
  if (!numero) {
    console.warn('[site] WhatsApp não configurado: preencha "whatsapp" em assets/js/config.js.');
  } else if (numero.length < 12) {
    console.warn('[site] Confira o WhatsApp em config.js: use DDI 55 + DDD + número (ex.: 5511912345678).');
  }
  var waUrl = function (texto) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
  };
  var MENSAGENS = {
    orcamento: 'Olá! Gostaria de solicitar um orçamento de higienização de estofados com a ' + NOME + '.',
    especialista: 'Olá! Gostaria de falar com um especialista da ' + NOME + ' sobre a higienização dos meus estofados.'
  };
  $$('[data-wa]').forEach(function (a) {
    a.href = waUrl(MENSAGENS[a.getAttribute('data-wa')] || MENSAGENS.orcamento);
  });

  /* ---------- Marca e dados da empresa ---------- */
  var setText = function (sel, txt) { $$(sel).forEach(function (el) { el.textContent = txt; }); };
  setText('[data-brand-name]', NOME);
  if (marca.complemento) setText('[data-brand-tag]', marca.complemento);
  if (marca.apresentacao) setText('[data-brand-about]', marca.apresentacao);
  $$('[data-brand]').forEach(function (a) {
    a.setAttribute('aria-label', NOME + (a.closest('.footer') ? ' — voltar ao início' : ' — página inicial'));
    if (marca.logo) {
      a.innerHTML = '';
      var img = new Image();
      img.src = marca.logo; img.alt = NOME; img.className = 'brand__logo';
      a.appendChild(img);
    }
  });

  var regioes = (SITE.regioes || []).filter(Boolean);
  var local = [SITE.cidade, SITE.estado].filter(Boolean).join(' — ');
  var dados = {
    instagram: SITE.instagram, email: SITE.email, cidade: local,
    regioes: regioes.length ? regioes.join(', ') : '', horario: SITE.horario
  };
  $$('[data-if]').forEach(function (el) { el.hidden = !dados[el.getAttribute('data-if')]; });
  setText('[data-regioes]', dados.regioes);
  setText('[data-horario]', SITE.horario || '');
  setText('[data-local]', local);
  $$('[data-instagram]').forEach(function (a) { if (SITE.instagram) a.href = SITE.instagram; });
  $$('[data-email]').forEach(function (a) { if (SITE.email) { a.href = 'mailto:' + SITE.email; a.textContent = SITE.email; } });
  $$('[data-wa-label]').forEach(function (a) {
    if (numero.length >= 12 && numero.indexOf('55') === 0) {
      var n = numero.slice(2);
      a.textContent = 'WhatsApp (' + n.slice(0, 2) + ') ' + n.slice(2, n.length - 4) + '-' + n.slice(-4);
    }
  });
  setText('[data-year]', String(new Date().getFullYear()));

  /* ---------- SEO local ---------- */
  if (SITE.cidade) {
    document.title = 'Higienização de Estofados em ' + SITE.cidade + ' | ' + NOME;
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', 'Higienização profissional de sofás, colchões, cadeiras e estofados automotivos em ' + SITE.cidade + (regioes.length > 1 ? ' e região' : '') + '. Atendimento personalizado. Solicite seu orçamento pelo WhatsApp.');
  } else if (NOME !== 'Alvéa') {
    document.title = NOME + ' | Higienização de Estofados, Sofás e Colchões';
  }
  var canonical = $('link[rel="canonical"]');
  if (SITE.dominio) {
    canonical.href = SITE.dominio;
    var og = document.createElement('meta');
    og.setAttribute('property', 'og:url'); og.content = SITE.dominio;
    document.head.appendChild(og);
    $('meta[property="og:image"]').content = new URL('assets/img/og-image.jpg', SITE.dominio).href;
  } else if (canonical) {
    canonical.remove();
  }
  $('meta[property="og:site_name"]').content = NOME;

  var servicos = $$('[data-servico]').map(function (el) { return el.getAttribute('data-servico'); });
  var ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: NOME,
    description: marca.apresentacao || undefined,
    url: SITE.dominio || undefined,
    image: SITE.dominio ? new URL('assets/img/og-image.jpg', SITE.dominio).href : undefined,
    telephone: numero ? '+' + numero : undefined,
    email: SITE.email || undefined,
    sameAs: SITE.instagram ? [SITE.instagram] : undefined,
    address: SITE.cidade ? { '@type': 'PostalAddress', addressLocality: SITE.cidade, addressRegion: SITE.estado || undefined, addressCountry: 'BR' } : undefined,
    areaServed: regioes.length ? regioes.map(function (r) { return { '@type': 'City', name: r }; }) : (SITE.cidade ? { '@type': 'City', name: SITE.cidade } : undefined),
    makesOffer: servicos.map(function (s) { return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Higienização de ' + s.toLowerCase() } }; })
  };
  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);

  /* ---------- Fotografias ---------- */
  var fotos = SITE.fotos || {};
  $$('[data-foto]').forEach(function (img) {
    var src = fotos[img.getAttribute('data-foto')];
    if (!src) return;
    var original = img.src;
    img.onerror = function () { img.onerror = null; img.src = original; };
    img.src = src;
    img.closest('.media').classList.add('media--foto');
  });

  /* ---------- Cabeçalho e menu ---------- */
  var header = $('[data-header]');
  var burger = $('.burger');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 16); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var setMenu = function (open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav__list a');
    var alvo = navLinks.map(function (a) { return $(a.getAttribute('href')); });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a, i) {
          if (alvo[i] === en.target) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    alvo.forEach(function (s) { if (s) navIO.observe(s); });
  }

  /* ---------- Animações de entrada ---------- */
  var reveals = $$('.reveal, .step');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Antes e depois ---------- */
  var ad = SITE.antesDepois || {};
  var compare = $('[data-compare]');
  if (compare) {
    if (ad.antes && ad.depois) {
      $('[data-ad="antes"]', compare).src = ad.antes;
      $('[data-ad="depois"]', compare).src = ad.depois;
      $('.compare__dirt', compare).remove();
      $('[data-ad-badge]', compare).remove();
      $('[data-ad-legenda]', compare).textContent = ad.legenda || '';
    }
    var stage = $('.compare__stage', compare);
    var range = $('.compare__range', compare);
    var setPos = function (p) {
      p = Math.max(0, Math.min(100, p));
      stage.style.setProperty('--pos', p + '%');
      range.value = Math.round(p);
      range.setAttribute('aria-valuetext', Math.round(p) + '% antes');
    };
    var fromEvent = function (e) {
      var r = stage.getBoundingClientRect();
      setPos(((e.clientX - r.left) / r.width) * 100);
    };
    var dragging = false, startX = 0, startY = 0, decided = false;
    stage.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true; decided = e.pointerType === 'mouse'; startX = e.clientX; startY = e.clientY;
      if (decided) { stage.setPointerCapture(e.pointerId); compare.classList.add('is-dragging'); fromEvent(e); e.preventDefault(); }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (!decided) {
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 4 && dy < 4) return;
        if (dy > dx) { dragging = false; return; }
        decided = true; stage.setPointerCapture(e.pointerId); compare.classList.add('is-dragging');
      }
      fromEvent(e);
    });
    var end = function (e) {
      if (dragging && !decided && e.type === 'pointerup') fromEvent(e); // toque simples
      dragging = false; compare.classList.remove('is-dragging');
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    range.addEventListener('input', function () { setPos(+range.value); });
    setPos(50);
  }

  /* ---------- Modal de serviço ---------- */
  var modal = $('[data-modal]');
  var openDialog = function (d) {
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    document.documentElement.style.overflow = 'hidden';
  };
  var closeDialog = function (d) {
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  };
  $$('dialog').forEach(function (d) {
    d.addEventListener('close', function () { document.documentElement.style.overflow = ''; });
    d.addEventListener('click', function (e) { if (e.target === d) closeDialog(d); });
  });

  var tipoSelect = $('#f-tipo');
  var servicoAtual = '';
  $$('[data-servico-abrir]').forEach(function (btn) {
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', function () {
      var card = btn.closest('[data-servico]');
      servicoAtual = card.getAttribute('data-servico');
      $('#modal-titulo').textContent = servicoAtual;
      $('[data-modal-text]', modal).textContent = $('.service__text', card).textContent;
      $('[data-modal-list]', modal).innerHTML = $('.service__details', card).innerHTML;
      $('[data-modal-wa]', modal).href = waUrl('Olá! Gostaria de saber mais sobre a higienização de ' + servicoAtual.toLowerCase() + ' da ' + NOME + '.');
      openDialog(modal);
    });
  });
  $('[data-modal-close]', modal).addEventListener('click', function () { closeDialog(modal); });
  $('[data-modal-quote]', modal).addEventListener('click', function (e) {
    e.preventDefault();
    closeDialog(modal);
    var opt = $$('option', tipoSelect).filter(function (o) { return o.value === servicoAtual; })[0];
    if (opt) { tipoSelect.value = servicoAtual; validate(tipoSelect); }
    $('#orcamento').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(function () { $('#f-nome').focus({ preventScroll: true }); }, reduceMotion ? 0 : 700);
  });

  /* ---------- Galeria ---------- */
  var galeria = (SITE.galeria || []).filter(function (g) { return g && g.foto; });
  var lightbox = $('[data-lightbox]');
  var lbIndex = 0;
  var esc = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var showLightbox = function (i) {
    lbIndex = (i + galeria.length) % galeria.length;
    var g = galeria[lbIndex];
    var media = $('[data-lightbox-media]', lightbox);
    media.innerHTML = g.antes
      ? '<div><img src="' + esc(g.antes) + '" alt="Antes: ' + esc(g.estofado) + '"><span>Antes</span></div><div><img src="' + esc(g.foto) + '" alt="Depois: ' + esc(g.estofado) + '"><span>Depois</span></div>'
      : '<div><img src="' + esc(g.foto) + '" alt="' + esc(g.estofado) + '"></div>';
    $('[data-lightbox-caption]', lightbox).innerHTML = '<strong>' + esc(g.estofado) + '</strong>' + esc(g.servico);
    var multi = galeria.length > 1;
    $('[data-lightbox-prev]', lightbox).hidden = !multi;
    $('[data-lightbox-next]', lightbox).hidden = !multi;
  };
  if (galeria.length) {
    var grid = $('[data-gallery-grid]');
    grid.innerHTML = galeria.map(function (g, i) {
      var cls = g.formato === 'alto' ? ' gallery__item--alto' : g.formato === 'largo' ? ' gallery__item--largo' : '';
      return '<li class="gallery__item reveal' + cls + '"><button class="gallery__btn" type="button" data-i="' + i + '" aria-haspopup="dialog" aria-label="Ampliar foto: ' + esc(g.estofado) + '">' +
        '<img src="' + esc(g.foto) + '" alt="' + esc(g.estofado) + '" loading="lazy">' +
        (g.antes ? '<span class="badge gallery__tag">Antes e depois</span>' : '') +
        '<span class="gallery__meta"><strong>' + esc(g.estofado) + '</strong>' + esc(g.servico) + '</span></button></li>';
    }).join('');
    $('[data-gallery]').hidden = false;
    $$('.gallery__btn', grid).forEach(function (b) {
      b.addEventListener('click', function () { showLightbox(+b.getAttribute('data-i')); openDialog(lightbox); });
    });
    $$('.reveal', grid).forEach(function (el) { el.classList.add('is-visible'); });
  }
  $('[data-lightbox-close]', lightbox).addEventListener('click', function () { closeDialog(lightbox); });
  $('[data-lightbox-prev]', lightbox).addEventListener('click', function () { showLightbox(lbIndex - 1); });
  $('[data-lightbox-next]', lightbox).addEventListener('click', function () { showLightbox(lbIndex + 1); });
  lightbox.addEventListener('keydown', function (e) {
    if (galeria.length < 2) return;
    if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
  });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__figure')) closeDialog(lightbox);
  });

  /* ---------- Depoimentos ---------- */
  var depoimentos = (SITE.depoimentos || []).filter(function (d) { return d && d.texto && d.nome; });
  if (depoimentos.length) {
    var estrela = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/></svg>';
    $('[data-testimonials-grid]').innerHTML = depoimentos.map(function (d) {
      var nota = Math.max(0, Math.min(5, Math.round(+d.nota || 0)));
      return '<li class="testimonial reveal">' +
        (nota ? '<div class="testimonial__stars" role="img" aria-label="Avaliação: ' + nota + ' de 5">' + new Array(nota + 1).join(estrela) + '</div>' : '') +
        '<blockquote class="testimonial__text">“' + esc(d.texto) + '”</blockquote>' +
        '<p class="testimonial__who">' + esc(d.nome) + (d.bairro ? '<span>' + esc(d.bairro) + '</span>' : '') + '</p></li>';
    }).join('');
    $('[data-testimonials]').hidden = false;
    $$('.testimonial').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Formulário de orçamento ---------- */
  var form = $('[data-form]');
  var status = $('[data-status]');
  var submit = $('[data-submit]');
  var desc = $('#f-desc');
  var MSG = {
    nome: { valueMissing: 'Informe seu nome.', tooShort: 'Informe seu nome completo ou como prefere ser chamado.' },
    cidade: { valueMissing: 'Informe sua cidade ou região.', tooShort: 'Informe sua cidade ou região.' },
    tipo: { valueMissing: 'Selecione o tipo de estofado.' },
    quantidade: { valueMissing: 'Informe a quantidade de peças.', rangeUnderflow: 'A quantidade mínima é 1.', rangeOverflow: 'Para mais de 99 peças, descreva na mensagem.', stepMismatch: 'Use um número inteiro.', badInput: 'Use apenas números.' }
  };
  function validate(el) {
    if (!el.name || !MSG[el.name]) return true;
    if (el.type === 'text') el.value = el.value.replace(/\s+/g, ' ').replace(/^\s/, '');
    var v = el.validity, msgs = MSG[el.name], msg = '';
    if (el.type === 'text' && el.required && !el.value.trim()) msg = msgs.valueMissing;
    else if (!v.valid) {
      for (var k in msgs) { if (v[k]) { msg = msgs[k]; break; } }
      if (!msg) msg = 'Verifique este campo.';
    }
    var field = el.closest('.field');
    field.classList.toggle('is-invalid', !!msg);
    field.classList.toggle('is-valid', !msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    $('.field__error', field).textContent = msg;
    return !msg;
  }
  $$('input, select', form).forEach(function (el) {
    el.addEventListener('blur', function () { if (el.value !== '' || el.closest('.field').classList.contains('is-invalid')) validate(el); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-invalid')) validate(el); });
    el.addEventListener('change', function () { validate(el); });
  });
  desc.addEventListener('input', function () { $('[data-count]').textContent = desc.value.length; });

  var setStatus = function (html, erro) {
    status.innerHTML = html;
    status.classList.toggle('is-error', !!erro);
    status.hidden = false;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.hidden = true;
    var campos = $$('input, select', form);
    var invalidos = campos.filter(function (el) { return !validate(el); });
    if (invalidos.length) {
      invalidos[0].focus();
      setStatus('Revise ' + (invalidos.length > 1 ? 'os campos destacados' : 'o campo destacado') + ' para continuar.', true);
      return;
    }

    var d = new FormData(form);
    var linhas = [
      'Olá! Gostaria de solicitar um orçamento com a ' + NOME + '.',
      '',
      '*Nome:* ' + d.get('nome').trim(),
      '*Cidade/região:* ' + d.get('cidade').trim(),
      '*Tipo de estofado:* ' + d.get('tipo'),
      '*Quantidade de peças:* ' + d.get('quantidade')
    ];
    var descricao = String(d.get('descricao') || '').trim();
    if (descricao) linhas.push('*Descrição:* ' + descricao);
    var url = waUrl(linhas.join('\n'));

    submit.classList.add('is-loading');
    submit.setAttribute('aria-busy', 'true');
    $('.btn__label', submit).textContent = 'Abrindo o WhatsApp…';

    // Com "noopener" o navegador não devolve a janela; por isso o aviso abaixo
    // sempre traz um link direto, caso a conversa não tenha aberto.
    window.open(url, '_blank', 'noopener');
    setTimeout(function () {
      submit.classList.remove('is-loading');
      submit.removeAttribute('aria-busy');
      $('.btn__label', submit).textContent = 'Solicitar orçamento pelo WhatsApp';
      setStatus('Tudo pronto! Sua mensagem foi preparada no WhatsApp — é só enviar. Se a conversa não abriu, <a href="' + esc(url) + '" target="_blank" rel="noopener">toque aqui para abrir o WhatsApp</a>.');
    }, 700);
  });

  /* ---------- WhatsApp flutuante ---------- */
  var float = $('.wa-float');
  if ('IntersectionObserver' in window) {
    var hidden = { hero: true, orcamento: false, footer: false };
    var upd = function () { float.classList.toggle('is-visible', !hidden.hero && !hidden.orcamento && !hidden.footer); };
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var key = en.target.id === 'inicio' ? 'hero' : en.target.id === 'orcamento' ? 'orcamento' : 'footer';
        hidden[key] = en.isIntersecting;
      });
      upd();
    }, { threshold: 0, rootMargin: '0px 0px -15% 0px' });
    ['#inicio', '#orcamento', '.footer'].forEach(function (s) { var el = $(s); if (el) fio.observe(el); });
  } else {
    float.classList.add('is-visible');
  }
})();
