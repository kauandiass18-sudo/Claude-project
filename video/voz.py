"""Narração do mascote (voz sintética masculina, espeak-ng + MBROLA br3).

Requer: apt-get install espeak-ng mbrola mbrola-br3
"""
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100

# (momento da animação em que a fala começa, texto escrito do jeito que deve soar)
FALAS = [
    (0.0, "Ei, você! Seu cliente procurou você no Gúgou."),
    (1.7, "E aí? Achou?"),
    (4.5, "Não achou nada."),
    (5.3, "Foi pro concorrente!"),
    (6.6, "Eu faço o site do seu negócio."),
    (9.45, "Opa! Cliente novo!"),
    (9.9, "Aparece no Gúgou, fica perfeito no celular, e o cliente te chama no Zap."),
    (11.6, "Bora colocar seu negócio na internet?"),
    (12.7, "Me chama no dirétchi!"),
]


def sintetizar(texto):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        caminho = f.name
    subprocess.run(["espeak-ng", "-v", "mb-br3", "-s", "160", "-w", caminho, texto],
                   check=True, stderr=subprocess.DEVNULL)
    with wave.open(caminho) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    os.remove(caminho)
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
