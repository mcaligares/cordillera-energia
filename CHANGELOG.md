# CHANGELOG — Rediseño 2026

Sitio de **Cordillera Energía S.A.** · Home institucional + dos variantes de homepage por perfil.

Cada entrada dice: **qué sección se tocó**, **qué problema de `ISSUES.md` resuelve**,
**qué hipótesis se quiere testear** y **qué métrica la valida**. Las métricas están
implementadas como eventos de PostHog en `/lib/analitica/eventos.ts`: el nombre del
evento que aparece acá es el que se dispara en producción.

> **Supuesto declarado.** Al iniciar el rediseño, el repo no contenía el código del
> sitio 2019, ni `sections.json`, ni `ISSUES.md`. Ambos se reconstruyeron como baseline
> documentado (ver la nota al inicio de cada archivo). Los ids de sección heredados
> —`hero`, `quienes-somos`, `operaciones`, `sustentabilidad`, `inversores`, `prensa`,
> `contacto`— se congelaron y **no se renombran**. Si aparecen los archivos originales,
> el único trabajo de reconciliación es remapear ids en `/config/sections.config.ts`
> y en la constante `SECTION_ID` de cada componente.

---

## 1 · Arquitectura

### 1.1 · Una sola fuente de verdad para el orden de secciones

**Secciones:** todas · **Archivos:** `config/sections.config.ts`, `lib/registry.ts`, `components/layout/RenderizadorSecciones.tsx`

| | |
|---|---|
| **Problema** | ISS-17. El orden vivía a la vez en `sections.json` y hardcodeado en `home.php`, y los dos no coincidían. Nadie recordaba cuál mandaba. |
| **Cambio** | El orden, el propósito y la audiencia de cada sección se declaran en un array por página y por variante. La página solo recorre el array. `lib/registry.ts` es un `Record` completo sobre `SeccionId`: agregar un id sin registrar su componente rompe el build de TypeScript. |
| **Hipótesis** | Reordenar o probar una variante deja de ser una tarea de desarrollo y pasa a ser un cambio de una línea, así que se testea más seguido. |
| **Métrica** | Cantidad de variantes publicadas por trimestre (hoy: 0). Tiempo de ciclo entre "quiero probar X" y "X está en producción". |

### 1.2 · Contenido separado del markup

**Secciones:** todas · **Archivos:** `data/*.ts`

| | |
|---|---|
| **Problema** | ISS-18. Los textos y las cifras estaban dentro del PHP. Actualizar la producción trimestral requería un deploy y pasaba por desarrollo. |
| **Cambio** | Todo el contenido vive en `/data`. Los componentes no tienen ni un número escrito a mano. IR puede actualizar el trimestre tocando un solo archivo. |
| **Hipótesis** | Si publicar el trimestre no depende de desarrollo, el sitio queda actualizado el mismo día del earnings release en lugar de tres días después. |
| **Métrica** | Delta en horas entre el envío a CNV/SEC y la publicación en el sitio. Objetivo: menos de 2 h. |

---

## 2 · Variante inversor — `/variantes/inversor`

> Objetivo del perfil: **producción, resultado del trimestre y cotización visibles en los
> primeros 5 segundos**; presentación, calendario y contacto de IR a un clic.

### 2.1 · `hero-inversor` (sección nueva)

**Componente:** `components/sections/HeroInversor.tsx`

