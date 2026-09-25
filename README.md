# Cordillera Energía S.A. — sitio 2026

Rediseño de la home de Cordillera Energía (shale oil & gas, Vaca Muerta, Neuquén;
BYMA y NYSE bajo el ticker **CDLE**) con **dos variantes de homepage por perfil de
audiencia**, construido sobre el mismo set de componentes.

| Ruta | Para quién | Qué resuelve en 5 segundos |
|---|---|---|
| `/` | General | Qué hace la compañía y por dónde entra cada público. |
| `/variantes/inversor` | Inversores y analistas | Producción, resultados del 2T2026 y cotización de CDLE. Presentación, calendario y contacto de IR a un clic. |
| `/variantes/tech` | Perfiles técnicos | Días por pozo, eficiencia de perforación, digitalización y emisiones. |

El detalle de cada decisión —qué problema resuelve, qué hipótesis testea y con qué
métrica se valida— está en **[`CHANGELOG.md`](./CHANGELOG.md)**.
El backlog de partida está en **[`ISSUES.md`](./ISSUES.md)**.

> **Nota sobre el baseline.** El repo no contenía el sitio 2019, `sections.json` ni
> `ISSUES.md` al iniciar el trabajo. Los dos últimos se reconstruyeron como baseline
> documentado (ver la nota al inicio de cada archivo). Los ids de sección heredados
> están congelados; si aparecen los originales, se remapean en
> `config/sections.config.ts` y en la constante `SECTION_ID` de cada componente.

---

## Arranque

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # build de producción
npm run typecheck    # tsc --noEmit
npx eslint .         # lint
```

Listo para Vercel sin configuración: es una app de Next.js con App Router y las tres
páginas se prerenderizan estáticas.

---

## Arquitectura

```
app/
  layout.tsx                    fuentes, metadata, skip link, header y footer
  globals.css                   TODAS las variables de diseño, en :root
  page.tsx                      home institucional
  variantes/[perfil]/page.tsx   /variantes/inversor y /variantes/tech
  inversores/calendario.ics/    route handler: .ics generado desde /data
config/
  sections.config.ts            orden, propósito y audiencia por página y variante
lib/
  registry.ts                   id de sección → componente
  formato.ts                    formateo es-AR y ticks de eje
  useAncho.ts                   medición del contenedor para los gráficos
  analitica/                    plan de medición y cliente de PostHog
data/
  empresa.ts  inversores.ts  operaciones.ts  prensa.ts  navegacion.ts
components/
  sections/                     una sección = un componente = un archivo (+ su CSS Module)
  ui/                           Seccion, Encabezado, Cifra, Boton, Logo, gráficos, tabla
  layout/                       Header, Footer, RenderizadorSecciones, BarraVariante
  analitica/                    Analitica.tsx (único Client Component de medición)
