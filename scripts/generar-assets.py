#!/usr/bin/env python3
"""
Genera arte de marca procedural como PNG reales, sin dependencias externas.

NOTA: desde que hay fotografia definitiva en assets/marca/, este script es solo
el respaldo. Escribe en assets/marca/placeholders/ para no pisar las fotos.

Son composiciones procedurales en la paleta de Cordillera Energia (azul
cordillera + acento cobre). Estan pensadas como sustituto honesto de la
fotografia de campo: cuando lleguen las fotos definitivas se reemplazan los
archivos y nada mas cambia, porque las dimensiones estan declaradas en el
componente.

Uso:  python3 scripts/generar-assets.py
"""

import math
import os
import struct
import zlib

SALIDA = os.path.join(os.path.dirname(__file__), "..", "assets", "marca", "placeholders")


def escribir_png(ruta, ancho, alto, filas):
    """Escribe un PNG RGB de 8 bits. `filas` es una lista de bytearray."""
    crudo = bytearray()
    for fila in filas:
        crudo.append(0)  # filtro None
        crudo.extend(fila)

    def chunk(tipo, datos):
        return (
            struct.pack(">I", len(datos))
            + tipo
            + datos
            + struct.pack(">I", zlib.crc32(tipo + datos) & 0xFFFFFFFF)
        )

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", ancho, alto, 8, 2, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(crudo), 9))
    png += chunk(b"IEND", b"")

    with open(ruta, "wb") as f:
        f.write(png)
    return len(png)


def mezclar(a, b, t):
    t = max(0.0, min(1.0, t))
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def ruido(x, y, semilla):
    n = math.sin(x * 12.9898 + y * 78.233 + semilla * 37.719) * 43758.5453
    return n - math.floor(n)


def cresta(x, capa, ancho):
    """Perfil de cadena montanosa: crestas afiladas por pliegue de senos."""
    u = x / ancho
    s = capa * 11.3
    v = 0.0
    amp = 1.0
    frec = 2.3
    for _ in range(5):
        # 1 - |sin| da picos en vez de ondas: se parece mas a una sierra
        v += (1.0 - abs(math.sin(u * frec + s * (frec * 0.31)))) * amp
        amp *= 0.46
        frec *= 2.07
    return v / 1.85 - 0.5


def generar_cordillera(ancho, alto, ruta, intensidad_cobre=1.0):
    cielo_alto = (4, 18, 31)      # --c-azul-950
    cielo_medio = (10, 37, 64)    # --c-azul-800
    cielo_bajo = (21, 68, 110)
    cobre = (194, 90, 32)         # --c-cobre-600

    horizonte = alto * 0.60
    # De fondo a frente: cada capa esta mas abajo, es mas oscura y tiene menos bruma.
    capas = [
        # (y base, amplitud, color, bruma atmosferica)
        (horizonte - alto * 0.015, alto * 0.150, (37, 86, 129), 0.62),
        (horizonte + alto * 0.075, alto * 0.135, (24, 63, 99), 0.40),
        (horizonte + alto * 0.170, alto * 0.115, (14, 44, 73), 0.20),
        (horizonte + alto * 0.285, alto * 0.095, (6, 24, 41), 0.0),
    ]

    # Perfil de cada cresta, precalculado por columna
    perfiles = []
    for i, (base, amplitud, _, _) in enumerate(capas):
        perfiles.append([base - cresta(x, i + 1, ancho) * amplitud for x in range(ancho)])

    filas = []
    for y in range(alto):
        fila = bytearray()
        ty = y / alto

        # Cielo: dos tramos de gradiente
        if ty < 0.55:
            cielo = mezclar(cielo_alto, cielo_medio, ty / 0.55)
        else:
            cielo = mezclar(cielo_medio, cielo_bajo, (ty - 0.55) / 0.45)

        # Resplandor calido sobre el horizonte
        d = (y - horizonte) / (alto * 0.16)
        brillo = math.exp(-d * d) * 0.34 * intensidad_cobre
        cielo = mezclar(cielo, cobre, brillo)

        for x in range(ancho):
            color = cielo
            for i, (_, _, tono, bruma) in enumerate(capas):
                if y >= perfiles[i][x]:
                    # La bruma se disuelve a medida que la ladera baja
                    profundidad = (y - perfiles[i][x]) / (alto * 0.22)
                    color = mezclar(tono, cielo, bruma * max(0.0, 1.0 - profundidad))
            # Grano muy leve para que el gradiente no bandee
            g = (ruido(x, y, 3.0) - 0.5) * 4.0
            fila.append(max(0, min(255, int(color[0] + g))))
            fila.append(max(0, min(255, int(color[1] + g))))
            fila.append(max(0, min(255, int(color[2] + g))))
        filas.append(fila)

    return escribir_png(ruta, ancho, alto, filas)


