# ISSUES.md — Cordillera Energía S.A.

> **Baseline reconstruido.** El `ISSUES.md` original no estaba disponible en el repo al
> iniciar el rediseño. Este documento reconstruye el backlog de problemas del sitio 2019
> a partir del patrón de uso típico de un sitio corporativo de una E&P que cotiza en BYMA
> y NYSE. Cada issue tiene un id estable que se referencia desde `CHANGELOG.md`.
> **Si aparece el archivo real, los ids deben remapearse.**

Periodo de datos citado: 01/03/2026 – 31/08/2026 (analytics + buscador interno + 6 tests moderados).

---

## Hero y primer pantallazo

### ISS-01 · Carrusel de 3 slides con autoplay
El hero rota 3 slides cada 5 s. El 92 % de las sesiones nunca ve el slide 2 y el 97 % nunca
ve el slide 3. El CTA principal vive en el slide 2. En mobile el área táctil del CTA queda
debajo del fold y por encima pasa el gesto de swipe del carrusel.
**Impacto:** el mensaje principal no llega. **Severidad:** alta.

### ISS-02 · La cotización no está en la home
`CDLE` y el precio de la acción solo aparecen en `/inversores`, a 3 clics desde la home.
El 41 % de las sesiones de escritorio con origen EE. UU. rebota en la home en menos de 15 s.
"cotizacion", "stock price" y "CDLE" son la consulta #2, #4 y #7 del buscador interno.
**Severidad:** alta.

### ISS-03 · LCP de 4.8 s en mobile
El hero carga un JPG de 2.4 MB sin `width`/`height` y tres imágenes más del carrusel
en paralelo. LCP móvil p75 = 4.8 s, CLS = 0.31.
**Severidad:** alta.

---

## Información para inversores

### ISS-04 · La presentación de resultados es un link desnudo
"Presentación de resultados" apunta a un PDF sin fecha, sin trimestre y sin peso declarado.
Hay 4 links con el mismo texto en la página. El 22 % de las descargas en mobile se abandona.
No se puede saber desde la home si el archivo es del trimestre en curso.
**Severidad:** alta.

### ISS-05 · Producción y resultados solo en prosa
Las cifras de producción, EBITDA y lifting cost están embebidas en párrafos dentro de
"Quiénes somos". No hay ninguna cifra destacada ni ninguna serie temporal en todo el sitio.
Tiempo medio hasta encontrar la producción del último trimestre en test moderado: 1 min 48 s
(3 de 6 participantes no la encontraron).
**Severidad:** alta.

### ISS-06 · El calendario de eventos es un PDF anual
`calendario-inversores-2025.pdf`, subido en enero y nunca actualizado. Al 31/08/2026 listaba
dos eventos ya ocurridos y omitía el Investor Day.
**Severidad:** media.

### ISS-07 · Contacto de IR detrás de un formulario genérico
El único canal es el formulario de contacto general: 9 campos, un `<select>` de "Motivo"
con 11 opciones, sin opción "Inversores". Tasa de completitud 3 %. No hay email ni teléfono
de IR publicados en ningún lado del sitio.
**Severidad:** alta.

---

## Operaciones y tecnología

### ISS-08 · "Operaciones" mezcla relato institucional con datos
1.900 palabras de texto corrido. Ninguna métrica operativa. **"días por pozo" es la consulta
#1 del buscador interno** (1.204 búsquedas en el período) y devuelve 0 resultados.
Origen del tráfico de esas búsquedas: 68 % LinkedIn, referidos de perfiles técnicos.
**Severidad:** alta.

### ISS-09 · Métricas de emisiones enterradas en un PDF de 120 páginas
La intensidad de emisiones, el venteo rutinario y el reúso de agua solo existen dentro del
Reporte de Sustentabilidad. Profundidad de lectura media del PDF: página 4.
**Severidad:** media.

### ISS-10 · Imágenes sin optimizar
14 JPG en la home, media de 1.9 MB, servidos a tamaño completo en todos los breakpoints,
sin `width`/`height`, sin `loading="lazy"`, sin formatos modernos.
**Severidad:** alta.

### ISS-11 · Chart.js (180 KB) para un único gráfico de barras
Se carga la librería completa más `moment.js` en todas las páginas del sitio para renderizar
un gráfico de 5 barras que aparece solo en `/inversores`.
**Severidad:** media.

---

## Accesibilidad

### ISS-12 · Contraste por debajo de AA
Texto de apoyo y captions en `#8a8a8a` sobre blanco (2.9:1). Las cifras del bloque de datos
en `#9b9b9b` (2.5:1). Links del footer en `#7d7d7d` sobre `#f2f2f2` (2.8:1).
**Severidad:** alta.

### ISS-13 · Jerarquía de headings rota
4 `<h1>` en la home (uno por slide del carrusel más el logo). Los títulos de sección son
`<div class="section-title">`. Un lector de pantalla no puede navegar por landmarks ni por
encabezados.
**Severidad:** alta.

### ISS-14 · El menú solo responde a hover
El desplegable de navegación abre con `:hover` y no tiene equivalente por teclado ni por
toque. El botón hamburguesa es un `<div>` con un `<i>` de ícono, sin nombre accesible.
No hay skip link ni foco visible: `outline: none` global en el reset.
**Severidad:** alta.

### ISS-15 · Tipografía sin escala ni carácter
Arial de sistema en todo el sitio. Tamaños entre 11 px y 13 px para datos y pies de foto.
Interlineado 1.2 en párrafos largos. Sin jerarquía tipográfica definida.
**Severidad:** media.

### ISS-16 · Falta `lang` y metadatos básicos
`<html>` sin atributo `lang`. Sin `<meta description>` por página, sin Open Graph, sin
títulos únicos. Tres páginas comparten el `<title>` "Cordillera Energía S.A.".
**Severidad:** media.

---

## Arquitectura

### ISS-17 · El orden de secciones está duplicado
`sections.json` declara el orden del home, pero `home.php` lo tiene hardcodeado y los dos
no coinciden. Cualquier cambio de orden requiere tocar los dos archivos y nadie recuerda
cuál manda. El JSON hoy solo alimenta el menú.
**Severidad:** media.

### ISS-18 · Contenido embebido en el markup
Todos los textos y cifras viven dentro del PHP. Actualizar la producción trimestral implica
un deploy y pasa por el equipo de desarrollo.
**Severidad:** media.

---

## Matriz de impacto por perfil

| Issue  | Inversor | Técnico | Institucional |
|--------|:--------:|:-------:|:-------------:|
| ISS-01 |   alto   |  alto   |     alto      |
| ISS-02 |   alto   |    —    |     bajo      |
| ISS-03 |   alto   |  alto   |     alto      |
| ISS-04 |   alto   |  bajo   |     bajo      |
| ISS-05 |   alto   |  medio  |     medio     |
| ISS-06 |   alto   |    —    |       —       |
| ISS-07 |   alto   |    —    |     bajo      |
| ISS-08 |   medio  |  alto   |     medio     |
| ISS-09 |   medio  |  alto   |     medio     |
| ISS-10 |   alto   |  alto   |     alto      |
| ISS-11 |   medio  |  medio  |     medio     |
| ISS-12 |   alto   |  alto   |     alto      |
| ISS-13 |   alto   |  alto   |     alto      |
| ISS-14 |   alto   |  alto   |     alto      |
| ISS-15 |   medio  |  medio  |     medio     |
| ISS-16 |   medio  |  medio  |     medio     |
| ISS-17 |   medio  |  medio  |     medio     |
| ISS-18 |   alto   |  medio  |     medio     |
