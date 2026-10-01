#!/usr/bin/env python3
"""
Gera o site em arquivos HTML que funcionam sozinhos (tudo dentro de cada
arquivo: estilos, scripts, dados e fotos), para salvar e abrir sem internet
de GitHub. Só as fontes vêm do Google Fonts (sem internet, usa uma parecida).

Uso:  python3 scripts/gerar-html-unico.py [pasta-de-saida]
Saída (padrão: html-unico/):
  carla-dias.html      página inicial
  mercado-livre.html   achadinhos do Mercado Livre
  shopee.html          achadinhos da Shopee
Os três se ligam entre si: guarde-os na mesma pasta.
"""
import base64, json, os, re, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(RAIZ, "html-unico")
PAGINAS = {"index.html": "carla-dias.html", "mercado-livre.html": "mercado-livre.html", "shopee.html": "shopee.html"}
TIPOS = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml"}


def ler(caminho):
    with open(os.path.join(RAIZ, caminho), encoding="utf-8") as f:
        return f.read()


def data_uri(caminho):
    caminho = caminho.split("?")[0]
    ext = os.path.splitext(caminho)[1].lower()
    with open(os.path.join(RAIZ, caminho), "rb") as f:
        dados = base64.b64encode(f.read()).decode()
    return f"data:{TIPOS[ext]};base64,{dados}"


def script_seguro(js):
    # impede que um "</script" dentro do código feche a tag antes da hora
    return js.replace("</script", "<\\/script")


def fotos_nos_dados(js):
    """Troca "assets/img/....jpg" pelos bytes da foto. Produtos esgotados
    (escondidos no site) ficam sem foto, para o arquivo não pesar à toa."""
    def troca_bloco(bloco):
        esgotado = re.search(r"\besgotado:\s*true", bloco)
        def troca(m):
            if not os.path.exists(os.path.join(RAIZ, m.group(1))):
                return m.group(0)  # exemplo num comentário, não é foto de verdade
            if esgotado:
                return 'imagem: ""'
            return f'imagem: "{data_uri(m.group(1))}"'
        return re.sub(r'imagem:\s*"(assets/img/[^"]+)"', troca, bloco)
    js = re.sub(r"\{[^{}]*\}", lambda m: troca_bloco(m.group(0)), js)
    js = re.sub(r'foto:\s*"(assets/img/[^"]+)"', lambda m: f'foto: "{data_uri(m.group(1))}"', js)
    return js


def gerar(origem, destino):
    html = ler(origem)

    # Estilos
    def troca_css(m):
        return f"<style>\n{ler(m.group(1))}\n</style>"
    html = re.sub(r'<link rel="stylesheet" href="(assets/css/[^"]+)">', troca_css, html)
    # Pré-carregamentos de arquivos locais não servem mais
    html = re.sub(r'\s*<link rel="preload"[^>]*href="assets/[^"]*"[^>]*>', "", html)

    # Ícone da aba e imagens soltas no HTML
    html = re.sub(r'href="(assets/img/[^"]+)"', lambda m: f'href="{data_uri(m.group(1))}"', html)
    html = re.sub(r'src="(assets/img/[^"]+)"', lambda m: f'src="{data_uri(m.group(1))}"', html)

    # Scripts (os dados ganham as fotos embutidas)
    def troca_js(m):
        caminho = m.group(1)
        js = ler(caminho)
        if caminho.startswith("data/"):
            js = fotos_nos_dados(js)
        return f"<script>\n{script_seguro(js)}\n</script>"
    html = re.sub(r'<script src="((?:assets/js|data)/[^"]+)"></script>', troca_js, html)

    # Links entre as páginas
    for antes, depois in PAGINAS.items():
        html = html.replace(f'href="{antes}"', f'href="{depois}"')
        html = re.sub(rf'(href|data-vazio-link)="{re.escape(antes)}#', rf'\1="{depois}#', html)

    restos = re.findall(r'(?:src|href)="((?:assets|data)/[^"]+)"', html)
    if restos:
        raise SystemExit(f"Arquivos que ficaram de fora em {origem}: {restos}")

    os.makedirs(SAIDA, exist_ok=True)
    with open(os.path.join(SAIDA, destino), "w", encoding="utf-8") as f:
        f.write(html)
    return os.path.getsize(os.path.join(SAIDA, destino))


if __name__ == "__main__":
    for origem, destino in PAGINAS.items():
        tamanho = gerar(origem, destino)
        print(f"{destino}: {tamanho / 1024 / 1024:.1f} MB")
    print(f"Pronto em {SAIDA}")
