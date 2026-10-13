"""Reels 9:16 (1080x1920, 15s) divulgando criação de sites.

Uso: python3 propaganda.py [--arroba @seuarroba] [--contato "Link na bio"]
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

BG1 = (12, 10, 32)
BG2 = (38, 16, 72)
ROXO = (139, 92, 246)
CIANO = (34, 211, 238)
ROSA = (244, 114, 182)
BRANCO = (255, 255, 255)
CINZA = (160, 160, 190)
VERDE = (52, 211, 153)
VERMELHO = (248, 113, 113)


# ---------- utilidades ----------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def prog(t, start, dur):
    return clamp((t - start) / dur)


def ease_out(x):
    return 1 - (1 - x) ** 3


def ease_back(x):
    c1, c3 = 1.70158, 2.70158
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


def lerp(a, b, x):
    return a + (b - a) * x


@lru_cache(maxsize=None)
def font(weight, size):
    return ImageFont.truetype(f"{FONT_DIR}/InterDisplay-{weight}.otf", size)


@lru_cache(maxsize=None)
def text_img(text, weight, size, color):
    f = font(weight, size)
    l, t, r, b = f.getbbox(text)
    im = Image.new("RGBA", (r - l + 20, b - t + 20), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((10 - l, 10 - t), text, font=f, fill=color + (255,))
    return im


def put_text(canvas, text, cx, cy, size, color=BRANCO, weight="Bold",
             alpha=1.0, scale=1.0, anchor="c"):
    if alpha <= 0 or scale <= 0.01:
        return
    im = text_img(text, weight, size, color)
    if scale != 1.0:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))),
                       Image.LANCZOS)
    if alpha < 1.0:
        a = im.getchannel("A").point(lambda v: int(v * alpha))
        im = im.copy()
        im.putalpha(a)
    x = int(cx - im.width / 2) if anchor == "c" else int(cx)
    canvas.alpha_composite(im, (x, int(cy - im.height / 2)))


def layer():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def with_alpha(img, alpha):
    if alpha >= 1:
        return img
    a = img.getchannel("A").point(lambda v: int(v * alpha))
    img.putalpha(a)
    return img


@lru_cache(maxsize=1)
def background_base():
    bg = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        k = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(lerp(BG1[i], BG2[i], k)) for i in range(3)))
    return bg


def background(t):
    bg = background_base().copy()
    glow = layer()
    d = ImageDraw.Draw(glow)
    # bolhas de luz flutuando
    for i, (cor, r) in enumerate([(ROXO, 380), (CIANO, 300), (ROSA, 260)]):
        x = W / 2 + math.sin(t * 0.6 + i * 2.1) * 380
        y = H / 2 + math.cos(t * 0.45 + i * 1.7) * 650
        d.ellipse([x - r, y - r, x + r, y + r], fill=cor + (38,))
    bg.alpha_composite(glow)
    # pontinhos tipo grid de código
    dots = layer()
    dd = ImageDraw.Draw(dots)
    off = (t * 20) % 90
    for gy in range(-1, H // 90 + 2):
        for gx in range(W // 90 + 1):
            px, py = gx * 90 + 45, gy * 90 + off
            dd.ellipse([px - 2, py - 2, px + 2, py + 2], fill=(255, 255, 255, 22))
    bg.alpha_composite(dots)
    return bg


def check_icon(d, cx, cy, r, cor):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=cor + (255,))
    w = max(4, r // 4)
    d.line([(cx - r * 0.45, cy), (cx - r * 0.1, cy + r * 0.35), (cx + r * 0.5, cy - r * 0.35)],
           fill=BG1 + (255,), width=w, joint="curve")


# ---------- cenas ----------
def cena1(c, t):
    """0–3s: gancho."""
    s = clamp(1 - prog(t, 2.7, 0.3))
    put_text(c, "Seu negócio", W / 2, 720, 96, alpha=ease_out(prog(t, 0.1, 0.4)) * s,
             scale=ease_back(prog(t, 0.1, 0.4)))
    put_text(c, "ainda não tem", W / 2, 840, 96, alpha=ease_out(prog(t, 0.45, 0.4)) * s,
             scale=ease_back(prog(t, 0.45, 0.4)))
    p = prog(t, 0.9, 0.5)
    pulse = 1 + 0.05 * math.sin(t * 8) * (p >= 1)
    put_text(c, "SITE?", W / 2, 1040, 240, color=CIANO, weight="Black",
             alpha=ease_out(p) * s, scale=ease_back(p) * pulse)
    # sublinhado
    lw = ease_out(prog(t, 1.4, 0.5)) * 520
    if lw > 0:
        L = layer()
        ImageDraw.Draw(L).rounded_rectangle([W / 2 - lw / 2, 1170, W / 2 + lw / 2, 1186],
                                            radius=8, fill=ROSA + (255,))
        c.alpha_composite(with_alpha(L, s))


def phone(c, cx, cy, w, h, alpha, draw_screen):
    L = layer()
    d = ImageDraw.Draw(L)
    x0, y0, x1, y1 = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
    d.rounded_rectangle([x0, y0, x1, y1], radius=70, fill=(20, 20, 35, 255),
                        outline=(90, 90, 130, 255), width=6)
    sx0, sy0, sx1, sy1 = x0 + 22, y0 + 22, x1 - 22, y1 - 22
    d.rounded_rectangle([sx0, sy0, sx1, sy1], radius=52, fill=(245, 246, 252, 255))
    d.rounded_rectangle([cx - 70, sy0 + 14, cx + 70, sy0 + 44], radius=15, fill=(20, 20, 35, 255))
    draw_screen(L, d, sx0, sy0, sx1, sy1)
    c.alpha_composite(with_alpha(L, alpha))


def cena2(c, t):
    """3–6s: clientes procuram e não encontram."""
    lt = t - 3
    a = ease_out(prog(lt, 0, 0.4)) * clamp(1 - prog(lt, 2.7, 0.3))
    slide = (1 - ease_out(prog(lt, 0, 0.5))) * 200

    put_text(c, "Clientes te procuram...", W / 2, 300 + slide * 0.3, 76, alpha=a)

    busca = "sua empresa"
    n = int(len(busca) * prog(lt, 0.5, 0.9))

    def tela(L, d, x0, y0, x1, y1):
        cx = (x0 + x1) / 2
        # logo de buscador fictício
        txt = text_img("Busca", "Black", 64, (60, 60, 90))
        L.alpha_composite(txt, (int(cx - txt.width / 2), int(y0 + 130)))
        d.rounded_rectangle([x0 + 40, y0 + 240, x1 - 40, y0 + 330], radius=45,
                            fill=(255, 255, 255, 255), outline=(200, 200, 220, 255), width=3)
        # lupa
        d.ellipse([x0 + 70, y0 + 265, x0 + 106, y0 + 301], outline=(120, 120, 150, 255), width=5)
        d.line([(x0 + 102, y0 + 297), (x0 + 118, y0 + 313)], fill=(120, 120, 150, 255), width=6)
        q = busca[:n] + ("|" if int(lt * 3) % 2 == 0 and n < len(busca) else "")
        if q:
            ti = text_img(q, "Medium", 40, (40, 40, 60))
            L.alpha_composite(ti, (int(x0 + 135), int(y0 + 285 - ti.height / 2)))
        # resultados vazios
        rp = prog(lt, 1.5, 0.4)
        if rp > 0:
            R = Image.new("RGBA", L.size, (0, 0, 0, 0))
            rd = ImageDraw.Draw(R)
            for i in range(3):
                yy = y0 + 400 + i * 150
                rd.rounded_rectangle([x0 + 40, yy, x1 - 40, yy + 110], radius=20,
                                     fill=(230, 232, 242, 255))
                rd.line([(x0 + 70, yy + 35), (x1 - 160, yy + 35)], fill=(205, 207, 222, 255), width=14)
                rd.line([(x0 + 70, yy + 72), (x1 - 260, yy + 72)], fill=(215, 217, 230, 255), width=10)
            ni = text_img("Nenhum resultado", "Bold", 44, VERMELHO)
            R.alpha_composite(ni, (int(cx - ni.width / 2), int(y0 + 880)))
            L.alpha_composite(with_alpha(R, ease_out(rp)))

    phone(c, W / 2, 1000 + slide, 640, 1180, a, tela)

    p2 = prog(lt, 1.9, 0.4)
    shake = math.sin(lt * 40) * 10 * (1 - prog(lt, 2.3, 0.3)) * (p2 > 0)
    put_text(c, "...e não te encontram.", W / 2 + shake, 1720, 70, color=ROSA,
             alpha=ease_out(p2) * a)


def cena3(c, t):
    """6–11s: site sendo montado + benefícios."""
    lt = t - 6
    a = ease_out(prog(lt, 0, 0.4)) * clamp(1 - prog(lt, 4.7, 0.3))

    put_text(c, "Eu crio o seu site", W / 2, 230, 84, alpha=a,
             scale=ease_back(prog(lt, 0, 0.5)))

    # navegador
    L = layer()
    d = ImageDraw.Draw(L)
    bx0, by0, bx1, by1 = 110, 340, W - 110, 1180
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=30, fill=(250, 250, 255, 255))
    d.rounded_rectangle([bx0, by0, bx1, by0 + 70], radius=30, fill=(225, 226, 240, 255))
    d.rectangle([bx0, by0 + 40, bx1, by0 + 70], fill=(225, 226, 240, 255))
    for i, cor in enumerate([VERMELHO, (251, 191, 36), VERDE]):
        d.ellipse([bx0 + 30 + i * 40, by0 + 22, bx0 + 56 + i * 40, by0 + 48], fill=cor + (255,))
    d.rounded_rectangle([bx0 + 170, by0 + 16, bx1 - 40, by0 + 54], radius=19, fill=(255, 255, 255, 255))
    url = text_img("www.seunegocio.com.br", "Medium", 26, (90, 90, 120))
    L.alpha_composite(url, (bx0 + 195, by0 + 35 - url.height // 2))

    def bloco(start, box, cor, r=16):
        p = ease_back(prog(lt, start, 0.4))
        if p <= 0:
            return
        x0, y0, x1, y1 = box
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        hw, hh = (x1 - x0) / 2 * p, (y1 - y0) / 2 * p
        d.rounded_rectangle([cx - hw, cy - hh, cx + hw, cy + hh], radius=r, fill=cor + (255,))

    cy0 = by0 + 90
    # header
    bloco(0.4, (bx0 + 30, cy0, bx1 - 30, cy0 + 70), (30, 27, 75))
    if lt > 0.7:
        d.ellipse([bx0 + 50, cy0 + 15, bx0 + 90, cy0 + 55], fill=CIANO + (255,))
        for i in range(3):
            d.rounded_rectangle([bx1 - 300 + i * 85, cy0 + 28, bx1 - 240 + i * 85, cy0 + 42],
                                radius=7, fill=(160, 160, 210, 255))
    # hero
    bloco(0.8, (bx0 + 30, cy0 + 95, bx1 - 30, cy0 + 400), ROXO, 22)
    if lt > 1.1:
        ht = text_img("Seu negócio online", "Black", 50, BRANCO)
        L.alpha_composite(ht, (W // 2 - ht.width // 2, cy0 + 170))
        bp = ease_back(prog(lt, 1.2, 0.4))
        bw = 130 * bp
        d.rounded_rectangle([W / 2 - bw, cy0 + 280, W / 2 + bw, cy0 + 345], radius=32,
                            fill=CIANO + (255,))
        if bp > 0.9:
            bt = text_img("Saiba mais", "Bold", 30, BG1)
            L.alpha_composite(bt, (W // 2 - bt.width // 2, cy0 + 312 - bt.height // 2))
    # cards
    cw = (bx1 - bx0 - 60 - 40) / 3
    for i, cor in enumerate([ROSA, CIANO, VERDE]):
        x = bx0 + 30 + i * (cw + 20)
        bloco(1.5 + i * 0.15, (x, cy0 + 425, x + cw, cy0 + 690), (238, 238, 250))
        if lt > 1.8 + i * 0.15:
            d.ellipse([x + cw / 2 - 35, cy0 + 460, x + cw / 2 + 35, cy0 + 530], fill=cor + (255,))
            d.rounded_rectangle([x + 30, cy0 + 565, x + cw - 30, cy0 + 580], radius=7,
                                fill=(190, 190, 215, 255))
            d.rounded_rectangle([x + 50, cy0 + 600, x + cw - 50, cy0 + 612], radius=6,
                                fill=(210, 210, 228, 255))

    flut = math.sin(lt * 2) * 8
    c.alpha_composite(with_alpha(L, a), (0, int(flut)))

    # benefícios
    itens = ["Design moderno", "Rápido e seguro", "Perfeito no celular"]
    for i, txt in enumerate(itens):
        p = prog(lt, 2.4 + i * 0.45, 0.4)
        if p <= 0:
            continue
        y = 1330 + i * 140
        dx = (1 - ease_out(p)) * -300
        I = layer()
        check_icon(ImageDraw.Draw(I), 220 + dx, y, 38, VERDE)
        c.alpha_composite(with_alpha(I, ease_out(p) * a))
        put_text(c, txt, 290 + dx, y, 62, alpha=ease_out(p) * a, anchor="l")


def cena4(c, t, arroba, contato):
    """11–15s: chamada final."""
    lt = t - 11
    put_text(c, "Vamos criar o seu?", W / 2, 620, 88,
             alpha=ease_out(prog(lt, 0, 0.4)), scale=ease_back(prog(lt, 0, 0.5)))

    # botão "Fale comigo" pulsando
    p = prog(lt, 0.5, 0.5)
    if p > 0:
        pulse = 1 + 0.04 * math.sin(lt * 6) * (p >= 1)
        s = ease_back(p) * pulse
        bw, bh = 330 * s, 85 * s
        L = layer()
        d = ImageDraw.Draw(L)
        # brilho atrás
        g = 30 + 20 * math.sin(lt * 6)
        d.rounded_rectangle([W / 2 - bw - g, 900 - bh - g, W / 2 + bw + g, 900 + bh + g],
                            radius=int(bh + g), fill=ROXO + (60,))
        d.rounded_rectangle([W / 2 - bw, 900 - bh, W / 2 + bw, 900 + bh], radius=int(bh),
                            fill=ROXO + (255,))
        c.alpha_composite(L)
        put_text(c, "Fale comigo!", W / 2, 900, 80, weight="Black", scale=s)

    p = prog(lt, 1.1, 0.5)
    put_text(c, arroba, W / 2, 1140, 92, color=CIANO, weight="Black",
             alpha=ease_out(p), scale=ease_back(p))
    p = prog(lt, 1.5, 0.5)
    put_text(c, contato, W / 2, 1270, 60, color=CINZA, weight="SemiBold",
             alpha=ease_out(p))

    # seta pra cima apontando pra bio, quicando
    p = prog(lt, 2.0, 0.4)
    if p > 0:
        L = layer()
        d = ImageDraw.Draw(L)
        yb = 1480 + math.sin(lt * 7) * 18
        d.polygon([(W / 2, yb - 60), (W / 2 - 50, yb), (W / 2 + 50, yb)], fill=ROSA + (255,))
        d.rounded_rectangle([W / 2 - 16, yb - 5, W / 2 + 16, yb + 70], radius=8, fill=ROSA + (255,))
        c.alpha_composite(with_alpha(L, ease_out(p)))

    # flash de entrada
    f = 1 - prog(lt, 0, 0.25)
    if f > 0:
        c.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, int(160 * f))))


def frame(t, arroba, contato):
    c = background(t)
    if t < 3:
        cena1(c, t)
    elif t < 6:
        cena2(c, t)
    elif t < 11:
        cena3(c, t)
    else:
        cena4(c, t, arroba, contato)
    # fade final
    f = prog(t, DUR - 0.4, 0.4)
    if f > 0:
        c.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, int(255 * f))))
    return c.convert("RGB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--arroba", default="@seuarroba")
    ap.add_argument("--contato", default="Link na bio")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                                  "propaganda.mp4"))
    ap.add_argument("--preview", type=float, nargs="*", help="só salva PNGs nesses segundos")
    args = ap.parse_args()

    if args.preview:
        for s in args.preview:
            frame(s, args.arroba, args.contato).save(f"preview_{s:05.2f}.png")
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
        ff.stdin.write(frame(i / FPS, args.arroba, args.contato).tobytes())
        if i % 60 == 0:
            print(f"{i}/{total}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("ok:", args.out)


if __name__ == "__main__":
    main()
