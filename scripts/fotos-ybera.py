#!/usr/bin/env python3
"""
Fotos da Ybera: deixa as fotos leves e descobre quais têm fundo branco.

Roda depois de scripts/catalogo-ybera.mjs (a tarefa diária faz isso sozinha):
  1. Cada foto nova baixada da loja (ybera-<id>.jpg) vira WebP
     (ybera-<id>.webp, umas 6 vezes mais leve) e o JPG é apagado.
  2. Olha a borda de cada foto: as que NÃO têm fundo branco (fundo cinza,
     banner, foto de ambiente) vão para data/ybera-fotos.js. O site mostra
     primeiro as fotos de fundo branco, que ficam mais bonitas na vitrine.

Uso:  python3 scripts/fotos-ybera.py     (precisa do Pillow: pip install pillow)
"""
import json, os, re
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, "assets", "img", "produtos", "ybera")
SAIDA = os.path.join(RAIZ, "data", "ybera-fotos.js")
QUALIDADE = 80


def converter():
    novas = 0
    for arq in sorted(os.listdir(PASTA)):
        m = re.fullmatch(r"(ybera-\d+)\.jpe?g", arq)
        if not m:
            continue
        origem = os.path.join(PASTA, arq)
        with Image.open(origem) as im:
            im.convert("RGB").save(os.path.join(PASTA, m.group(1) + ".webp"), "WEBP", quality=QUALIDADE, method=6)
        os.remove(origem)
        novas += 1
    return novas


def fundo_branco(caminho):
    """True quando quase toda a borda da foto é branca."""
    with Image.open(caminho) as im:
        px = im.convert("L").resize((100, 100)).load()
    borda = [px[x, y] for x in range(100) for y in (0, 1, 98, 99)]
    borda += [px[x, y] for y in range(100) for x in (0, 1, 98, 99)]
    return sum(1 for v in borda if v >= 245) / len(borda) >= 0.95


def main():
    novas = converter()
    sem_branco = []
    for arq in sorted(os.listdir(PASTA)):
        m = re.fullmatch(r"ybera-(\d+)\.webp", arq)
        if m and not fundo_branco(os.path.join(PASTA, arq)):
            sem_branco.append(m.group(1))
    lista = ",\n".join(
        "  " + ", ".join(json.dumps(i) for i in sem_branco[n:n + 8]) for n in range(0, len(sem_branco), 8)
    )
    texto = (
        "/* Gerado sozinho por scripts/fotos-ybera.py: NÃO precisa editar.\n"
        "   Números dos produtos da Ybera cuja foto não tem fundo branco.\n"
        "   Na vitrine, eles aparecem depois dos de fundo branco. */\n"
        "window.FOTOS_SEM_FUNDO_BRANCO = window.FOTOS_SEM_FUNDO_BRANCO || {};\n"
        f"window.FOTOS_SEM_FUNDO_BRANCO.ybera = [\n{lista}\n];\n"
    )
    anterior = open(SAIDA, encoding="utf-8").read() if os.path.exists(SAIDA) else ""
    if texto != anterior:
        with open(SAIDA, "w", encoding="utf-8") as f:
            f.write(texto)
    print(f"Fotos convertidas para WebP: {novas}. Sem fundo branco: {len(sem_branco)}.")


if __name__ == "__main__":
    main()
