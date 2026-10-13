"""Narração do mascote (voz neural masculina pt-BR do Kokoro, licença Apache 2.0).

Requer: pip install kokoro-onnx pyworld scipy e espeak-ng instalado. Os arquivos do modelo
(~350 MB) são baixados na primeira vez para video/modelos/ (fora do git).
"""
import os
import subprocess

import numpy as np

PASTA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "modelos")
URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
ARQUIVOS = ["kokoro-v1.0.onnx", "voices-v1.0.bin"]
VOZ = "pm_alex"  # outra opção masculina: "pm_santa"
_kokoro = None


def modelo():
    global _kokoro
    if _kokoro is None:
        from kokoro_onnx import Kokoro
        os.makedirs(PASTA, exist_ok=True)
        for nome in ARQUIVOS:
            destino = os.path.join(PASTA, nome)
            if not os.path.exists(destino):
                subprocess.run(["curl", "-sSL", "-o", destino, URL + nome], check=True)
        _kokoro = Kokoro(*[os.path.join(PASTA, n) for n in ARQUIVOS])
    return _kokoro


SR = 44100

# (momento da animação em que a fala começa, velocidade, texto escrito do jeito que deve soar)
FALAS = [
    (0.0, 1.08, "Ei, você! Seu cliente procurou você no Gúgou..."),
    (1.65, 1.05, "E aí, ele achou?"),
    (3.3, 1.12, "Olha só, ele digitou o nome da sua empresa..."),
    (4.5, 1.0, "E não achou nada."),
    (5.3, 1.1, "Aí ele foi direto pro concorrente!"),
    (6.2, 1.12, "Mas calma, que eu resolvo isso pra você."),
    (7.3, 1.1, "Eu faço o site do seu negócio, do jeitinho que você imaginar."),
    (8.6, 1.05, "Aí o cliente clica aqui..."),
    (9.45, 1.1, "Opa! Cliente novo!"),
    (9.9, 1.1, "Seu negócio aparece no Gúgou, fica perfeito no celular, e o cliente te chama direto no uótsápi."),
    (11.15, 1.08, "Bora colocar seu negócio na internet?"),
    (12.7, 1.1, "É só me chamar no dirétchi, ou no link da bio. Te espero lá!"),
]


def _pico(f, ganho_db, q, sr=SR):
    """Coeficientes de um filtro de pico (equalizador), receita RBJ."""
    a = 10 ** (ganho_db / 40)
    w = 2 * np.pi * f / sr
    alfa = np.sin(w) / (2 * q)
    b = np.array([1 + alfa * a, -2 * np.cos(w), 1 - alfa * a])
    d = np.array([1 + alfa / a, -2 * np.cos(w), 1 - alfa / a])
    return b / d[0], d / d[0]


def humanizar(x):
    """Tira o som "seco" de computador: corta graves embolados, suaviza a aspereza
    dos agudos e põe um ambiente leve."""
    from scipy.signal import butter, lfilter
    x = lfilter(*_pico(3200, -4.0, 1.0), x)   # aspereza
    x = lfilter(*_pico(7000, -3.0, 1.2), x)   # chiado
    x = lfilter(*butter(2, 11000 / (SR / 2)), x)
    # passa-alta simples (~90 Hz)
    a = np.exp(-2 * np.pi * 90 / SR)
    y = np.zeros_like(x)
    for i in range(1, len(x)):
        y[i] = a * (y[i - 1] + x[i] - x[i - 1])
    # sala pequena: ruído com decaimento curto
    rng = np.random.default_rng(3)
    n = int(0.28 * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (0.06 * SR))
    ir[: int(0.012 * SR)] = 0  # pré-atraso
    ir /= np.abs(ir).sum()
    sala = np.convolve(y, ir)[: len(y)]
    sala *= np.abs(y).max() / (np.abs(sala).max() + 1e-9)
    return y + 0.13 * sala