assets/marca/                   arte de marca (PNG generados, fuera de /public)
scripts/                        generadores de assets y docs, seed de PostHog
```

### Las tres reglas

**1 · El orden vive en un solo lugar.** `config/sections.config.ts` declara, por página y
por variante, un array de `{ id, proposito, audiencia, resuelve }`. La página solo
recorre ese array:

```tsx
const config = paginas.inversor;
<RenderizadorSecciones config={config} />
```

**2 · Una sección = un componente = un archivo.** Cada componente exporta un
`SECTION_ID` estable y renderiza un `<section id="..." data-section="...">` a través del
envoltorio `Seccion`, que garantiza el landmark nombrado.

**3 · El contenido no vive en el markup.** Ningún componente tiene una cifra escrita a
mano. Actualizar el trimestre es editar `data/inversores.ts`.

### Agregar una sección

1. `components/sections/MiSeccion.tsx` + `MiSeccion.module.css`, exportando `SECTION_ID`.
2. Agregar el id a `SECCION_IDS` en `config/sections.config.ts`.
3. Registrarlo en `lib/registry.ts` — es un `Record` completo sobre `SeccionId`, así que
   si falta este paso **el build de TypeScript falla**.
4. Agregar la entrada `{ id, proposito, audiencia }` al array de la página que la usa.

### Sistema de diseño

Todo en `app/globals.css`, bajo `:root`: paleta, tokens de texto, superficies, series de
gráfico, escala tipográfica fluida, espaciado, radios, sombras y duraciones. Ningún
componente hardcodea un color ni un tamaño.

Los contrastes están verificados contra WCAG AA y las paletas de gráfico contra banda de
luminosidad, piso de croma, separación bajo daltonismo y contraste sobre superficie, en
claro y en oscuro.

### Rendimiento y accesibilidad

- Server Components por defecto. `'use client'` solo en: el menú, los dos gráficos
  interactivos y el componente de analítica. Ninguna sección es cliente.
- `next/font` autohospeda Archivo e IBM Plex Mono.
- `next/image` con `priority`, `sizes`, `placeholder="blur"` y dimensiones desde el
  import estático; AVIF/WebP y `deviceSizes` ajustados a los breakpoints reales.
- Gráficos en SVG propio: cero librerías. Cada uno con tooltip, `role="img"` con
  resumen y vista de tabla.
- `lang="es-AR"`, un `<h1>` por página, landmarks nombrados, skip link, foco visible,
  menú operable con teclado y cierre con Escape.

---

## Assets y documentos

### Fotografía

Las cinco piezas viven en `assets/marca/` (fuera de `/public`, para que entren por
import estático y `next/image` saque de ahí las dimensiones y el blur):

| Archivo | Dónde se usa | Formato | Carga |
|---|---|---|---|
| `hero-cordillera.png` | `/` → `hero` | 1586 × 992 | `priority`, es el LCP |
| `subsuelo-lateral.png` | `/variantes/tech` → `hero-tech` | 1585 × 992 | `priority`, es el LCP |
| `digitalizacion.png` | `digitalizacion` | 1672 × 941 (16:9) | lazy |
| `operaciones.png` | `operaciones` | 1672 × 940 (16:9) | lazy |
| `quienes-somos.png` | `quienes-somos` | 1122 × 1402 (4:5) | lazy |

**Reemplazarlas es dejar caer el archivo con el mismo nombre.** No hay que tocar
código: las dimensiones salen del import.

Dos cosas a tener en cuenta si se cambian:

- Los dos heroes llevan un velo oscuro que tapa el tercio izquierdo (donde va el
  texto) y deja ver el derecho. El sujeto tiene que estar en ese lado, y el
  `object-position` de cada hero está calibrado para que el recorte de mobile lo
  siga. Está comentado en cada `.module.css`.
- `hero-cordillera.png` mide 1586 px de ancho y el `deviceSize` más grande es 1920:
  en pantallas muy anchas se escala un poco. Si molesta, regenerar a 1920.

### Respaldo procedural

`npm run assets` genera arte de marca procedural en `assets/marca/placeholders/`
(escribe ahí y no en `assets/marca/` justo para no pisar la fotografía). Sirve si
hace falta una pieza de relleno mientras se consigue la definitiva.

### Documentos

```bash
python3 scripts/generar-docs.py    # public/docs/*.pdf
```

PDF de ejemplo válidos, para que la demo se recorra sin 404. Se reemplazan por los
definitivos manteniendo el nombre; las rutas están en `data/inversores.ts`.

---

## Analítica (PostHog)

### Qué se mide

Diez eventos, cada uno atado a una hipótesis del CHANGELOG. La tabla `HIPOTESIS` en
`lib/analitica/eventos.ts` es la fuente de verdad de esa relación.

| Evento | Valida |
|---|---|
| `variante_vista` | Denominador de todas las tasas. |
| `seccion_vista` | ISS-01 · sin carrusel, el mensaje llega. |
| `scroll_profundidad` | ISS-05 · con las cifras arriba se scrollea distinto. |
| `cta_click` | ISS-01 · un CTA visible convierte más que uno escondido. |
| `documento_descarga` | ISS-04 · trimestre, formato y peso a la vista. |
| `cotizacion_click` | ISS-02 · la cotización en el hero. |
| `evento_calendario_click` | ISS-06 · calendario vigente en HTML. |
| `ir_contacto_click` | ISS-07 · email directo vs. formulario de 9 campos. |
| `grafico_tabla_abierta` | ISS-12 · la vista de tabla se usa, no es solo cumplimiento. |
| `menu_abierto` | ISS-14 · el menú accesible se puede abrir. |

Todos los eventos llevan `variante` y `ruta` como super properties, que son los cortes
del reporte semanal.

### Cómo está integrado

Un solo Client Component (`components/analitica/Analitica.tsx`) montado por página.
Las secciones siguen siendo Server Components: solo declaran atributos en el markup y
la captura se hace por delegación.

```tsx
<a href="/docs/..." data-evento="documento_descarga"
   data-evento-props='{"documento_id":"presentacion-2t2026","periodo":"2T2026"}'>
