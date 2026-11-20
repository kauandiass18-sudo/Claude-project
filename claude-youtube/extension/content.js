// Painel do Claude dentro da página de vídeo do YouTube.
(() => {
  const QUICK_ACTIONS = [
    { label: "Resumir", prompt: "Faça um resumo deste vídeo: comece com uma frase dizendo do que se trata e depois liste os pontos principais, com o tempo de cada um." },
    { label: "Pontos-chave", prompt: "Liste as ideias, dicas ou conclusões mais importantes do vídeo, cada uma com o tempo [mm:ss] onde aparece." },
    { label: "Vale a pena?", prompt: "Em poucas linhas: o que eu ganho assistindo esse vídeo inteiro, para quem ele é, e quais partes posso pular (com os tempos)?" },
    { label: "Explicar simples", prompt: "Explique o conteúdo deste vídeo de forma bem simples, como se eu não soubesse nada do assunto." },
  ];

  let state = { videoId: null, video: null, loadingVideo: null, messages: [], port: null, busy: false };
  let host, root, els;

  // ---------- Dados do vídeo ----------

  function currentVideoId() {
    const u = new URL(location.href);
    if (u.pathname === "/watch") return u.searchParams.get("v");
    const m = u.pathname.match(/^\/(?:shorts|live)\/([\w-]{6,})/);
    return m ? m[1] : null;
  }

  function getPlayerResponse() {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).slice(2);
      const onMsg = (e) => {
        if (e.source === window && e.data?.type === "claude-yt:player-response" && e.data.id === id) {
          window.removeEventListener("message", onMsg);
          resolve(e.data.data);
        }
      };
      window.addEventListener("message", onMsg);
      window.postMessage({ type: "claude-yt:get-player-response", id }, "*");
      setTimeout(() => { window.removeEventListener("message", onMsg); resolve(null); }, 2000);
    });
  }

  function fmtTime(sec) {
    sec = Math.floor(sec);
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const mm = h ? String(m).padStart(2, "0") : String(m);
    return h ? `${h}:${mm}:${String(s).padStart(2, "0")}` : `${mm}:${String(s).padStart(2, "0")}`;
  }

  function pickTrack(tracks) {
    if (!tracks?.length) return null;
    const pref = (navigator.language || "pt").slice(0, 2);
    const manual = tracks.filter((t) => t.kind !== "asr");
    return (
      manual.find((t) => t.languageCode?.startsWith(pref)) ||
      tracks.find((t) => t.languageCode?.startsWith(pref)) ||
      manual[0] || tracks[0]
    );
  }

  // Junta as legendas em linhas de ~20s com o tempo na frente: "[1:23] texto..."
  function groupLines(segments) {
    const lines = [];
    let cur = null;
    for (const { start, text } of segments) {
      const t = text.replace(/\s+/g, " ").trim();
      if (!t) continue;
      if (!cur || start - cur.start >= 20) {
        cur = { start, parts: [t] };
        lines.push(cur);
      } else cur.parts.push(t);
    }
    return lines.map((l) => `[${fmtTime(l.start)}] ${l.parts.join(" ")}`).join("\n");
  }

  async function transcriptFromTrack(track) {
    try {
      const url = new URL(track.baseUrl, location.origin);
      url.searchParams.set("fmt", "json3");
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) return "";
      const body = await res.text();
      if (!body) return "";
      const json = JSON.parse(body);
      const segs = (json.events || [])
        .filter((ev) => ev.segs)
        .map((ev) => ({ start: (ev.tStartMs || 0) / 1000, text: ev.segs.map((s) => s.utf8 || "").join("") }));
      return groupLines(segs);
    } catch (_) {
      return "";
    }
  }

  // Plano B: abre o painel "Mostrar transcrição" do próprio YouTube e lê o texto dele.
  async function transcriptFromPanel() {
    const btn = document.querySelector(
      "ytd-video-description-transcript-section-renderer button, button[aria-label*='ranscri']"
    );
    if (!btn) return "";
    const panel = () => document.querySelector(
      "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-searchable-transcript']"
    );
    const wasOpen = panel()?.getAttribute("visibility") === "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED";
    btn.click();
    let nodes = [];
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 150));
      nodes = document.querySelectorAll("ytd-transcript-segment-renderer");
      if (nodes.length) break;
    }
    const segs = [...nodes].map((n) => {
      const ts = n.querySelector(".segment-timestamp")?.textContent.trim() || "0:00";
      const parts = ts.split(":").map(Number);
      const start = parts.reduce((acc, v) => acc * 60 + v, 0);
      return { start, text: n.querySelector(".segment-text")?.textContent || "" };
    });
    if (!wasOpen) panel()?.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN");
    return groupLines(segs);
  }

  async function loadVideo(videoId) {
    let pr = null;
    for (let i = 0; i < 10; i++) {
      pr = await getPlayerResponse();
      if (pr?.videoId === videoId) break;
      await new Promise((r) => setTimeout(r, 400));
    }
    const video = {
      title: pr?.title || document.title.replace(/ - YouTube$/, ""),
      channel: pr?.channel || "",
      description: pr?.description || "",
      transcript: "",
    };
    const track = pickTrack(pr?.captionTracks);
    if (track) video.transcript = await transcriptFromTrack(track);
    if (!video.transcript) video.transcript = await transcriptFromPanel();
    return video;
  }

  // ---------- Interface ----------

  const CSS = `
    :host { all: initial; }
    * { box-sizing: border-box; }
    .panel {
      --bg: #ffffff; --fg: #0f0f0f; --muted: #606060; --line: #e5e5e5; --soft: #f2f2f2;
      --accent: #d97757; --accent-fg: #ffffff; --user: #f7ebe6;
      font: 14px/1.5 Roboto, Arial, sans-serif; color: var(--fg); background: var(--bg);
      border: 1px solid var(--line); border-radius: 12px; margin: 0 0 16px; overflow: hidden;
    }
    .panel.dark {
      --bg: #1f1f1f; --fg: #f1f1f1; --muted: #aaaaaa; --line: #3a3a3a; --soft: #2b2b2b;
      --user: #3a2a24;
    }
    header { display: flex; align-items: center; gap: 8px; padding: 10px 12px; cursor: pointer; user-select: none; }
    header .logo { width: 22px; height: 22px; border-radius: 50%; background: var(--accent); display: grid; place-items: center; color: #fff; font-weight: 700; font-size: 13px; }
    header .title { font-weight: 600; font-size: 15px; flex: 1; }
    header .status { color: var(--muted); font-size: 12px; }
    header .chev { color: var(--muted); transition: transform .2s; }
    .panel.collapsed .chev { transform: rotate(-90deg); }
    .panel.collapsed .body { display: none; }
    .body { border-top: 1px solid var(--line); }
    .quick { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 12px; }
    .quick button, .footer button {
      font: inherit; font-size: 13px; border: 1px solid var(--line); background: var(--soft); color: var(--fg);
      border-radius: 999px; padding: 5px 12px; cursor: pointer;
    }
    .quick button:hover { border-color: var(--accent); }
    button:disabled { opacity: .5; cursor: default; }
    .log { max-height: 460px; overflow-y: auto; padding: 0 12px; }
    .log:empty { display: none; }
    .msg { margin: 10px 0; word-wrap: break-word; }
    .msg.user { background: var(--user); border-radius: 10px; padding: 8px 10px; margin-left: 32px; }
    .msg.assistant h1, .msg.assistant h2, .msg.assistant h3 { font-size: 15px; margin: 10px 0 4px; }
    .msg.assistant p { margin: 6px 0; }
    .msg.assistant ul, .msg.assistant ol { margin: 6px 0; padding-left: 20px; }
    .msg.assistant code { background: var(--soft); padding: 1px 4px; border-radius: 4px; font-size: 13px; }
    .msg.error { color: #c5221f; }
    .panel.dark .msg.error { color: #f28b82; }
    .msg a.ts { color: var(--accent); text-decoration: none; font-weight: 600; cursor: pointer; }
    .msg a.ts:hover { text-decoration: underline; }
    .msg a.link { color: var(--accent); }
    .cursor::after { content: "▍"; color: var(--accent); animation: blink 1s steps(2) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
    form { display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid var(--line); }
    textarea {
      flex: 1; font: inherit; color: var(--fg); background: var(--soft); border: 1px solid var(--line);
      border-radius: 10px; padding: 8px 10px; resize: none; min-height: 38px; max-height: 120px; outline: none;
    }
    textarea:focus { border-color: var(--accent); }
    form button { font: inherit; border: 0; border-radius: 10px; padding: 0 14px; background: var(--accent); color: var(--accent-fg); cursor: pointer; font-weight: 600; }
    .footer { display: flex; justify-content: space-between; align-items: center; padding: 0 12px 10px; color: var(--muted); font-size: 12px; gap: 8px; }
    .footer button { padding: 3px 10px; font-size: 12px; }
  `;

  function el(tag, attrs = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const k of kids) n.append(k);
    return n;
  }

  function buildPanel() {
    host = el("div", { id: "claude-yt-host" });
    root = host.attachShadow({ mode: "open" });
    root.append(el("style", {}, CSS));

    const panel = el("div", { class: "panel" });
    const status = el("span", { class: "status" });
    const header = el("header", { onclick: toggleCollapsed },
      el("div", { class: "logo" }, "C"), el("div", { class: "title" }, "Claude"), status, el("span", { class: "chev" }, "▾"));

    const quick = el("div", { class: "quick" });
    for (const a of QUICK_ACTIONS) quick.append(el("button", { type: "button", onclick: () => ask(a.prompt, a.label) }, a.label));

    const log = el("div", { class: "log" });
    log.addEventListener("click", onLogClick);

    const input = el("textarea", { rows: "1", placeholder: "Pergunte algo sobre este vídeo…" });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
      e.stopPropagation(); // não deixa os atalhos do YouTube (k, j, l, f…) pegarem a digitação
    });
    input.addEventListener("keyup", (e) => e.stopPropagation());
    input.addEventListener("keypress", (e) => e.stopPropagation());
    input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = input.scrollHeight + "px"; });
    const send = el("button", { type: "submit" }, "Enviar");
    const form = el("form", { onsubmit: (e) => { e.preventDefault(); if (state.busy) return cancel(); const q = input.value.trim(); if (q) { input.value = ""; input.style.height = "auto"; ask(q); } } }, input, send);

    const info = el("span", {}, "");
    const clear = el("button", { type: "button", onclick: resetConversation }, "Nova conversa");
    const settings = el("button", { type: "button", onclick: () => chrome.runtime.sendMessage({ type: "open-options" }) }, "Configurações");
    const footer = el("div", { class: "footer" }, info, el("span", {}, clear, " ", settings));

    panel.append(header, el("div", { class: "body" }, quick, log, form, footer));
    root.append(panel);
    els = { panel, status, quick, log, input, send, info };

    chrome.storage.local.get("collapsed").then(({ collapsed }) => panel.classList.toggle("collapsed", !!collapsed));
    syncTheme();
    new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["dark"] });
  }

  function syncTheme() { els?.panel.classList.toggle("dark", document.documentElement.hasAttribute("dark")); }

  function toggleCollapsed() {
    const c = !els.panel.classList.contains("collapsed");
    els.panel.classList.toggle("collapsed", c);
    chrome.storage.local.set({ collapsed: c });
  }

  function mount() {
    const target = document.querySelector("#secondary-inner") || document.querySelector("#secondary");
    if (!target) return false;
    if (!host) buildPanel();
    if (host.parentElement !== target) target.prepend(host);
    host.style.display = "";
    return true;
  }

  function setBusy(b) {
    state.busy = b;
    els.send.textContent = b ? "Parar" : "Enviar";
    els.quick.querySelectorAll("button").forEach((x) => (x.disabled = b));
  }

  // ---------- Markdown simples (o texto é escapado antes, então é seguro) ----------

  function esc(s) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(/\[(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\]/g, (m, h, mi, s) => {
        const sec = (+(h || 0)) * 3600 + (+mi) * 60 + (+s);
        return `<a class="ts" data-t="${sec}">${m.slice(1, -1)}</a>`;
      })
      .replace(/(https?:\/\/[^\s<)]+)/g, '<a class="link" href="$1" target="_blank" rel="noopener">$1</a>');
  }

  function md(text) {
    const out = [];
    let list = null;
    const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
    for (const raw of text.split("\n")) {
      const line = raw.trimEnd();
      let m;
      if ((m = line.match(/^(#{1,4})\s+(.*)/))) { closeList(); out.push(`<h3>${inline(m[2])}</h3>`); }
      else if ((m = line.match(/^\s*[-*•]\s+(.*)/))) { if (list !== "ul") { closeList(); out.push("<ul>"); list = "ul"; } out.push(`<li>${inline(m[1])}</li>`); }
      else if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== "ol") { closeList(); out.push("<ol>"); list = "ol"; } out.push(`<li>${inline(m[1])}</li>`); }
      else if (!line.trim()) closeList();
      else { closeList(); out.push(`<p>${inline(line)}</p>`); }
    }
    closeList();
    return out.join("");
  }

  function onLogClick(e) {
    const a = e.target.closest("a.ts");
    if (!a) return;
    e.preventDefault();
    const v = document.querySelector("video");
    if (v) { v.currentTime = Number(a.dataset.t); v.play?.(); }
  }

  function addMsg(role, text = "") {
    const n = el("div", { class: `msg ${role}` });
    if (role === "assistant") n.innerHTML = md(text);
    else n.textContent = text;
    els.log.append(n);
    els.log.scrollTop = els.log.scrollHeight;
    return n;
  }

  // ---------- Conversa ----------

  function resetConversation() {
    cancel();
    state.messages = [];
    els.log.replaceChildren();
  }

  function cancel() { state.port?.postMessage({ type: "cancel" }); }

  async function ensureVideo() {
    if (state.video) return state.video;
    if (!state.loadingVideo) {
      const id = state.videoId;
      els.status.textContent = "lendo o vídeo…";
      state.loadingVideo = loadVideo(id).then((v) => {
        if (state.videoId !== id) return v;
        state.video = v;
        els.status.textContent = v.transcript ? "" : "sem transcrição";
        els.info.textContent = v.transcript ? "Transcrição carregada" : "Este vídeo não tem legendas — usando título e descrição";
        return v;
      });
    }
    return state.loadingVideo;
  }

  async function ask(prompt, shownAs) {
    if (state.busy) return;
    if (els.panel.classList.contains("collapsed")) toggleCollapsed();
    addMsg("user", shownAs || prompt);
    setBusy(true);
    const out = addMsg("assistant");
    out.classList.add("cursor");

    const video = await ensureVideo();
    state.messages.push({ role: "user", content: prompt });

    let text = "";
    const port = chrome.runtime.connect({ name: "claude-chat" });
    state.port = port;
    const finish = () => {
      out.classList.remove("cursor");
      setBusy(false);
      state.port = null;
      try { port.disconnect(); } catch (_) {}
    };
    port.onMessage.addListener((msg) => {
      if (msg.type === "delta") {
        text += msg.text;
        const atBottom = els.log.scrollHeight - els.log.scrollTop - els.log.clientHeight < 40;
        out.innerHTML = md(text);
        if (atBottom) els.log.scrollTop = els.log.scrollHeight;
      } else if (msg.type === "done") {
        if (text) state.messages.push({ role: "assistant", content: text });
        else state.messages.pop();
        finish();
      } else if (msg.type === "error") {
        state.messages.pop();
        out.classList.add("error");
        out.textContent = msg.message;
        if (msg.code === "no_key") {
          out.append(" ", el("a", { class: "link", href: "#", onclick: (e) => { e.preventDefault(); chrome.runtime.sendMessage({ type: "open-options" }); } }, "Abrir configurações"));
        }
        finish();
      }
    });
    port.onDisconnect.addListener(() => { if (state.busy && state.port === port) finish(); });
    port.postMessage({ type: "ask", video, messages: state.messages });
  }

  // ---------- Navegação (o YouTube troca de vídeo sem recarregar a página) ----------

  function onNavigate() {
    const id = currentVideoId();
    if (!id) { if (host) host.style.display = "none"; return; }
    if (id !== state.videoId) {
      cancel();
      state = { videoId: id, video: null, loadingVideo: null, messages: [], port: null, busy: false };
      if (els) { els.log.replaceChildren(); els.info.textContent = ""; els.status.textContent = ""; setBusy(false); }
    }
    let tries = 0;
    const t = setInterval(() => { if (mount() || ++tries > 40) clearInterval(t); }, 250);
  }

  document.addEventListener("yt-navigate-finish", onNavigate);
  onNavigate();
})();
