"""Reels 9:16 (1080x1920, 15s) divulgando criação de sites.

Uso: python3 propaganda.py [--arroba @seuarroba]
Gera propaganda.mp4 na mesma pasta.
"""
import argparse
import math
import os
import subprocess
from functools import lru_cache

from PIL import Image, ImageDraw, ImageFont

W, H, FPS, DUR = 1080, 1920, 30, 15.0
FONT_DIR = "/usr/share/fonts/opentype/inter"
MX = 90  # margem lateral

PAPEL = (244, 241, 234)
TINTA = (18, 18, 18)
LARANJA = (255, 79, 40)
CINZA = (120, 114, 106)
VERDE_ZAP = (37, 211, 102)


# ---------- utilidades ----------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def prog(t, start, dur):
    return clamp((t - start) / dur)


def ease(x):
    return 1 - (1 - x) ** 4


def lerp(a, b, x):
    return a + (b - a) * x


@lru_cache(maxsize=None)
def font(weight, size):
    return ImageFont.truetype(f"{FONT_DIR}/InterDisplay-{weight}.otf", size)


@lru_cache(maxsize=None)
def text_img(text, weight, size, color):
    f = font(weight, size)
    asc, desc = f.getmetrics()
    w = int(f.getlength(text)) + 8
    im = Image.new("RGBA", (w, asc + desc), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((0, 0), text, font=f, fill=color + (255,))
    return im


def with_alpha(img, alpha):
    if alpha >= 1:
        return img
    img = img.copy()
    img.putalpha(img.getchannel("A").point(lambda v: int(v * alpha)))
    return img


def linha(c, text, x, y, size, p, color=TINTA, weight="Black"):
    """Texto que sobe de dentro de uma máscara (revelação de linha)."""
    if p <= 0:
        return
    im = text_img(text, weight, size, color)
    off = int((1 - ease(p)) * im.height)
    vis = im.crop((0, 0, im.width, im.height - off))
    c.alpha_composite(vis, (int(x), int(y + off)))


def texto(c, text, x, y, size, alpha=1.0, color=TINTA, weight="Bold", centro=False):
    if alpha <= 0:
        return
    im = with_alpha(text_img(text, weight, size, color), alpha)
    if centro:
        x -= im.width / 2
    c.alpha_composite(im, (int(x), int(y)))


def layer():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def fundo(cor):
    return Image.new("RGBA", (W, H), cor + (255,))


def marca(c, arroba, cor):
    """@ fixo no canto, como em post de criador."""
    texto(c, arroba, MX, 110, 36, color=cor, weight="SemiBold")


# ---------- cenas ----------
def cena1(c, t):
    """0–3s: gancho."""
    linha(c, "Seu cliente", MX, 560, 128, prog(t, 0.05, 0.45))
    linha(c, "procurou você", MX, 720, 128, prog(t, 0.25, 0.45))
    # marca-texto laranja atrás de "no Google."
    p = ease(prog(t, 0.75, 0.35))
    if p > 0:
        L = layer()
        wtxt = text_img("no Google.", "Black", 128, TINTA).width
        ImageDraw.Draw(L).rectangle([MX - 16, 900, MX - 16 + (wtxt + 32) * p, 1040],
                                    fill=LARANJA + (255,))
        c.alpha_composite(L)
    linha(c, "no Google.", MX, 880, 128, prog(t, 0.45, 0.45))
    texto(c, "E aí, achou?", MX, 1130, 64, alpha=ease(prog(t, 1.6, 0.4)),
          color=CINZA, weight="SemiBold")


def celular(c, cx, cy, w, h, desenhar):
    L = layer()
    d = ImageDraw.Draw(L)
    x0, y0, x1, y1 = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
    d.rounded_rectangle([x0, y0, x1, y1], radius=72, fill=TINTA + (255,))
    sx0, sy0, sx1, sy1 = x0 + 18, y0 + 18, x1 - 18, y1 - 18
    d.rounded_rectangle([sx0, sy0, sx1, sy1], radius=56, fill=(255, 255, 255, 255))
    d.rounded_rectangle([cx - 64, sy0 + 16, cx + 64, sy0 + 46], radius=15, fill=TINTA + (255,))
    desenhar(L, d, sx0, sy0, sx1, sy1)
    c.alpha_composite(L)


def cena2(c, t):
    """3–6.5s: não encontra nada, vai pro concorrente."""
    lt = t - 3
    sobe = (1 - ease(prog(lt, 0, 0.5))) * 900
    busca = "seu negócio"
    n = int(len(busca) * prog(lt, 0.45, 0.8))

    def tela(L, d, x0, y0, x1, y1):
        d.rounded_rectangle([x0 + 36, y0 + 120, x1 - 36, y0 + 210], radius=45,
                            fill=(241, 241, 244, 255))
        d.ellipse([x0 + 66, y0 + 146, x0 + 100, y0 + 180], outline=(110, 110, 120, 255), width=5)
        d.line([(x0 + 96, y0 + 176), (x0 + 112, y0 + 192)], fill=(110, 110, 120, 255), width=6)
        cursor = "|" if int(lt * 3) % 2 == 0 and n < len(busca) else ""
        q = busca[:n] + cursor
        if q:
            ti = text_img(q, "Medium", 40, (30, 30, 30))
            L.alpha_composite(ti, (int(x0 + 130), int(y0 + 165 - ti.height / 2)))
        rp = ease(prog(lt, 1.35, 0.3))
        if rp > 0:
            R = Image.new("RGBA", L.size, (0, 0, 0, 0))
            rd = ImageDraw.Draw(R)
            for i in range(4):
                yy = y0 + 280 + i * 120
                rd.rectangle([x0 + 50, yy, x0 + 50 + 180, yy + 18], fill=(225, 225, 230, 255))
                rd.rectangle([x0 + 50, yy + 38, x1 - 80 - i * 30, yy + 52], fill=(236, 236, 240, 255))
            vazio = text_img("Nenhum resultado", "Bold", 42, (30, 30, 30))
            R.alpha_composite(vazio, (int((x0 + x1) / 2 - vazio.width / 2), int(y0 + 800)))
            sub = text_img("para \"seu negócio\"", "Regular", 32, CINZA)
            R.alpha_composite(sub, (int((x0 + x1) / 2 - sub.width / 2), int(y0 + 860)))
            L.alpha_composite(with_alpha(R, rp))

    celular(c, W / 2, 1020 + sobe, 600, 1120, tela)

    # saída: tudo desce e entra a frase do concorrente
    linha(c, "Não achou nada.", MX, 250, 96, prog(lt, 1.5, 0.4))
    p = prog(lt, 2.2, 0.35)
    if p > 0:
        L = layer()
        y = 1620
        ImageDraw.Draw(L).rectangle([0, y - 40, W * ease(p), y + 150], fill=TINTA + (255,))
        c.alpha_composite(L)
        linha(c, "Foi pro concorrente.", MX, y - 10, 84, prog(lt, 2.4, 0.4), color=LARANJA)


def cena3(c, t):
    """6.5–11.5s: site sendo montado + o que vem nele."""
    lt = t - 6.5
    linha(c, "Eu faço o site", MX, 230, 104, prog(lt, 0.0, 0.4))
    linha(c, "do seu negócio.", MX, 360, 104, prog(lt, 0.15, 0.4))

    L = layer()
    d = ImageDraw.Draw(L)
    bx0, by0, bx1, by1 = MX, 560, W - MX, 1260
    entra = ease(prog(lt, 0.3, 0.45))
    if entra <= 0:
        return
    d.rectangle([bx0 + 14, by0 + 14, bx1 + 14, by1 + 14], fill=TINTA + (255,))  # sombra chapada
    d.rectangle([bx0, by0, bx1, by1], fill=(255, 255, 255, 255), outline=TINTA + (255,), width=5)
    d.line([(bx0, by0 + 64), (bx1, by0 + 64)], fill=TINTA + (255,), width=5)
    for i in range(3):
        d.ellipse([bx0 + 26 + i * 38, by0 + 20, bx0 + 50 + i * 38, by0 + 44],
                  outline=TINTA + (255,), width=4)

    def aparece(start):
        return ease(prog(lt, start, 0.3))

    ix0, ix1 = bx0 + 40, bx1 - 40
    y = by0 + 100
    # menu
    a = aparece(0.7)
    if a > 0:
        logo = text_img("SEU NEGÓCIO", "Black", 30, TINTA)
        L.alpha_composite(with_alpha(logo, a), (ix0, y))
        for i in range(3):
            d.rectangle([ix1 - 260 + i * 90, y + 16, ix1 - 200 + i * 90, y + 26],
                        fill=CINZA + (int(255 * a),))
    # destaque
    a = aparece(1.0)
    if a > 0:
        d.rectangle([ix0, y + 70, ix0 + (ix1 - ix0) * a, y + 330], fill=LARANJA + (255,))
    a = aparece(1.3)
    if a > 0:
        h1 = text_img("O melhor da", "Black", 58, TINTA)
        h2 = text_img("cidade, online.", "Black", 58, TINTA)
        L.alpha_composite(with_alpha(h1, a), (ix0 + 36, y + 105))
        L.alpha_composite(with_alpha(h2, a), (ix0 + 36, y + 170))
    # botão de WhatsApp
    a = aparece(1.6)
    if a > 0:
        d.rounded_rectangle([ix0 + 36, y + 255, ix0 + 36 + 330 * a, y + 310], radius=28,
                            fill=VERDE_ZAP + (255,))
        if a > 0.95:
            bt = text_img("Chamar no WhatsApp", "Bold", 26, (255, 255, 255))
            L.alpha_composite(bt, (ix0 + 36 + 165 - bt.width // 2, y + 282 - bt.height // 2))
    # cards
    cw = (ix1 - ix0 - 40) / 3
    for i in range(3):
        a = aparece(1.9 + i * 0.12)
        if a <= 0:
            continue
        x = ix0 + i * (cw + 20)
        top = y + 360 + (1 - a) * 40
        d.rectangle([x, top, x + cw, top + 170], fill=(236, 232, 224, int(255 * a)))
        d.rectangle([x, top + 190, x + cw * 0.8, top + 206], fill=TINTA + (int(255 * a),))
        d.rectangle([x, top + 222, x + cw * 0.55, top + 234], fill=CINZA + (int(255 * a),))

    c.alpha_composite(with_alpha(L, entra), (0, int((1 - entra) * 120)))

    itens = ["Aparece no Google", "Fica perfeito no celular", "Cliente te chama no Zap"]
    for i, txt in enumerate(itens):
        p = prog(lt, 2.5 + i * 0.4, 0.35)
        if p <= 0:
            continue
        yy = 1360 + i * 120
        Q = layer()
        ImageDraw.Draw(Q).rectangle([MX, yy + 22, MX + 28 * ease(p), yy + 50], fill=LARANJA + (255,))
        c.alpha_composite(Q)
        linha(c, txt, MX + 56, yy, 58, p, weight="Bold")


def cena4(c, t, arroba):
    """11.5–15s: chamada final em fundo escuro."""
    lt = t - 11.5
    linha(c, "Bora colocar", MX, 560, 120, prog(lt, 0.1, 0.4), color=PAPEL)
    linha(c, "seu negócio", MX, 710, 120, prog(lt, 0.25, 0.4), color=PAPEL)
    linha(c, "na internet?", MX, 860, 120, prog(lt, 0.4, 0.4), color=LARANJA)

    p = ease(prog(lt, 1.1, 0.4))
    if p > 0:
        L = layer()
        ImageDraw.Draw(L).rectangle([MX, 1120, MX + 640 * p, 1230], fill=PAPEL + (255,))
        c.alpha_composite(L)
        if p > 0.9:
            texto(c, "Me chama no direct", MX + 36, 1142, 54, color=TINTA, weight="Black")

    texto(c, arroba, MX, 1300, 76, alpha=ease(prog(lt, 1.5, 0.4)), color=PAPEL, weight="Black")
    p = ease(prog(lt, 1.8, 0.4))
    if p > 0:
        texto(c, "ou no link da bio", MX, 1400, 48, alpha=p, color=CINZA, weight="SemiBold")
        L = layer()
        d = ImageDraw.Draw(L)
        ax = MX + text_img("ou no link da bio", "SemiBold", 48, CINZA).width + 50
        ay = 1430 + math.sin(lt * 6) * 10
        d.polygon([(ax, ay - 30), (ax - 22, ay), (ax + 22, ay)], fill=LARANJA + (int(255 * p),))
        d.rectangle([ax - 7, ay - 2, ax + 7, ay + 30], fill=LARANJA + (int(255 * p),))
        c.alpha_composite(L)


def frame(t, arroba):
    if t < 11.5:
        c = fundo(PAPEL)
        if t < 3:
            cena1(c, t)
        elif t < 6.5:
            cena2(c, t)
        else:
            cena3(c, t)
        marca(c, arroba, CINZA)
        # cortina escura entrando de baixo pra cena final
        p = ease(prog(t, 11.15, 0.35))
        if p > 0:
            L = layer()
            ImageDraw.Draw(L).rectangle([0, H * (1 - p), W, H], fill=TINTA + (255,))
            c.alpha_composite(L)
    else:
        c = fundo(TINTA)
        cena4(c, t, arroba)
        marca(c, arroba, CINZA)
    f = prog(t, DUR - 0.3, 0.3)
    if f > 0:
        c.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, int(255 * f))))
    return c.convert("RGB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--arroba", default="@seuarroba")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                                  "propaganda.mp4"))
    ap.add_argument("--preview", type=float, nargs="*", help="só salva PNGs nesses segundos")
    args = ap.parse_args()

    if args.preview:
        for s in args.preview:
            frame(s, args.arroba).save(f"preview_{s:05.2f}.png")
        return

    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest",
         "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-movflags", "+faststart", args.out],
        stdin=subprocess.PIPE)
    total = int(DUR * FPS)
    for i in range(total):
        ff.stdin.write(frame(i / FPS, args.arroba).tobytes())
        if i % 90 == 0:
            print(f"{i}/{total}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("ok:", args.out)


if __name__ == "__main__":
    main()