def suavizar_tom(f0, janela=7):
    """Tira as tremidinhas rápidas do tom (o que deixa a voz áspera), sílaba por sílaba."""
    f0 = f0.copy()
    v = f0 > 0
    bordas = np.flatnonzero(np.diff(np.r_[0, v.astype(int), 0]))
    nucleo = np.ones(janela) / janela
    for ini, fim in zip(bordas[::2], bordas[1::2]):
        if fim - ini > janela:
            log = np.log(f0[ini:fim])
            pad = np.pad(log, janela // 2, mode="edge")
            f0[ini:fim] = np.exp(np.convolve(pad, nucleo, mode="valid"))
    return f0


def ajustar_voz(x, pergunta=False, tom=2.0, piso=112.0, ar=0.35,
                dur_pergunta=0.5, subida=8.0):
    """Ajusta a voz com o vocoder WORLD (muda o tom sem mudar duração nem timbre).

    - deixa a voz lisa: suaviza as tremidinhas do tom, sobe o tom geral `tom`
      semitons, não deixa a voz afundar abaixo de `piso` Hz (o grave arrastado
      que soa rouco) e reduz o sopro (`ar`);
    - em perguntas, o modelo termina descendo como afirmação: os últimos
      `dur_pergunta` segundos sobem até `subida` semitons acima do tom médio.
    """
    import pyworld as pw
    f0, sp, ap = pw.wav2world(np.ascontiguousarray(x, dtype=np.float64), SR)
    voz_ativa = np.nonzero(f0 > 0)[0]
    if len(voz_ativa) < 10:
        return x
    v = f0 > 0
    f0 = suavizar_tom(f0)
    f0[v] *= 2 ** (tom / 12)
    f0[v] = np.where(f0[v] < piso, piso - (piso - f0[v]) * 0.1, f0[v])
    ap[v] *= ar

    if pergunta:
        passo = 0.005  # o WORLD analisa de 5 em 5 ms
        base = np.median(f0[voz_ativa[: int(len(voz_ativa) * 0.6)]])
        ultimo = voz_ativa[-1]
        ini = max(0, ultimo - int(dur_pergunta / passo))
        alvo = base * 2 ** (subida / 12)
        partida = f0[ini] if f0[ini] > 0 else base
        for i in range(ini, ultimo + 1):
            if f0[i] > 0:
                k = (i - ini) / max(1, ultimo - ini)
                k = k * k * (3 - 2 * k)  # curva suave
                f0[i] = partida * (alvo / partida) ** k

    y = pw.synthesize(f0, sp, ap, SR)
    return y[: len(x)] if len(y) >= len(x) else np.pad(y, (0, len(x) - len(y)))


def sintetizar(texto, voz=VOZ, velocidade=1.08):
    x, sr = modelo().create(texto, voice=voz, speed=velocidade, lang="pt-br")
    x = np.asarray(x, dtype=float)
    # reamostra pra 44.1 kHz
    from math import gcd
    from scipy.signal import resample_poly
    g = gcd(SR, sr)
    x = resample_poly(x, SR // g, sr // g)
    # tira silêncio das pontas
    ativo = np.nonzero(np.abs(x) > 0.01)[0]
    return x[ativo[0]:ativo[-1] + 1] if len(ativo) else x


def preparar(real_de, pausas, intervalo=0.25):
    """Gera as falas e acrescenta pausas na animação onde a voz precisa de mais tempo.

    Assim a imagem espera o mascote terminar de falar antes de seguir.
    """
    falas = []
    fim_anterior = -intervalo
    for t_anim, velocidade, texto in FALAS:
        x = sintetizar(texto, velocidade=velocidade)
        x = humanizar(ajustar_voz(x, pergunta=texto.rstrip().endswith("?")))
        falta = fim_anterior + intervalo - real_de(t_anim)
        if falta > 0:
            pausas.append((t_anim - 0.001, falta))
            pausas.sort()
        fim_anterior = real_de(t_anim) + len(x) / SR
        falas.append((t_anim, x, texto))
    return falas, fim_anterior


def gerar_narracao(real_de, duracao, falas):
    """Retorna (sinal, [(inicio, fim, texto)]) já posicionado no tempo real."""
    sinal = np.zeros(int(duracao * SR))
    agenda = []
    for t_anim, x, texto in falas:
        ini = real_de(t_anim)
        i = int(ini * SR)
        j = min(len(sinal), i + len(x))
        sinal[i:j] += x[: j - i]
        agenda.append((ini, ini + len(x) / SR, texto))
    return sinal, agenda


def envelope(sinal, fps):
    """Volume da voz por quadro (0 a 1), usado pra mexer a boca."""
    passo = SR / fps
    n = int(len(sinal) / passo)
    env = np.array([np.sqrt(np.mean(sinal[int(k * passo):int((k + 1) * passo)] ** 2))
                    for k in range(n)])
    return env / (env.max() + 1e-9)