| | |
|---|---|
| **Problema** | ISS-01 (carrusel de 3 slides con autoplay; el 92 % nunca veía el slide 2, donde estaba el CTA), ISS-02 (la cotización estaba a 3 clics), ISS-04 (link a PDF sin trimestre ni peso), ISS-05 (las cifras solo existían en prosa), ISS-03 (LCP 4,8 s con cuatro JPG en paralelo). |
| **Cambio** | Una sola pantalla, sin rotación: producción del trimestre como cifra protagonista, EBITDA y resultado neto al lado, panel de cotización de CDLE en NYSE y BYMA con sparkline, capitalización, hora del dato y aviso de demora. CTA principal = la presentación del trimestre, con formato, peso y fecha en el propio botón. Calendario y contacto de IR como CTA secundario y terciario. |
| **Hipótesis A** | Con la cotización en la primera pantalla, el tráfico de EE. UU. deja de rebotar buscándola. |
| **Métrica A** | Tasa de rebote de sesiones con `$geoip_country_code = US` en `/variantes/inversor` vs. `/`. Objetivo: bajar del 41 % actual a menos del 25 %. Señal de apoyo: `cotizacion_click`. |
| **Hipótesis B** | Exponer trimestre, formato y peso hace que el inversor abra la presentación sin buscar. |
| **Métrica B** | `documento_descarga` con `documento_id = presentacion-2t2026` y `origen = hero`, sobre `variante_vista`. Baseline del sitio viejo: 1,8 %. Objetivo: > 8 %. |
| **Métrica C** | `seccion_vista` de `hero-inversor` sobre `variante_vista` ≥ 95 % (contra el 8 % que veía el slide 2 del carrusel). |

### 2.2 · `resultados` (sección nueva)

**Componente:** `components/sections/Resultados.tsx`

| | |
|---|---|
| **Problema** | ISS-05. El EBITDA, el lifting cost y el apalancamiento estaban dentro de párrafos de "Quiénes somos". En test moderado, 3 de 6 participantes no encontraron la producción del último trimestre; la mediana fue 1 min 48 s. |
| **Cambio** | Seis cifras del trimestre en grilla, cada una con su delta contra un período nombrado, más la tabla de guidance 2026 con el estado de cada línea. |
| **Hipótesis** | Con las cifras como cifras, el tiempo hasta el dato baja de minutos a segundos. |
| **Métrica** | Test moderado con la misma tarea: objetivo mediana < 15 s y 6/6 de éxito. En analítica: `seccion_vista` de `resultados` con `posicion = 2` sobre `variante_vista` > 70 %. |

### 2.3 · `produccion` (sección nueva)

**Componente:** `components/sections/Produccion.tsx` · `components/ui/GraficoLineas.tsx`

| | |
|---|---|
| **Problema** | ISS-05 (no había ninguna serie temporal en todo el sitio) e ISS-11 (se cargaba Chart.js + moment, 180 KB, en todas las páginas para un gráfico de 5 barras que vivía en una sola). |
| **Cambio** | Serie de cinco trimestres por fluido, en SVG propio con tooltip de cruceta y vista de tabla. Cero dependencias de gráficos. |
| **Hipótesis** | Un trimestre bueno se discute; cinco trimestres en fila se creen. La serie sostiene la tesis de crecimiento mejor que el número suelto. |
| **Métrica** | `seccion_vista` de `produccion` y `grafico_tabla_abierta`. Señal de calidad: peso del JS de la ruta (objetivo: sin librería de charts, verificable en el output de `next build`). |

### 2.4 · `inversores` (sección heredada, rehecha)

**Componente:** `components/sections/Inversores.tsx`

| | |
|---|---|
| **Problema** | ISS-04. Había cuatro links con el texto "Presentación de resultados" y ninguno decía trimestre, formato ni peso. El 22 % de las descargas en mobile se abandonaba. |
| **Cambio** | Cada documento declara período, fecha (`<time datetime>`), formato y peso, en el texto visible y en el nombre accesible del enlace. El documento del trimestre en curso va destacado y etiquetado. |
| **Hipótesis** | Declarar el peso antes del clic elimina el abandono por descarga inesperada en mobile. |
| **Métrica** | `documento_descarga` con `origen = listado`, segmentado por `$device_type`. Objetivo: que la tasa en Mobile no sea más de 10 % inferior a la de Desktop (hoy: −22 %). |

### 2.5 · `calendario-ir` (sección nueva)

**Componente:** `components/sections/CalendarioIR.tsx` · `app/inversores/calendario.ics/route.ts`

