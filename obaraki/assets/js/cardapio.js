/* ==========================================================================
   OBARAKI · CARDÁPIO
   Uma seção por categoria, barra de categorias fixa e destaque automático
   da categoria visível.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.OBK.store;
  var U = window.OBK.ui;
  var $ = U.$;
  var $$ = U.$$;
  var esc = U.esc;

  var bar = $("[data-cats]");
  var menu = $("[data-menu]");
  var spy;

  function sectionHTML(c) {
    var items = S.products({ category: c.id });
    var head =
      '<div class="menu-section-head"><h2>' +
      esc(c.name) +
      '</h2><span class="jp" aria-hidden="true">' +
      esc(c.kanji || "") +
      "</span>" +
      (items.length ? '<span class="count">' + items.length + (items.length > 1 ? " itens" : " item") + "</span>" : "") +
      "</div>";

    if (!items.length) {
      return (
        '<section class="menu-section" id="cat-' +
        esc(c.id) +
        '" data-cat-section="' +
        esc(c.id) +
        '">' +
        head +
        '<div class="menu-empty"><span>Os itens de ' +
        esc(c.name.toLowerCase()) +
        " estão sendo atualizados no cardápio online.</span>" +
        '<a target="_blank" rel="noopener" href="' +
        U.waHref("Olá! Quais opções de " + c.name + " vocês têm hoje?") +
        '">Consultar no WhatsApp →</a></div></section>'
      );
    }

    var body;
    if (c.id === "combos") {
      var combos = items.filter(function (p) {
        return p.kind !== "executivo";
      });
      var exec = items.filter(function (p) {
        return p.kind === "executivo";
      });
      body =
        (combos.length
          ? '<div class="grid-cards">' +
            combos
              .map(function (p) {
                return U.card(p, "combo");
              })
              .join("") +
            "</div>"
          : "") +
        (exec.length ? '<h3 class="menu-sub">Combos executivos</h3><div class="exec-grid">' + exec.map(U.execCard).join("") + "</div>" : "");
    } else {
      body =
        '<div class="grid-cards grid-cards--4">' +
        items
          .map(function (p) {
            return U.card(p);
          })
          .join("") +
        "</div>";
    }
    return '<section class="menu-section" id="cat-' + esc(c.id) + '" data-cat-section="' + esc(c.id) + '">' + head + body + "</section>";
  }

  function render() {
    var cats = S.categories();
    bar.innerHTML = cats
      .map(function (c) {
        return '<a class="chip" href="#cat-' + esc(c.id) + '" data-chip="' + esc(c.id) + '">' + esc(c.name) + "</a>";
      })
      .join("");
    /* Categorias com produtos primeiro na página? Não: respeita a ordem
       definida no painel, que é a mesma da barra. */
    menu.innerHTML = cats.map(sectionHTML).join("");
    U.hydrate(menu);
    setupSpy();
  }

  function setActive(id) {
    $$("[data-chip]", bar).forEach(function (chip) {
      var on = chip.getAttribute("data-chip") === id;
      chip.classList.toggle("is-active", on);
      if (on) {
        var left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2;
        bar.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      }
    });
  }

  function setupSpy() {
    if (spy) spy.disconnect();
    var sections = $$("[data-cat-section]", menu);
    if (!sections.length) return;
    setActive(sections[0].getAttribute("data-cat-section"));
    if (!("IntersectionObserver" in window)) return;
    spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setActive(en.target.getAttribute("data-cat-section"));
        });
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  bar.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-chip]");
    if (!chip) return;
    e.preventDefault();
    var id = chip.getAttribute("data-chip");
    var t = document.getElementById("cat-" + id);
    if (t) {
      t.scrollIntoView({ behavior: "smooth" });
      setActive(id);
      try {
        history.replaceState(null, "", "#cat-" + id);
      } catch (err) {}
    }
  });

  render();
  window.addEventListener("obk:data", render);

  /* Âncora inicial (ex.: cardapio.html#cat-temaki) */
  var m = location.hash.match(/^#cat-([\w-]+)/);
  if (m) {
    setTimeout(function () {
      var t = document.getElementById("cat-" + m[1]);
      if (t) {
        t.scrollIntoView();
        setActive(m[1]);
      }
    }, 60);
  }
})();
