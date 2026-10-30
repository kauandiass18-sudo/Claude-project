/* =============================================================
   PÁGINAS DE TEXTO (como funciona, privacidade, erro)
   Preenche o nome da marca e os contatos configurados em
   config/marca.js. Blocos sem dado configurado ficam ocultos.
   ============================================================= */
(function () {
  'use strict';

  var V = window.Vitrine;
  var M = window.MARCA || {};
  var T = M.textos || {};
  var h = V.h;
  var contato = M.contato || {};

  document.querySelectorAll('[data-marca]').forEach(function (el) { el.textContent = M.nome || 'esta vitrine'; });
  document.querySelectorAll('[data-texto]').forEach(function (el) {
    var valor = T[el.getAttribute('data-texto')];
    if (valor) el.textContent = valor;
  });
  document.querySelectorAll('[data-link]').forEach(function (el) {
    el.setAttribute('href', V.url.pagina(el.getAttribute('data-link')));
  });

  // Responsável e contato (só dados reais preenchidos na configuração)
  var email = String(contato.email || '').replace(/^mailto:/, '').trim();
  document.querySelectorAll('[data-responsavel]').forEach(function (el) {
    if (M.responsavel) el.textContent = M.responsavel;
  });
  document.querySelectorAll('[data-se-contato]').forEach(function (el) { el.hidden = !email; });
  document.querySelectorAll('[data-sem-contato]').forEach(function (el) { el.hidden = !!email; });
  document.querySelectorAll('[data-email]').forEach(function (el) {
    if (!email) return;
    el.textContent = '';
    el.appendChild(h('a', { href: 'mailto:' + email }, email));
  });
  if (!email && V.ehAdmin()) {
    document.querySelectorAll('[data-sem-contato]').forEach(function (el) {
      el.appendChild(h('span', { class: 'aviso-admin', style: { display: 'flex', 'margin-top': '12px' } }, [
        V.icone('alerta'),
        'Administração: preencha contato.email e responsavel em config/marca.js para exibir o contato aqui.'
      ]));
    });
  }

  document.querySelectorAll('[data-atualizado]').forEach(function (el) {
    el.textContent = V.formatarData(el.getAttribute('data-atualizado'));
  });

  var lugar404 = document.querySelector('[data-pixo-404]');
  if (lugar404) lugar404.appendChild(V.pixo('404', { classe: 'pixo-404 pixo--desenhar', semente: 9, traco: 2.6 }));

  if (document.body.dataset.titulo) {
    V.definirMeta({ titulo: document.body.dataset.titulo + ' · ' + (M.nome || 'Vitrine') });
  }
  V.revelar();
})();