| | |
|---|---|
| **Problema** | ISS-06. El calendario era `calendario-inversores-2025.pdf`, subido en enero y nunca actualizado: al 31/08/2026 listaba dos eventos ya ocurridos y omitía el Investor Day. |
| **Cambio** | Eventos en HTML con `<time datetime>`, indexables, más un `.ics` generado desde el **mismo array** que renderiza la sección. Es imposible que se desincronicen. |
| **Hipótesis** | Un calendario vigente y agendable genera registros a los eventos; el PDF anual generaba cero. |
| **Métrica** | `evento_calendario_click` sobre `seccion_vista` de `calendario-ir`, más descargas del `.ics` (`cta_click` con `cta_id = calendario-ics`). Baseline: 0. |

### 2.6 · `contacto-ir` (sección nueva)

**Componente:** `components/sections/ContactoIR.tsx`

| | |
|---|---|
| **Problema** | ISS-07. El único canal era el formulario general: 9 campos, un `<select>` de 11 motivos sin opción "Inversores", 3 % de completitud. No había email ni teléfono de IR publicados en ningún lado. |
| **Cambio** | Email y teléfono en texto, como enlaces, a tamaño de titular. Responsable con nombre y cargo. Sin formulario. |
| **Hipótesis** | Un email visible supera a un formulario de 9 campos por un orden de magnitud. |
| **Métrica** | `ir_contacto_click` (con `canal = email \| telefono`) sobre `variante_vista`, contra el 3 % de completitud del formulario. Objetivo: > 4 %. |

### 2.7 · Orden de la variante

Secuencia: `hero-inversor` → `resultados` → `produccion` → `inversores` → `calendario-ir` →
`operaciones` → `sustentabilidad` → `prensa` → `contacto-ir`.

| | |
|---|---|
| **Hipótesis** | El inversor quiere el número, después la serie, después el documento y recién al final el relato operativo. Poner "Quiénes somos" arriba, como en la home institucional, le cuesta una pantalla. |
| **Métrica** | `scroll_profundidad` y `seccion_vista` con `posicion`. Si más del 60 % abandona antes de `operaciones`, el orden está bien y esas secciones podrían salir de la variante. |

---

## 3 · Variante tech — `/variantes/tech`

> Objetivo del perfil: **eficiencia operativa y tecnología**, con métricas visualizadas
> y sin texto institucional.

### 3.1 · `hero-tech` (sección nueva)

**Componente:** `components/sections/HeroTech.tsx`

| | |
|---|---|
| **Problema** | ISS-08. **"días por pozo" es la consulta #1 del buscador interno** (1.204 búsquedas en seis meses, 68 % desde LinkedIn) y devolvía cero resultados. Más ISS-01 e ISS-03. |
| **Cambio** | La cifra que la gente busca es literalmente lo primero que se ve: 13,8 días, con la comparación contra 2022, el récord de la compañía y tres métricas de apoyo. Cero relato institucional. |
| **Hipótesis** | Si el dato más buscado está arriba de todo, la sesión no termina en el buscador interno ni en un rebote. |
| **Métrica** | Búsquedas internas de "días por pozo" (objetivo: → 0) y `seccion_vista` de `hero-tech`. Complemento: `cta_click` con `cta_id = hero-eficiencia`. |

### 3.2 · `eficiencia-perforacion` (sección nueva)

**Componente:** `components/sections/EficienciaPerforacion.tsx` · `components/ui/GraficoColumnas.tsx`

| | |
|---|---|
| **Problema** | ISS-08 (1.900 palabras de relato y ninguna métrica) e ISS-11. |
| **Cambio** | La curva de cinco años contra la línea de objetivo, el récord destacado, y cuatro métricas que explican la curva: metros por día, etapas por día, rama lateral y NPT. SVG propio. |
| **Hipótesis** | Un perfil técnico que ve la curva completa y el objetivo se queda a leer el resto; el que ve un párrafo se va. |
| **Métrica** | `seccion_vista` de `digitalizacion` (la sección siguiente) sobre `seccion_vista` de `eficiencia-perforacion`. Objetivo: > 55 %. |

### 3.3 · `digitalizacion` (sección nueva)

**Componente:** `components/sections/Digitalizacion.tsx`

