/* Política de privacidade — preenche os dados da empresa a partir de config.js. */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var marca = SITE.marca || {};
  var NOME = marca.nome || 'Alvéa';
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var setText = function (sel, txt) { $$(sel).forEach(function (el) { el.textContent = txt; }); };

  document.title = 'Política de privacidade | ' + NOME;
  setText('[data-brand-name]', NOME);
  setText('[data-empresa]', NOME);
  if (marca.complemento) setText('[data-brand-tag]', marca.complemento);
  setText('[data-year]', String(new Date().getFullYear()));

  if (SITE.razaoSocial || SITE.cnpj) {
    var partes = [SITE.razaoSocial || NOME];
    if (SITE.cnpj) partes.push('inscrita no CNPJ sob o nº ' + SITE.cnpj);
    if (SITE.cidade) partes.push('com atuação em ' + [SITE.cidade, SITE.estado].filter(Boolean).join(' — '));
    setText('[data-controlador]', 'O responsável pelo tratamento dos dados é ' + partes.join(', ') + '.');
  }

  var numero = String(SITE.whatsapp || '').replace(/\D/g, '');
  $$('[data-wa-link]').forEach(function (a) {
    a.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent('Olá! Tenho uma dúvida sobre a política de privacidade da ' + NOME + '.');
  });
  if (SITE.email) {
    $$('[data-contato]').forEach(function (p) {
      var a = document.createElement('a');
      a.href = 'mailto:' + SITE.email;
      a.textContent = SITE.email;
      p.appendChild(document.createTextNode(' Se preferir, escreva para '));
      p.appendChild(a);
      p.appendChild(document.createTextNode('.'));
    });
  }
})();
