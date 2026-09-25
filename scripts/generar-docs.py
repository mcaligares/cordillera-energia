#!/usr/bin/env python3
"""
Genera los PDF de ejemplo que el sitio enlaza desde la seccion de inversores
y desde sustentabilidad.

Son PDF validos de una pagina, construidos a mano (sin dependencias), con el
titulo y el periodo impresos. Existen para que la demo se pueda recorrer de
punta a punta sin 404: cuando lleguen los documentos reales se reemplazan los
archivos y no cambia nada mas, porque las rutas viven en /data/inversores.ts.

Uso:  python3 scripts/generar-docs.py
"""

import os

SALIDA = os.path.join(os.path.dirname(__file__), "..", "public", "docs")

DOCUMENTOS = [
    ("cordillera-presentacion-2t2026.pdf", "Presentacion de resultados", "2T2026"),
    ("cordillera-eeff-2t2026.pdf", "Estados financieros", "2T2026"),
    ("cordillera-earnings-release-2q2026.pdf", "Earnings release", "2Q2026"),
    ("cordillera-memoria-2025.pdf", "Memoria y balance anual", "Ejercicio 2025"),
    ("cordillera-form-20f-2025.pdf", "Form 20-F", "Ejercicio 2025"),
    ("cordillera-reporte-sustentabilidad-2025.pdf", "Reporte de Sustentabilidad", "2025"),
]


def escapar(texto):
    return texto.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def construir_pdf(titulo, periodo):
    lineas = [
        (60, 760, 26, "F1", "Cordillera Energia S.A."),
        (60, 720, 18, "F2", escapar(titulo)),
        (60, 694, 14, "F2", escapar(periodo)),
        (60, 640, 11, "F2", "Documento de ejemplo generado para la demo del rediseno 2026."),
        (60, 622, 11, "F2", "Reemplazar por el archivo definitivo manteniendo el nombre."),
        (60, 580, 11, "F2", "Ruta declarada en /data/inversores.ts"),
    ]

    contenido = "BT\n"
    for x, y, tam, fuente, texto in lineas:
        contenido += f"/{fuente} {tam} Tf\n1 0 0 1 {x} {y} Tm\n({texto}) Tj\n"
    contenido += "ET\n"
    contenido_bytes = contenido.encode("latin-1")

    objetos = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        b"/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length "
        + str(len(contenido_bytes)).encode()
        + b" >>\nstream\n"
        + contenido_bytes
        + b"endstream",
    ]

    salida = bytearray(b"%PDF-1.4\n")
    posiciones = []
    for i, cuerpo in enumerate(objetos, start=1):
        posiciones.append(len(salida))
        salida += f"{i} 0 obj\n".encode() + cuerpo + b"\nendobj\n"

    inicio_xref = len(salida)
    salida += f"xref\n0 {len(objetos) + 1}\n".encode()
    salida += b"0000000000 65535 f \n"
    for posicion in posiciones:
        salida += f"{posicion:010d} 00000 n \n".encode()
    salida += (
        f"trailer\n<< /Size {len(objetos) + 1} /Root 1 0 R >>\n"
        f"startxref\n{inicio_xref}\n%%EOF\n"
    ).encode()

    return bytes(salida)


if __name__ == "__main__":
    os.makedirs(SALIDA, exist_ok=True)
    for nombre, titulo, periodo in DOCUMENTOS:
        ruta = os.path.join(SALIDA, nombre)
        with open(ruta, "wb") as f:
            f.write(construir_pdf(titulo, periodo))
        print(f"{nombre}: {os.path.getsize(ruta)} B")