| | |
|---|---|
| **Problema** | El stack tecnológico no existía en el sitio y es lo que busca el tráfico de LinkedIn. |
| **Cambio** | Cuatro piezas del stack, cada una con **la métrica que mueve** al lado del nombre. Regla editorial: si una pieza no tiene métrica, no entra en la sección. |
| **Hipótesis** | La métrica al lado de la capacidad es lo que diferencia esta sección de un folleto; sin ella, no retiene. |
| **Métrica** | Tiempo en sección y `seccion_vista` de `emisiones` (la siguiente). Señal de negocio: postulaciones espontáneas a `talento@` con referencia al COI. |

### 3.4 · `emisiones` (sección nueva)

**Componente:** `components/sections/Emisiones.tsx`

| | |
|---|---|
| **Problema** | ISS-09. La intensidad de emisiones, el venteo rutinario y el reúso de agua solo existían dentro del Reporte de Sustentabilidad: 118 páginas, profundidad de lectura media en la página 4. |
| **Cambio** | La serie de intensidad como métrica operativa, con la meta 2027 marcada y el valor proyectado distinguido por **trama a 45°**, no solo por color. Tres palancas explicadas en texto corto. |
| **Hipótesis** | Los datos ESG se consultan si están en HTML; en un PDF de 118 páginas no se consultan. |
| **Métrica** | `seccion_vista` de `emisiones` comparado con descargas del reporte (`documento_descarga` con `origen = sustentabilidad`). Se espera 10× más vistas de sección que descargas. |

### 3.5 · Orden y omisiones deliberadas

La variante tech **no incluye** `quienes-somos`, `indicadores-clave`, `resultados` ni
`calendario-ir`.

| | |
|---|---|
| **Hipótesis** | Este perfil viene por la operación, no por la compañía. Cada sección institucional es una pantalla entre él y lo que busca. |
| **Métrica** | `scroll_profundidad` mediana por variante. Si la mediana de tech supera a la de general con menos secciones, el recorte funcionó. |

---

## 4 · Cambios transversales

### 4.1 · Tipografía y escala

**Archivos:** `app/layout.tsx`, `app/globals.css`

| | |
|---|---|
| **Problema** | ISS-15. Arial de sistema, tamaños de 11 px a 13 px para datos y pies de foto, interlineado 1,2 en párrafos largos, sin escala definida. |
| **Cambio** | Archivo para texto y títulos (carácter en los pesos altos, buena caja para cifras grandes) + IBM Plex Mono para tickers, fechas y etiquetas de dato. Autohospedadas con `next/font`, sin FOIT ni layout shift. Escala fluida con `clamp()` y piso de 15 px para texto de apoyo. |
| **Hipótesis** | Una escala con contraste real de tamaño hace que las cifras se lean primero, que es el orden de lectura que el perfil inversor necesita. |
| **Métrica** | CLS < 0,05 en Core Web Vitals. Eye-tracking o test moderado: primera fijación sobre la cifra, no sobre el párrafo. |

### 4.2 · Color y contraste

**Archivo:** `app/globals.css`

| | |
|---|---|
| **Problema** | ISS-12. Texto de apoyo en `#8a8a8a` sobre blanco (2,9:1), cifras en `#9b9b9b` (2,5:1), links del footer en 2,8:1. |
| **Cambio** | Paleta derivada de la de marca (mismo azul cordillera, mismo cobre), reescalada para cumplir AA. Todos los pares verificados: texto secundario 7,3:1, atenuado 5,2:1, cobre de botón 5,6:1 con blanco. Los deltas nunca dependen solo del color: llevan signo y flecha, y la dirección se nombra en el texto. |
| **Hipótesis** | El contraste no es solo cumplimiento: el dato atenuado a 2,5:1 directamente no se leía. |
| **Métrica** | Cero errores de contraste en axe / Lighthouse. Puntaje de accesibilidad ≥ 95. |

### 4.3 · Estructura semántica y teclado

**Archivos:** `components/ui/Seccion.tsx`, `components/ui/Encabezado.tsx`, `components/layout/Header.tsx`, `app/layout.tsx`

