"""Gera ../house-previa.html: a página do site sem o esqueleto <html>/<head>/<body>,
para publicar como Artifact junto com os arquivos de assets/ e admin.html."""
import pathlib, re
d = pathlib.Path(__file__).parent
html = (d / "index.html").read_text()
html = re.sub(r"<!doctype html>\s*<html[^>]*>\s*<head>\s*", "", html)
html = re.sub(r"<title>.*?</title>", "<title>House Hamburgueria 66</title>", html)
html = html.replace("</head>", "").replace("<body>", "").replace("</body>", "").replace("</html>", "")
html = re.sub(r'\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>', "", html, count=1)
(d.parent / "house-previa.html").write_text(html.strip() + "\n")
print(len(html))