def generar_subsuelo(ancho, alto, ruta):
    """Corte de subsuelo: estratos de la formacion y tres pozos horizontales.

    Es la imagen que acompana las secciones tecnicas. Abstracta a proposito:
    lo que tiene que leerse es la rama lateral dentro de la ventana objetivo,
    que es de lo que habla el texto al lado.
    """
    cielo_alto = (6, 24, 41)
    cielo_bajo = (10, 37, 64)
    ventana = (26, 74, 116)   # la ventana de petroleo, un paso mas clara
    cobre = (206, 117, 50)    # --c-cobre-400: trayectoria del pozo

    # Estratos: (inicio, fin, color) en fraccion de alto
    estratos = [
        (0.00, 0.30, (7, 27, 46)),
        (0.30, 0.42, (9, 33, 56)),
        (0.42, 0.52, (12, 41, 68)),
        (0.52, 0.62, (9, 34, 57)),
        (0.62, 0.74, ventana),
        (0.74, 0.86, (8, 30, 51)),
        (0.86, 1.00, (5, 20, 35)),
    ]

    # Ondulacion suave de los estratos, por columna
    def desvio(x):
        u = x / ancho
        return (math.sin(u * 2.4) * 0.016 + math.sin(u * 5.9 + 1.2) * 0.008) * alto

    # --- Trayectorias de pozo -------------------------------------------
    # Buffer de cobertura: se estampa la trayectoria y despues se compone.
    cobertura = [[0.0] * ancho for _ in range(alto)]
    etapas = []

    centro_ventana = 0.68 * alto
    radio_curva = alto * 0.16

    for k, x_boca in enumerate((0.16, 0.42, 0.68)):
        x0 = x_boca * ancho
        y_objetivo = centro_ventana + (k - 1) * alto * 0.018
        y_kickoff = y_objetivo - radio_curva
        grosor = 3.0

        puntos = []
        # Tramo vertical
        y = 0.0
        while y < y_kickoff:
            puntos.append((x0, y))
            y += 1.0
        # Curva de construccion (cuarto de circunferencia)
        pasos = 260
        for i in range(pasos + 1):
            t = (i / pasos) * (math.pi / 2)
            puntos.append((x0 + radio_curva * (1 - math.cos(t)), y_kickoff + radio_curva * math.sin(t)))
        # Rama lateral
        x = x0 + radio_curva
        largo = ancho * 0.30
        paso_etapa = largo / 9
        siguiente = paso_etapa
        recorrido = 0.0
        while recorrido < largo:
            puntos.append((x + recorrido, y_objetivo))
            if recorrido >= siguiente:
                etapas.append((x + recorrido, y_objetivo))
                siguiente += paso_etapa
            recorrido += 1.0

        for px, py in puntos:
            xi, yi = int(px), int(py)
            r = int(grosor) + 1
            for dy in range(-r, r + 1):
                yy = yi + dy
                if yy < 0 or yy >= alto:
                    continue
                for dx in range(-r, r + 1):
                    xx = xi + dx
                    if xx < 0 or xx >= ancho:
                        continue
                    d = math.hypot(px - xx, py - yy)
                    a = max(0.0, min(1.0, (grosor - d) / 1.4))
                    if a > cobertura[yy][xx]:
                        cobertura[yy][xx] = a

    # Marcadores de etapa de fractura
    for ex, ey in etapas:
        xi, yi = int(ex), int(ey)
        for dy in range(-9, 10):
            for dx in range(-9, 10):
                yy, xx = yi + dy, xi + dx
                if 0 <= yy < alto and 0 <= xx < ancho:
                    d = math.hypot(dx, dy)
                    a = max(0.0, min(1.0, (7.0 - d) / 3.0)) * 0.5
                    if a > cobertura[yy][xx]:
                        cobertura[yy][xx] = a

    filas = []
    for y in range(alto):
        fila = bytearray()
        for x in range(ancho):
            ty = (y - desvio(x)) / alto
            color = mezclar(cielo_alto, cielo_bajo, min(max(ty, 0.0), 1.0))
            for a, b, tono in estratos:
                if a <= ty < b:
                    # Veteado fino dentro de cada estrato
                    veta = math.sin((ty - a) / max(b - a, 1e-6) * math.pi * 7.0) * 0.06
                    color = mezclar(tono, (255, 255, 255), max(0.0, veta) * 0.05)
                    break
            c = cobertura[y][x]
            if c > 0:
                color = mezclar(color, cobre, c)
            g = (ruido(x, y, 7.0) - 0.5) * 3.0
            fila.append(max(0, min(255, int(color[0] + g))))
            fila.append(max(0, min(255, int(color[1] + g))))
            fila.append(max(0, min(255, int(color[2] + g))))
        filas.append(fila)

    return escribir_png(ruta, ancho, alto, filas)


if __name__ == "__main__":
    os.makedirs(SALIDA, exist_ok=True)
    piezas = [
        ("hero-cordillera.png", lambda r: generar_cordillera(1920, 1200, r)),
        ("subsuelo-lateral.png", lambda r: generar_subsuelo(1600, 1000, r)),
    ]
    for nombre, fn in piezas:
        ruta = os.path.join(SALIDA, nombre)
        peso = fn(ruta)
        print(f"{nombre}: {peso / 1024:.0f} KB")
