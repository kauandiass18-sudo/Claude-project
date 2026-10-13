"""Narração do mascote (voz neural masculina pt-BR do Kokoro, licença Apache 2.0).

Requer: pip install kokoro-onnx e espeak-ng instalado. Os arquivos do modelo
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
    (9.9, 1.1, "Seu negócio aparece no Gúgou, e o cliente te chama direto no Zap."),
    (11.15, 1.08, "Bora colocar seu negócio na internet?"),
    (12.7, 1.1, "É só me chamar no dirétchi, ou no link da bio. Te espero lá!"),
]


def humanizar(x):
    """Tira o som "seco" de computador: corta graves embolados e põe um ambiente leve."""
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


def sintetizar(texto, voz=VOZ, velocidade=1.08):
    x, sr = modelo().create(texto, voice=voz, speed=velocidade, lang="pt-br")
    x = np.asarray(x, dtype=float)
    # reamostra pra 44.1 kHz
    n = int(len(x) * SR / sr)
    x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)
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
        x = humanizar(sintetizar(texto, velocidade=velocidade))
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
