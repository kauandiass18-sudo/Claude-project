"""Mascote em pixel art: um monitorzinho de óculos que fala."""
from PIL import Image, ImageDraw

TINTA = (18, 18, 18)
PAPEL = (244, 241, 234)
LARANJA = (255, 79, 40)
TELA = (255, 252, 245)
LENTE = (255, 214, 196)
SOMBRA = (214, 208, 196)

# . vazio | K tinta | T tela | O laranja | L lente | E olho
BASE = [
    ".KKKKKKKKKKKKKKKKKK.",
    ".KTTTTTTTTTTTTTTTTK.",
    ".KTTTTTTTTTTTTTTTTK.",
    ".KTKKKKKKTTKKKKKKTK.",
    ".KKKLLLLKKKKLLLLKKK.",
    ".KTKLEELKTTKLEELKTK.",
    ".KTKLEELKTTKLEELKTK.",
    ".KTKLLLLKTTKLLLLKTK.",
    ".KTKKKKKKTTKKKKKKTK.",
    ".KTTTTTTTTTTTTTTTTK.",
    ".KTTTTTTTTTTTTTTTTK.",
    ".KTTTTTTTTTTTTTTTTK.",
    ".KTTTTTTTTTTTTTTTTK.",
    ".KTTTTTTTTTTTTTTTTK.",
    ".KKKKKKKKKKKKKKKKKK.",
    ".KOOOOOOOOOOOOOOOOK.",
    ".KKKKKKKKKKKKKKKKKK.",
    "........KKKK........",
    "......KKKKKKKK......",
]

LINHA_BOCA = 10
BOCAS = {
    "fechada": [".....K......K.....", "......KKKKKK......"],
    "meio":    [".......KKKK.......", ".......KOOK.......", ".......KKKK......."],
    "aberta":  [".....KKKKKKKK.....", ".....KOOOOOOK.....", "......KKKKKK......"],
}

CORES = {"K": TINTA, "T": TELA, "O": LARANJA, "L": LENTE, "E": TINTA}

BRACO_ESQ = [(0, 9), (-1, 9), (-1, 10), (-1, 11), (-2, 12), (-1, 12), (-2, 13), (-1, 13)]
BRACO_DIR = [(19, 9), (20, 9), (20, 10), (20, 11), (20, 12), (21, 12), (20, 13), (21, 13)]
BRACO_ACENA = [(19, 9), (20, 9), (20, 8), (21, 7), (21, 6), (22, 5), (21, 5), (22, 4), (21, 4)]


def desenhar(boca="fechada", piscando=False, px=24, acenando=False):
    grade = [list(l) for l in BASE]
    if piscando:
        for y in (5, 6):
            for x in range(20):
                if grade[y][x] == "E":
                    grade[y][x] = "L"
        for x in (4, 5, 6, 7, 12, 13, 14, 15):
            grade[6][x] = "K"
    for i, linha in enumerate(BOCAS[boca]):
        for x, ch in enumerate(linha):
            if ch != ".":
                grade[LINHA_BOCA + i][x + 1] = ch

    ox, oy = 3, 3
    im = Image.new("RGBA", ((20 + 6) * px, (len(grade) + 4) * px), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pixels = [(x, y, CORES[ch]) for y, l in enumerate(grade) for x, ch in enumerate(l) if ch != "."]
    pixels += [(x, y, TINTA) for x, y in BRACO_ESQ + (BRACO_ACENA if acenando else BRACO_DIR)]

    def p(x, y, cor):
        x0, y0 = (x + ox) * px, (y + oy) * px
        d.rectangle([x0, y0, x0 + px - 1, y0 + px - 1], fill=cor + (255,))

    for x, y, _ in pixels:  # sombra chapada
        p(x + 0.5, y + 0.5, SOMBRA)
    for x, y, cor in pixels:
        p(x, y, cor)
    return im


if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "mascote.png"
    quadros = [desenhar("fechada"), desenhar("aberta", acenando=True),
               desenhar("meio", piscando=True)]
    W = sum(q.width for q in quadros) + 120
    folha = Image.new("RGBA", (W + 120, quadros[0].height + 160), PAPEL + (255,))
    x = 60
    for q in quadros:
        folha.alpha_composite(q, (x, 80))
        x += q.width + 60
    folha.save(out)