| | |
|---|---|
| **Problema** | ISS-13 (4 `<h1>` en la home, títulos como `<div class="section-title">`), ISS-14 (menú solo con `:hover`, hamburguesa como `<div>` sin nombre accesible, `outline: none` global, sin skip link), ISS-16 (`<html>` sin `lang`, tres páginas con el mismo `<title>`). |
| **Cambio** | Un `<h1>` por página. Cada sección es un `<section id data-section>` con landmark nombrado por su `<h2>`. Menú como `<button>` con `aria-expanded`/`aria-controls`, cierre con Escape y devolución del foco. Skip link, foco visible, `lang="es-AR"`, título y descripción por página. |
| **Hipótesis** | La navegación por encabezados y landmarks es la forma en que un analista con lector de pantalla recorre un sitio de IR; hoy directamente no podía. |
| **Métrica** | Recorrido completo con teclado sin trampas de foco. `menu_abierto` en sesiones mobile > 0 (hoy: imposible de disparar). |

### 4.4 · Imágenes y carga

**Archivos:** `next.config.mjs`, `components/sections/Hero.tsx`, `components/sections/HeroTech.tsx`, `scripts/generar-assets.py`

| | |
|---|---|
| **Problema** | ISS-10 (14 JPG, media 1,9 MB, sin dimensiones, sin lazy, sin formatos modernos) e ISS-03 (LCP móvil p75 = 4,8 s, CLS = 0,31). |
| **Cambio** | Una imagen por hero, con `next/image`, `priority`, `sizes`, `placeholder="blur"` y dimensiones derivadas del import estático. AVIF/WebP y `deviceSizes` ajustados a los breakpoints reales del sitio. Las piezas de arte se generan proceduralmente (`npm run assets`) en la paleta de marca; se reemplazan por fotografía definitiva sin tocar ningún componente. |
| **Hipótesis** | El LCP del hero es la mitad del problema de rebote temprano del perfil inversor. |
| **Métrica** | LCP móvil p75 < 2,0 s y CLS < 0,05 en CrUX. |

### 4.5 · Gráficos propios

**Archivos:** `components/ui/GraficoLineas.tsx`, `components/ui/GraficoColumnas.tsx`, `components/ui/Sparkline.tsx`, `components/ui/TablaSerie.tsx`

| | |
|---|---|
| **Problema** | ISS-11. Chart.js + moment (180 KB) cargados en todo el sitio para un gráfico de 5 barras. |
| **Cambio** | SVG propio, sin dependencias. Marcas según sistema: línea de 2 px, marcador final de 8 px con anillo del color de la superficie, columnas de 24 px con tapa redondeada de 4 px y base recta, grilla de 1 px sólida y recesiva. Paletas validadas por script contra banda de luminosidad, piso de croma, separación bajo daltonismo (ΔE) y contraste, en claro y en oscuro. Todo gráfico tiene tooltip, `role="img"` con resumen y vista de tabla. El `Sparkline` es Server Component: no necesita interactividad. |
| **Hipótesis** | Un gráfico de 5 puntos no justifica una librería; y la vista de tabla no es solo un requisito de accesibilidad, hay gente que la usa. |
| **Métrica** | JS por ruta en el output de `next build`. `grafico_tabla_abierta` > 0 (si es 0, la tabla es solo cumplimiento y conviene revisar su affordance). |

### 4.6 · Contacto por canal

**Componente:** `components/sections/Contacto.tsx`

| | |
|---|---|
| **Problema** | ISS-07. Un formulario único de 9 campos con `<select>` de 11 motivos y 3 % de completitud. |
| **Cambio** | Cuatro canales con su dirección en texto. El canal que cada perfil busca primero se muestra destacado: `general` en la home y en la variante inversor, `tecnica` en la variante tech. |
| **Hipótesis** | Ordenar los canales por perfil hace que el técnico encuentre `talento@` sin leer los cuatro. |
| **Métrica** | Volumen entrante por casilla, segmentado por variante de origen (parámetro de campaña o referrer). |

### 4.7 · Analítica

**Archivos:** `lib/analitica/*`, `components/analitica/Analitica.tsx`, `scripts/seed-posthog.mjs`

