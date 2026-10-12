/* =========================================================================
   Pedidos de site → Google Sheets
   -------------------------------------------------------------------------
   Cole este código em Extensões › Apps Script da sua planilha e publique
   como "App da Web" (passo a passo no README). Cada pedido enviado pelo
   site vira uma linha na aba "Pedidos" e você recebe um e-mail de aviso.
   ========================================================================= */

/* Avisar por e-mail a cada pedido novo? (vai para o e-mail da sua conta Google) */
var AVISAR_POR_EMAIL = true;

/* Opcional: aviso também no WhatsApp pelo CallMeBot.
   Preencha só se o link de teste do CallMeBot funcionou para mensagens. */
var CALLMEBOT_TELEFONE = "";   // ex.: "556992691749"
var CALLMEBOT_APIKEY = "";     // ex.: "1234567"

var ABA = "Pedidos";
var CABECALHO = ["Data", "Nome", "Negócio", "Já tem site", "Prazo", "Ideia", "WhatsApp", "Responder"];

/* Recebe o pedido enviado pelo site */
function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents).dados || {};

    // Limita o tamanho de cada campo para evitar abusos
    function campo(valor, max) {
      return String(valor || "").trim().slice(0, max);
    }

    var pedido = {
      nome: campo(dados.nome, 60),
      negocio: campo(dados.negocio, 100),
      temSite: campo(dados.temSite, 40),
      prazo: campo(dados.prazo, 40),
      ideia: campo(dados.ideia, 2000),
      whatsapp: campo(dados.whatsapp, 20)
    };

    if (!pedido.nome || !pedido.ideia || !pedido.whatsapp) {
      return resposta({ ok: false, erro: "Campos obrigatórios em branco" });
    }

    var link = "https://wa.me/55" + pedido.whatsapp.replace(/\D/g, "");

    // Trava para dois pedidos simultâneos não se sobrescreverem
    var trava = LockService.getScriptLock();
    trava.waitLock(10000);
    try {
      aba().appendRow([
        new Date(), pedido.nome, pedido.negocio, pedido.temSite, pedido.prazo,
        pedido.ideia, pedido.whatsapp, link
      ]);
    } finally {
      trava.releaseLock();
    }

    var texto = montarTexto(pedido, link);

    if (AVISAR_POR_EMAIL) {
      MailApp.sendEmail({
        to: Session.getEffectiveUser().getEmail(),
        subject: "Novo pedido de site: " + pedido.nome + " (" + pedido.negocio + ")",
        body: texto + "\n\nPlanilha: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      });
    }

    if (CALLMEBOT_TELEFONE && CALLMEBOT_APIKEY) {
      UrlFetchApp.fetch(
        "https://api.callmebot.com/whatsapp.php?phone=" + CALLMEBOT_TELEFONE +
        "&text=" + encodeURIComponent(texto) + "&apikey=" + CALLMEBOT_APIKEY,
        { muteHttpExceptions: true }
      );
    }

    return resposta({ ok: true });
  } catch (erro) {
    return resposta({ ok: false, erro: String(erro) });
  }
}

/* Abrir o endereço do app no navegador mostra esta mensagem (teste rápido) */
function doGet() {
  return resposta({ ok: true, mensagem: "Recebedor de pedidos funcionando." });
}

/* Rode esta função uma vez pelo editor para autorizar e-mail e planilha */
function testar() {
  doPost({ postData: { contents: JSON.stringify({ dados: {
    nome: "Teste", negocio: "Restaurante", ideia: "Pedido de teste do site.",
    whatsapp: "(69) 99999-9999"
  } }) } });
}

function aba() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var folha = planilha.getSheetByName(ABA);
  if (!folha) {
    folha = planilha.insertSheet(ABA);
    folha.appendRow(CABECALHO);
    folha.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
    folha.setFrozenRows(1);
    folha.setColumnWidth(6, 420);
  }
  return folha;
}

function montarTexto(p, link) {
  var linhas = [
    "NOVO PEDIDO DE SITE",
    "",
    "Cliente: " + p.nome,
    "Negócio: " + p.negocio
  ];
  if (p.temSite) linhas.push("Já tem site: " + p.temSite);
  if (p.prazo) linhas.push("Prazo: " + p.prazo);
  return linhas.concat(["", "Ideia:", p.ideia, "", "WhatsApp: " + p.whatsapp, "Responder: " + link]).join("\n");
}

function resposta(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
