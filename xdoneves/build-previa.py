"""Gera ../xdoneves-previa.html: a página inteira num único arquivo (CSS, JS e logo embutidos)."""
import base64, pathlib, re
d = pathlib.Path(__file__).parent
html = (d / "index.html").read_text()
logo = "data:image/webp;base64," + base64.b64encode((d / "assets/img/logo.webp").read_bytes()).decode()
css = (d / "assets/css/style.css").read_text()
html = html.replace('<link rel="stylesheet" href="assets/css/style.css">', "<style>\n" + css + "</style>")
for js in ("config", "arte", "app"):
    src = (d / f"assets/js/{js}.js").read_text()
    html = html.replace(f'<script src="assets/js/{js}.js"></script>', "<script>\n" + src + "</script>")
html = html.replace("assets/img/logo.webp", logo)
html = re.sub(r"<title>.*?</title>", "<title>X do Neves</title>", html)
# o publicador cria o esqueleto do documento
html = re.sub(r"<!doctype html>\s*<html[^>]*>\s*<head>\s*", "", html)
html = html.replace("</head>", "").replace("<body>", "").replace("</body>", "").replace("</html>", "")
(d.parent / "xdoneves-previa.html").write_text(html)
print(len(html))
