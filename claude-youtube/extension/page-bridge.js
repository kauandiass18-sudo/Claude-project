// Roda no "mundo" da página do YouTube para ler os dados do player
// (o content script normal não enxerga as variáveis da página).
window.addEventListener("message", (e) => {
  if (e.source !== window || e.data?.type !== "claude-yt:get-player-response") return;
  let data = null;
  try {
    const player = document.getElementById("movie_player");
    const resp = player?.getPlayerResponse?.() ?? window.ytInitialPlayerResponse ?? null;
    if (resp) {
      data = {
        videoId: resp.videoDetails?.videoId ?? null,
        title: resp.videoDetails?.title ?? "",
        channel: resp.videoDetails?.author ?? "",
        description: resp.videoDetails?.shortDescription ?? "",
        captionTracks: resp.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [],
      };
    }
  } catch (_) {}
  window.postMessage({ type: "claude-yt:player-response", id: e.data.id, data }, "*");
});
