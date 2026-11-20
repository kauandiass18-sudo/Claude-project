const $ = (id) => document.getElementById(id);

chrome.storage.local.get(["apiKey", "language", "effort"]).then(({ apiKey = "", language = "português do Brasil", effort = "medium" }) => {
  $("apiKey").value = apiKey;
  $("language").value = language;
  $("effort").value = effort;
});

$("toggle").addEventListener("click", () => {
  const show = $("apiKey").type === "password";
  $("apiKey").type = show ? "text" : "password";
  $("toggle").textContent = show ? "Ocultar" : "Mostrar";
});

$("save").addEventListener("click", async () => {
  await chrome.storage.local.set({
    apiKey: $("apiKey").value.trim(),
    language: $("language").value,
    effort: $("effort").value,
  });
  $("saved").textContent = "Salvo ✓";
  setTimeout(() => ($("saved").textContent = ""), 2000);
});