| | |
|---|---|
| **Problema** | No había forma de saber si un cambio funcionaba. Ninguna de las hipótesis de este documento era verificable. |
| **Cambio** | PostHog con plan de medición explícito: 10 eventos, cada uno atado a una hipótesis de acá (la tabla `HIPOTESIS` en `lib/analitica/eventos.ts` es la misma que se lee en el reporte semanal). Un solo componente cliente en toda la app: las secciones siguen siendo Server Components y solo declaran `data-evento` en el markup. `posthog-js` entra por import dinámico y no existe en el bundle si no hay credenciales. |
| **Hipótesis** | Si medir no obliga a convertir secciones en Client Components, se mide todo; si obliga, se mide poco y mal. |
| **Métrica** | Cantidad de secciones marcadas `'use client'` por razones de analítica: objetivo 0 (hoy: 0). Cobertura: que las 10 hipótesis de este CHANGELOG tengan evento en producción. |

---

## 5 · Trazabilidad ISSUES → sección → evento

| Issue | Severidad | Resuelto en | Evento que lo valida |
|---|---|---|---|
| ISS-01 | alta | `hero`, `hero-inversor`, `hero-tech` | `seccion_vista`, `cta_click` |
| ISS-02 | alta | `hero-inversor`, cabecera | `cotizacion_click` |
| ISS-03 | alta | los tres heroes, `next.config.mjs` | LCP / CLS (CrUX) |
| ISS-04 | alta | `hero-inversor`, `inversores`, `resultados` | `documento_descarga` |
| ISS-05 | alta | `indicadores-clave`, `resultados`, `produccion` | `seccion_vista`, test moderado |
| ISS-06 | media | `calendario-ir` + ruta `.ics` | `evento_calendario_click` |
| ISS-07 | alta | `contacto-ir`, `contacto` | `ir_contacto_click` |
| ISS-08 | alta | `hero-tech`, `eficiencia-perforacion`, `operaciones` | búsquedas internas, `seccion_vista` |
| ISS-09 | media | `emisiones`, `sustentabilidad` | `seccion_vista` vs. `documento_descarga` |
| ISS-10 | alta | `next.config.mjs` + `next/image` | LCP / peso de imagen |
| ISS-11 | media | gráficos SVG propios | JS por ruta |
| ISS-12 | alta | `app/globals.css` | axe / Lighthouse |
| ISS-13 | alta | `Seccion`, `Encabezado` | axe |
| ISS-14 | alta | `Header`, skip link, foco | `menu_abierto`, recorrido con teclado |
| ISS-15 | media | `next/font` + escala en `:root` | CLS |
| ISS-16 | media | `app/layout.tsx`, metadata por página | impresiones en Search Console |
| ISS-17 | media | `config/sections.config.ts` | tiempo de ciclo por variante |
| ISS-18 | media | `data/*.ts` | horas entre publicación y sitio |

---

## 6 · Fuera de alcance en esta iteración

Se declaran como deuda explícita, no como olvido.

| Pendiente | Por qué importa | Métrica que lo justificaría |
|---|---|---|
| **Versión en inglés** | La compañía tiene ADRs en NYSE y el 27 % del tráfico es de habla inglesa. Hoy solo el earnings release está en inglés. Se descartó poner un selector de idioma decorativo: un control que no lleva a ningún lado es peor que no tenerlo. | Tráfico con `Accept-Language` no español sobre `/variantes/inversor` y su tasa de rebote. |
| **Cotización en vivo** | El panel de CDLE usa el último cierre desde `/data`. Conectarlo a un feed con demora de 20 min requiere decidir proveedor y costo. | `cotizacion_click` y tiempo en el panel: si el panel se mira, el feed se justifica. |
| **Páginas internas** | Los enlaces a `/prensa/*`, `/gobierno/*`, `/carreras` y `/inversores/alertas` apuntan a páginas que esta iteración no construye; hoy caen en el 404, que está diseñado. | `$pageview` sobre `/_not-found` por destino. |
| **Alertas de IR** | El flujo de suscripción es el candidato natural a convertir el tráfico de `contacto-ir` en una base propia. | `cta_click` con `cta_id = alertas-ir`. |