```

`posthog-js` entra por **import dinámico**: si no hay `NEXT_PUBLIC_POSTHOG_KEY`, la
librería no se descarga, no hay red y no hay cookies. El sitio corre igual.

### Configuración

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

| Variable | Obligatoria | Dónde se consigue |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | sí | PostHog → Settings → Project → *Project API key* (empieza con `phc_`). Es pública por diseño. |
| `NEXT_PUBLIC_POSTHOG_HOST` | no | `https://us.i.posthog.com` o `https://eu.i.posthog.com` según la región del proyecto. |
| `POSTHOG_PERSONAL_API_KEY` | solo para `--dashboard` | PostHog → Settings → Personal API keys (empieza con `phx_`). Scopes: `insight:write`, `dashboard:write`. |
| `POSTHOG_PROJECT_ID` | solo para `--dashboard` | El número en la URL: `.../project/<ID>/...`. |

En Vercel, las dos primeras van como variables de entorno del proyecto. Las otras dos
son solo para correr el seed desde una máquina local: **nunca llegan al navegador**.

### Datos de demo

`scripts/seed-posthog.mjs` genera tráfico histórico verosímil para que el reporte
semanal y la retención tengan algo que mostrar desde el primer día.

```bash
npm run seed:posthog:dry     # no envía nada; escribe scripts/salida/posthog-seed.jsonl
npm run seed:posthog         # envía a PostHog
node scripts/seed-posthog.mjs --days 60 --users 1500
node scripts/seed-posthog.mjs --dashboard   # además crea el dashboard del reporte
```

Con los valores por defecto (35 días, 1.200 personas) produce unos **32.000 eventos y
3.700 sesiones**, con:

- **retención real**: las mismas personas vuelven a lo largo de las semanas, con una
  curva que aplana cerca del 40 % (no ruido aleatorio);
- **estacionalidad**: menos tráfico los fines de semana;
- **tasas por variante alineadas con las hipótesis** — `documento_descarga` al 12 % en
  la variante inversor contra 1 % en la institucional; `grafico_tabla_abierta` al 6,7 %
  en la tech;
- **cortes utilizables**: dispositivo, país, fuente de tráfico y sección.

Es determinístico: la misma `--seed` produce exactamente el mismo dataset, así que la
demo se puede repetir. Los eventos se envían a `/batch/` con `historical_migration: true`
para que PostHog no descarte los timestamps viejos.

Con `--dashboard` crea *Reporte semanal · Rediseño 2026* con cinco insights: descargas
de la presentación por variante, contactos de IR por variante, embudo visita → sección →
descarga, retención semanal y profundidad de scroll.

> El seed escribe en el proyecto de PostHog que apunten las credenciales. Conviene
> usar un proyecto de demo, no el de producción.

---

## Deploy en Vercel

El proyecto se detecta solo: es una app de Next.js con App Router. **No hace falta
`vercel.json`** — todo lo que se puede configurar por código ya está en
`next.config.mjs`.

### 1 · Importar el repo

Vercel → *Add New* → *Project* → elegir el repositorio. Los valores por defecto son
correctos; no cambies nada:

