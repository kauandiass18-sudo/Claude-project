/* Pizza Giba — painel administrativo */
(function () {
  "use strict";
  var KEY = "giba:data";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var money = function (v) { return "R$ " + Number(v || 0).toFixed(2).replace(".", ","); };
  var num = function (v) { v = String(v == null ? "" : v).trim().replace(/\./g, "").replace(",", "."); if (v === "") return null; var n = parseFloat(v); return isNaN(n) ? null : Math.round(n * 100) / 100; };
  var slug = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item"; };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  var BASE = window.GIBA || {};
  var D;
  try { var ov = localStorage.getItem(KEY); D = ov ? JSON.parse(ov) : null; } catch (e) { D = null; }
  var local = !!(D && D.produtos);
  if (!local) D = clone(BASE);
  D.produtos = D.produtos || []; D.promocoes = D.promocoes || []; D.avaliacoes = D.avaliacoes || []; D.horarios = D.horarios || []; D.destaques = D.destaques || [];
  D.categorias = D.categorias || []; D.tamanhos = D.tamanhos || [{ id: "G", nome: "Grande" }, { id: "M", nome: "Média" }];
  D.entrega = D.entrega || { ativo: true, retirada: true, taxa: null, tempo: "" };
  var PAGS = [{ id: "pix", nome: "Pix" }, { id: "credito", nome: "Cartão de crédito" }, { id: "debito", nome: "Cartão de débito" }, { id: "dinheiro", nome: "Dinheiro" }];

  var savedEl = $("[data-saved]"), tT;
  function toast(m) { var t = $("[data-toast]"); t.textContent = m; t.classList.add("is-on"); clearTimeout(tT); tT = setTimeout(function () { t.classList.remove("is-on"); }, 2200); }
  function save(msg) {
    try { localStorage.setItem(KEY, JSON.stringify(D)); local = true; }
    catch (e) { toast("Não foi possível salvar neste navegador (espaço cheio?). Reduza fotos."); return; }
    var d = new Date(); savedEl.textContent = "Salvo neste navegador às " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    if (msg) toast(msg);
    pubInfo();
  }
  function pubInfo() { var el = $("[data-pub-info]"); el.textContent = local ? "Há alterações salvas neste navegador que ainda não foram publicadas no arquivo." : "Nenhuma alteração local: o site está lendo o arquivo cardapio.js publicado."; }
  savedEl.textContent = local ? "Alterações locais carregadas" : "Lendo o arquivo publicado";
  pubInfo();

  /* ---------- Abas ---------- */
  $("[data-tabs]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]"); if (!b) return;
    $$("[data-tab]").forEach(function (x) { x.classList.toggle("is-on", x === b); });
    $$("[data-panel]").forEach(function (p) { p.classList.toggle("is-on", p.getAttribute("data-panel") === b.getAttribute("data-tab")); });
  });

  /* ---------- Produtos ---------- */
  var catFilter = "todos", prodQuery = "";
  var catName = function (id) { var c = D.categorias.filter(function (c) { return c.id === id; })[0]; return c ? c.nome : id; };
  var isPizzaCat = function (id) { var c = D.categorias.filter(function (c) { return c.id === id; })[0]; return !!(c && c.tipo === "pizza"); };
  function renderCatFilter() {
    var box = $("[data-cat-filter]");
    box.innerHTML = '<button type="button" data-f="todos"' + (catFilter === "todos" ? ' class="is-on"' : "") + ">Todos</button>" +
      D.categorias.filter(function (c) { return c.id !== "promocoes"; }).map(function (c) { return '<button type="button" data-f="' + esc(c.id) + '"' + (catFilter === c.id ? ' class="is-on"' : "") + ">" + esc(c.nome) + "</button>"; }).join("");
  }
  $("[data-cat-filter]").addEventListener("click", function (e) { var b = e.target.closest("[data-f]"); if (!b) return; catFilter = b.getAttribute("data-f"); renderProducts(); });
  $("[data-prod-search]").addEventListener("input", function (e) { prodQuery = e.target.value.trim().toLowerCase(); renderProducts(); });

  function priceCell(p) {
    if (p.precos) return D.tamanhos.map(function (t) { return p.precos[t.id] != null ? "<small>" + esc(t.nome) + "</small>" + money(p.precos[t.id]) : ""; }).join("");
    return (p.precoAntigo ? "<small><s>" + money(p.precoAntigo) + "</s></small>" : "") + money(p.preco);
  }
  function rowHTML(p, i, kind) {
    var img = p.foto ? '<img src="' + esc(p.foto) + '" alt="">' : esc((p.nome || "?").replace(/^[ÀA]\s/, "").charAt(0));
    return '<div class="prow' + (p.ativo === false ? " is-off" : "") + '" data-row="' + i + '" data-kind="' + kind + '">' +
      '<div class="prow__img">' + img + "</div>" +
      '<div><div class="prow__name">' + esc(p.nome) + (kind === "produto" ? '<span class="pill">' + esc(catName(p.cat)) + (p.grupo ? " · " + esc(p.grupo) : "") + "</span>" : "") + (p.novidade ? '<span class="pill">Novidade</span>' : "") + (D.destaques.indexOf(p.id) > -1 ? '<span class="pill">Destaque</span>' : "") + '</div><div class="prow__desc">' + esc(p.desc || "") + "</div></div>" +
      '<div class="prow__price">' + priceCell(p) + "</div>" +
      '<button type="button" class="sw' + (p.ativo !== false ? " is-on" : "") + '" data-toggle title="Ativar/desativar" aria-label="Ativar ou desativar"></button>' +
      '<div class="mv"><button type="button" class="icon" data-up title="Subir">↑</button><button type="button" class="icon" data-down title="Descer">↓</button><button type="button" class="icon" data-edit title="Editar">✎</button></div></div>';
  }
  function renderProducts() {
    renderCatFilter();
    var box = $("[data-prod-list]");
    var html = D.produtos.map(function (p, i) {
      if (catFilter !== "todos" && p.cat !== catFilter) return "";
      if (prodQuery && (p.nome + " " + (p.desc || "")).toLowerCase().indexOf(prodQuery) < 0) return "";
      return rowHTML(p, i, "produto");
    }).join("");
    box.innerHTML = html || '<p class="empty">Nenhum produto aqui.</p>';
  }
  function renderPromos() {
    var box = $("[data-promo-list]");
    box.innerHTML = D.promocoes.map(function (p, i) { return rowHTML(p, i, "promo"); }).join("") || '<p class="empty">Nenhuma promoção cadastrada. A seção fica escondida no site.</p>';
  }
  function listOf(kind) { return kind === "promo" ? D.promocoes : D.produtos; }
  document.addEventListener("click", function (e) {
    var row = e.target.closest("[data-row]"); if (!row) return;
    var i = +row.getAttribute("data-row"), kind = row.getAttribute("data-kind"), list = listOf(kind);
    if (e.target.closest("[data-toggle]")) { list[i].ativo = list[i].ativo === false; save(list[i].ativo === false ? "Item desativado" : "Item ativado"); rerender(); }
    else if (e.target.closest("[data-up]") && i > 0) { list.splice(i - 1, 0, list.splice(i, 1)[0]); save(); rerender(); }
    else if (e.target.closest("[data-down]") && i < list.length - 1) { list.splice(i + 1, 0, list.splice(i, 1)[0]); save(); rerender(); }
    else if (e.target.closest("[data-edit]")) openEditor(kind, i);
  });
  function rerender() { renderProducts(); renderPromos(); renderDestaques(); }

  /* ---------- Editor ---------- */
  var modal = $("[data-modal]"), form = $("[data-prod-form]"), editing = null, photoData = "";
  $("[data-new-product]").addEventListener("click", function () { openEditor("produto", -1); });
  $("[data-new-promo]").addEventListener("click", function () { openEditor("promo", -1); });
  $$("[data-modal-close]").forEach(function (b) { b.addEventListener("click", closeEditor); });
  function closeEditor() { modal.classList.remove("is-on"); editing = null; }
  function openEditor(kind, i) {
    editing = { kind: kind, i: i };
    var p = i >= 0 ? listOf(kind)[i] : (kind === "promo" ? { cat: "promocoes", nome: "", desc: "", preco: null } : { cat: catFilter !== "todos" ? catFilter : (D.categorias[0] || {}).id, nome: "", desc: "" });
    $("[data-modal-title]").textContent = i >= 0 ? "Editar " + (kind === "promo" ? "promoção" : "produto") : (kind === "promo" ? "Nova promoção" : "Novo produto");
    var sel = form.elements.cat;
    sel.innerHTML = D.categorias.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.nome) + "</option>"; }).join("");
    sel.value = p.cat || ""; sel.disabled = kind === "promo";
    form.elements.nome.value = p.nome || ""; form.elements.grupo.value = p.grupo || ""; form.elements.desc.value = p.desc || "";
    form.elements.opcoes.value = (p.opcoes || []).join(", ");
    form.elements.temTamanhos.checked = !!p.precos || (i < 0 && kind !== "promo" && isPizzaCat(p.cat));
    var pt = $("[data-precos-tamanhos]");
    pt.innerHTML = D.tamanhos.map(function (t) { return "<label>" + esc(t.nome) + ' (R$)<input name="preco_' + esc(t.id) + '" inputmode="decimal" value="' + (p.precos && p.precos[t.id] != null ? String(p.precos[t.id]).replace(".", ",") : "") + '"></label>'; }).join("");
    form.elements.preco.value = p.preco != null ? String(p.preco).replace(".", ",") : "";
    form.elements.precoAntigo.value = p.precoAntigo != null ? String(p.precoAntigo).replace(".", ",") : "";
    form.elements.ativo.checked = p.ativo !== false; form.elements.novidade.checked = !!p.novidade;
    form.elements.destaque.checked = D.destaques.indexOf(p.id) > -1;
    photoData = p.foto && p.foto.indexOf("data:") === 0 ? p.foto : "";
    form.elements.foto.value = photoData ? "" : (p.foto || "");
    $("[data-prod-delete]").style.visibility = i >= 0 ? "visible" : "hidden";
    syncPriceMode(); syncPhoto();
    modal.classList.add("is-on"); form.elements.nome.focus();
  }
  function syncPriceMode() { var t = form.elements.temTamanhos.checked; $("[data-precos-tamanhos]").style.display = t ? "" : "none"; $("[data-preco-unico]").style.display = t ? "none" : ""; }
  form.elements.temTamanhos.addEventListener("change", syncPriceMode);
  form.elements.cat.addEventListener("change", function () { if (editing && editing.i < 0) { form.elements.temTamanhos.checked = isPizzaCat(form.elements.cat.value); syncPriceMode(); } });
  function syncPhoto() {
    var src = photoData || form.elements.foto.value.trim();
    $("[data-photo-prev]").innerHTML = src ? '<img src="' + esc(src) + '" alt="">' : "sem foto";
  }
  form.elements.foto.addEventListener("input", function () { photoData = ""; syncPhoto(); });
  $("[data-photo-clear]").addEventListener("click", function () { photoData = ""; form.elements.foto.value = ""; syncPhoto(); });
  $("[data-photo-file]").addEventListener("change", function (e) {
    var f = e.target.files[0]; if (!f) return;
    var img = new Image(); var url = URL.createObjectURL(f);
    img.onload = function () {
      var max = 900, s = Math.min(1, max / Math.max(img.width, img.height));
      var c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      photoData = c.toDataURL("image/jpeg", .82); form.elements.foto.value = ""; URL.revokeObjectURL(url); syncPhoto();
      toast("Foto pronta (" + Math.round(photoData.length * .75 / 1024) + " KB)");
    };
    img.src = url; e.target.value = "";
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault(); if (!editing) return;
    var kind = editing.kind, list = listOf(kind), i = editing.i;
    var p = i >= 0 ? list[i] : {};
    p.nome = form.elements.nome.value.trim(); if (!p.nome) return;
    if (i < 0) { var base = slug(p.nome), id = base, n = 2; while (D.produtos.concat(D.promocoes).some(function (x) { return x.id === id; })) id = base + "-" + n++; p.id = id; }
    p.cat = kind === "promo" ? "promocoes" : form.elements.cat.value;
    p.grupo = form.elements.grupo.value.trim() || undefined;
    p.desc = form.elements.desc.value.trim();
    var ops = form.elements.opcoes.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean); if (ops.length) p.opcoes = ops; else delete p.opcoes;
    if (form.elements.temTamanhos.checked) {
      p.precos = {}; D.tamanhos.forEach(function (t) { var v = num(form.elements["preco_" + t.id].value); if (v != null) p.precos[t.id] = v; });
      delete p.preco; delete p.precoAntigo;
      if (!Object.keys(p.precos).length) { toast("Informe pelo menos um preço."); return; }
    } else {
      delete p.precos; p.preco = num(form.elements.preco.value); var pa = num(form.elements.precoAntigo.value); if (pa != null) p.precoAntigo = pa; else delete p.precoAntigo;
      if (p.preco == null) { toast("Informe o preço."); return; }
    }
    p.foto = photoData || form.elements.foto.value.trim() || undefined; if (!p.foto) delete p.foto;
    p.ativo = form.elements.ativo.checked ? undefined : false; if (p.ativo === undefined) delete p.ativo;
    if (form.elements.novidade.checked) p.novidade = true; else delete p.novidade;
    var di = D.destaques.indexOf(p.id);
    if (form.elements.destaque.checked && di < 0) D.destaques.push(p.id); else if (!form.elements.destaque.checked && di > -1) D.destaques.splice(di, 1);
    if (i < 0) list.push(p);
    save(i < 0 ? "Item criado" : "Item salvo"); closeEditor(); rerender();
  });
  $("[data-prod-delete]").addEventListener("click", function () {
    if (!editing || editing.i < 0) return;
    var list = listOf(editing.kind), p = list[editing.i];
    if (!confirm('Excluir "' + p.nome + '"? Para só tirar do site, prefira desativar.')) return;
    list.splice(editing.i, 1); var di = D.destaques.indexOf(p.id); if (di > -1) D.destaques.splice(di, 1);
    save("Item excluído"); closeEditor(); rerender();
  });

  /* ---------- Informações ---------- */
  var info = $("[data-info-form]");
  function fillInfo() {
    ["nome", "slogan", "whatsapp", "telefone", "instagram", "instagramUser", "endereco", "cidade", "mapsUrl", "mapsEmbed"].forEach(function (k) { info.elements[k].value = D[k] || ""; });
    renderHorarios();
    var f = D.funcionamento;
    info.elements.func_on.checked = !!(f && f.dias);
    var toTime = function (h) { if (h == null) return ""; var hh = Math.floor(h), mm = Math.round((h - hh) * 60); return ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2); };
    info.elements.func_abre.value = f ? toTime(f.abre) : ""; info.elements.func_fecha.value = f ? toTime(f.fecha) : "";
    var names = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    $("[data-days]").innerHTML = names.map(function (n, i) { return '<label><input type="checkbox" name="dia" value="' + i + '"' + (f && f.dias && f.dias.indexOf(i) > -1 ? " checked" : "") + "> " + n + "</label>"; }).join("");
    info.elements.entrega_ativo.checked = D.entrega.ativo !== false; info.elements.entrega_retirada.checked = D.entrega.retirada !== false;
    info.elements.entrega_taxa.value = D.entrega.taxa != null ? String(D.entrega.taxa).replace(".", ",") : ""; info.elements.entrega_tempo.value = D.entrega.tempo || "";
    var cur = (D.pagamentos || []).map(function (p) { return p.id; });
    $("[data-pagamentos]").innerHTML = PAGS.map(function (p) { return '<label><input type="checkbox" name="pag" value="' + p.id + '"' + (cur.indexOf(p.id) > -1 ? " checked" : "") + "> " + p.nome + "</label>"; }).join("");
    renderDestaques();
  }
  function renderHorarios() {
    $("[data-horarios]").innerHTML = D.horarios.map(function (h, i) { return '<div class="r"><input placeholder="Dias (ex.: Terça a domingo)" data-h="dias" data-i="' + i + '" value="' + esc(h.dias) + '"><input placeholder="Horas (ex.: 18h às 23h)" data-h="horas" data-i="' + i + '" value="' + esc(h.horas) + '"><button type="button" class="icon" data-h-rm="' + i + '" title="Remover">×</button></div>'; }).join("") || '<p class="help">Nenhum horário cadastrado: o site pede para consultar pelo WhatsApp.</p>';
  }
  function renderDestaques() {
    var box = $("[data-destaques]"); if (!box) return;
    box.innerHTML = D.produtos.filter(function (p) { return p.ativo !== false; }).map(function (p) { return '<label><input type="checkbox" name="dest" value="' + esc(p.id) + '"' + (D.destaques.indexOf(p.id) > -1 ? " checked" : "") + "> " + esc(p.nome) + "</label>"; }).join("");
  }
  $("[data-add-horario]").addEventListener("click", function () { D.horarios.push({ dias: "", horas: "" }); renderHorarios(); });
  $("[data-horarios]").addEventListener("input", function (e) { var el = e.target; if (!el.hasAttribute("data-h")) return; D.horarios[+el.getAttribute("data-i")][el.getAttribute("data-h")] = el.value; save(); });
  $("[data-horarios]").addEventListener("click", function (e) { var b = e.target.closest("[data-h-rm]"); if (!b) return; D.horarios.splice(+b.getAttribute("data-h-rm"), 1); save(); renderHorarios(); });
  var iT;
  info.addEventListener("input", function () { clearTimeout(iT); iT = setTimeout(readInfo, 250); });
  info.addEventListener("change", readInfo);
  function readInfo() {
    ["nome", "slogan", "whatsapp", "telefone", "instagram", "instagramUser", "endereco", "cidade", "mapsUrl", "mapsEmbed"].forEach(function (k) { D[k] = info.elements[k].value.trim(); });
    D.whatsapp = D.whatsapp.replace(/\D/g, "");
    var m = D.mapsEmbed.match(/src="([^"]+)"/); if (m) { D.mapsEmbed = m[1]; info.elements.mapsEmbed.value = m[1]; }
    if (info.elements.func_on.checked) {
      var toH = function (t) { if (!t) return null; var a = t.split(":"); return (+a[0]) + (+a[1]) / 60; };
      var dias = $$('[name="dia"]:checked', info).map(function (c) { return +c.value; });
      var abre = toH(info.elements.func_abre.value), fecha = toH(info.elements.func_fecha.value);
      D.funcionamento = (dias.length && abre != null && fecha != null) ? { dias: dias, abre: abre, fecha: fecha } : null;
    } else D.funcionamento = null;
    D.entrega = { ativo: info.elements.entrega_ativo.checked, retirada: info.elements.entrega_retirada.checked, taxa: num(info.elements.entrega_taxa.value), tempo: info.elements.entrega_tempo.value.trim() };
    D.pagamentos = PAGS.filter(function (p) { return $$('[name="pag"]:checked', info).some(function (c) { return c.value === p.id; }); });
    D.destaques = $$('[name="dest"]:checked', info).map(function (c) { return c.value; });
    save();
    renderProducts();
  }

  /* ---------- Avaliações ---------- */
  function renderReviews() {
    var box = $("[data-review-list]");
    box.innerHTML = D.avaliacoes.map(function (r, i) {
      return '<div class="card" data-rev="' + i + '"><div class="grid2"><label>Nome<input data-r="nome" value="' + esc(r.nome || "") + '"></label><label>Nota (1 a 5)<input data-r="nota" type="number" min="1" max="5" value="' + esc(r.nota || 5) + '"></label></div>' +
        '<label style="margin-top:10px">Texto<textarea data-r="texto" rows="3">' + esc(r.texto || "") + "</textarea></label>" +
        '<div class="grid2" style="margin-top:10px"><label>Data ou origem <small>ex.: maio de 2025 · Google</small><input data-r="data" value="' + esc(r.data || "") + '"></label><div style="display:flex;align-items:end"><button type="button" class="btn btn--danger btn--sm" data-rev-rm>Remover</button></div></div></div>';
    }).join("") || '<p class="empty">Nenhuma avaliação cadastrada.</p>';
  }
  $("[data-new-review]").addEventListener("click", function () { D.avaliacoes.push({ nome: "", nota: 5, texto: "", data: "" }); save(); renderReviews(); });
  $("[data-review-list]").addEventListener("input", function (e) { var el = e.target, c = el.closest("[data-rev]"); if (!c || !el.hasAttribute("data-r")) return; var r = D.avaliacoes[+c.getAttribute("data-rev")]; var k = el.getAttribute("data-r"); r[k] = k === "nota" ? Math.max(1, Math.min(5, +el.value || 5)) : el.value; clearTimeout(iT); iT = setTimeout(function () { save(); }, 250); });
  $("[data-review-list]").addEventListener("click", function (e) { var b = e.target.closest("[data-rev-rm]"); if (!b) return; var c = b.closest("[data-rev]"); D.avaliacoes.splice(+c.getAttribute("data-rev"), 1); save("Avaliação removida"); renderReviews(); });

  /* ---------- Publicar ---------- */
  function fileText() {
    var head = "/*\n * Pizza Giba — dados do site\n * Gerado pelo painel (admin.html) em " + new Date().toLocaleString("pt-BR") + ".\n * Para editar: abra admin.html, altere e baixe este arquivo de novo.\n */\n";
    return head + "window.GIBA = " + JSON.stringify(D, null, 2) + ";\n";
  }
  $$("[data-download]").forEach(function (b) {
    b.addEventListener("click", function () {
      var blob = new Blob([fileText()], { type: "text/javascript;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "cardapio.js"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      toast("Arquivo gerado. Substitua data/cardapio.js na hospedagem.");
    });
  });
  $("[data-import]").addEventListener("change", function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var txt = String(r.result), obj;
        if (/^\s*\{/.test(txt)) obj = JSON.parse(txt);
        else { var w = {}; new Function("window", txt)(w); obj = w.GIBA; }
        if (!obj || !obj.produtos) throw new Error("formato");
        D = obj; D.promocoes = D.promocoes || []; D.avaliacoes = D.avaliacoes || []; D.horarios = D.horarios || []; D.destaques = D.destaques || []; D.entrega = D.entrega || {};
        save("Arquivo importado"); rerender(); fillInfo(); renderReviews();
      } catch (err) { toast("Não consegui ler este arquivo."); }
      e.target.value = "";
    };
    r.readAsText(f);
  });
  $("[data-reset]").addEventListener("click", function () {
    if (!confirm("Descartar as alterações feitas neste navegador e voltar ao arquivo publicado?")) return;
    localStorage.removeItem(KEY); location.reload();
  });

  rerender(); fillInfo(); renderReviews();
})();
