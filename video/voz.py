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

# (momento da animação em que a fala começa, texto escrito do jeito que deve soar)
FALAS = [
    (0.0, "Ei, você! Seu cliente procurou você no Gúgou."),
    (4.5, "Não achou nada."),
    (5.3, "Foi pro concorrente!"),
    (6.6, "Eu faço o site do seu negócio."),
    (9.45, "Opa! Cliente novo!"),
    (9.9, "Aparece no Gúgou, e o cliente te chama no Zap."),
    (11.6, "Bora colocar seu negócio na internet?"),
    (12.7, "Me chama no dirétchi!"),
]


def sintetizar(texto, voz=VOZ):
    x, sr = modelo().create(texto, voice=voz, speed=1.0, lang="pt-br")
    x = np.asarray(x, dtype=float)
    # reamostra pra 44.1 kHz
    n = int(len(x) * SR / sr)
    x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)
    # tira silêncio das pontas
    ativo = np.nonzero(np.abs(x) > 0.01)[0]
    return x[ativo[0]:ativo[-1] + 1] if len(ativo) else x


def gerar_narracao(real_de, duracao):
    """Retorna (sinal, [(inicio, fim, texto)]) já posicionado no tempo real."""
    sinal = np.zeros(int(duracao * SR))
    agenda = []
    fim_anterior = 0.0
    for t_anim, texto in FALAS:
        x = sintetizar(texto)
        ini = max(real_de(t_anim), fim_anterior + 0.15)
        i = int(ini * SR)
        j = min(len(sinal), i + len(x))
        sinal[i:j] += x[: j - i]
        fim_anterior = ini + len(x) / SR
        agenda.append((ini, fim_anterior, texto))
    return sinal, agenda


def envelope(sinal, fps):
    """Volume da voz por quadro (0 a 1), usado pra mexer a boca."""
    passo = SR / fps
    n = int(len(sinal) / passo)
    env = np.array([np.sqrt(np.mean(sinal[int(k * passo):int((k + 1) * passo)] ** 2))
                    for k in range(n)])
    return env / (env.max() + 1e-9)