| Campo | Valor | |
|---|---|---|
| Framework Preset | **Next.js** | autodetectado |
| Build Command | `next build` | por defecto |
| Output Directory | *(vacío)* | Next lo maneja |
| Install Command | `npm install` | por defecto |
| Root Directory | `./` | |
| Node.js Version | **22.x** | 20.x también sirve; el proyecto pide `>=20.9` |

Las tres páginas se prerenderizan estáticas y se sirven desde la CDN. La única ruta
dinámica es el proxy de analítica.

### 2 · Variables de entorno

En *Settings → Environment Variables*. **Solo estas dos**, y en los tres entornos
(Production, Preview, Development):

| Variable | Valor | |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_...` | la project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | `/ingest` | ver el punto 3 |

Si el proyecto de PostHog está en la UE, agregá también `POSTHOG_REGION=eu` y
`NEXT_PUBLIC_POSTHOG_UI_HOST=https://eu.posthog.com`.

> **`POSTHOG_PERSONAL_API_KEY` y `POSTHOG_PROJECT_ID` no van en Vercel.** Son solo
> para correr el seed desde una máquina local. La personal key da acceso de escritura
> a todo el proyecto de PostHog; no tiene nada que hacer en un entorno de build.

Cualquier variable con prefijo `NEXT_PUBLIC_` se **inlinea en el bundle en build
time**: para que un cambio tenga efecto hay que redeployar, no alcanza con guardarla.

### 3 · Por qué `NEXT_PUBLIC_POSTHOG_HOST=/ingest`

Los bloqueadores de publicidad filtran `*.posthog.com` por lista. En un sitio de IR eso
no es un detalle menor: el perfil técnico —justo el de la variante `tech`— es el que
más los usa, así que **la variante que más queremos medir sería la peor medida**, y el
reporte semanal compararía variantes con sesgos distintos.

`next.config.mjs` define un proxy inverso que sirve la ingesta desde el propio dominio:

```
/ingest/static/*  →  https://us-assets.i.posthog.com/static/*
/ingest/*         →  https://us.i.posthog.com/*
```

El cliente lo usa automáticamente cuando `NEXT_PUBLIC_POSTHOG_HOST` es `/ingest`, y
apunta los enlaces "ver en PostHog" a la app real vía `ui_host`. Con un host absoluto,
el proxy simplemente no se usa: sirve para desarrollo o para volver atrás sin tocar
código.

Verificable en cualquier deploy:

```bash
curl -sI https://<tu-dominio>/ingest/static/array.js   # 200, application/javascript
```

### 4 · Cabeceras de seguridad

`next.config.mjs` las aplica a todas las rutas: `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options`, `Strict-Transport-Security` y
`Permissions-Policy`. `X-Powered-By` está desactivado.

**No hay `Content-Security-Policy`**, y es deliberado: una CSP estricta en Next necesita
un nonce por request, lo que obliga a un `middleware.ts` y convierte las páginas
estáticas en dinámicas. Para un sitio que hoy es 100 % estático el costo no se justifica
todavía. Queda como paso siguiente si se agrega algún formulario.

### 5 · Dominio

*Settings → Domains* → agregar `www.cordilleraenergia.com.ar` y redirigir el apex.
Cuando el dominio definitivo esté, actualizar `empresa.sitio` en `data/empresa.ts`:
de ahí salen `metadataBase`, el Open Graph y las URLs del `.ics`.

### 6 · Después del primer deploy

```bash
npx vercel env pull .env.local     # traer las variables a local
npm run seed:posthog               # sembrar la demo (una sola vez)
```

Chequeos rápidos sobre el deploy:

- `/` , `/variantes/inversor` y `/variantes/tech` responden 200
- `/inversores/calendario.ics` baja un archivo `text/calendar`
- `/ingest/static/array.js` responde 200
- en PostHog aparecen eventos `variante_vista` con `variante` = `general`, `inversor` y `tech`

---

## Qué quedó fuera

Declarado como deuda explícita en la [sección 6 del CHANGELOG](./CHANGELOG.md#6--fuera-de-alcance-en-esta-iteración):
versión en inglés, cotización en vivo, páginas internas y el flujo de alertas de IR.
