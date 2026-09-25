#!/usr/bin/env node
/**
 * Siembra de datos de demo en PostHog.
 *
 * Genera tráfico histórico verosímil para las tres variantes de home
 * (institucional, inversor y tech) durante las últimas semanas, de modo que
 * el reporte semanal y las curvas de retención tengan algo que mostrar.
 *
 * Lo que produce:
 *   · personas que vuelven a lo largo de los días (retención real, no ruido)
 *   · sesiones con orden de secciones, scroll y abandono por sección
 *   · conversiones con tasas distintas por variante, alineadas con las
 *     hipótesis del CHANGELOG (la variante inversor convierte mucho más en
 *     `documento_descarga`; la tech, en `grafico_tabla_abierta`)
 *   · estacionalidad: menos tráfico los fines de semana
 *
 * Uso:
 *   node scripts/seed-posthog.mjs --dry-run          # no envía nada, escribe JSONL
 *   node scripts/seed-posthog.mjs                    # envía a PostHog
 *   node scripts/seed-posthog.mjs --days 60 --users 900
 *   node scripts/seed-posthog.mjs --dashboard        # además crea el dashboard
 *
 * Variables de entorno (.env.local):
 *   NEXT_PUBLIC_POSTHOG_KEY     project API key (phc_...)   — obligatoria
 *   NEXT_PUBLIC_POSTHOG_HOST    https://us.i.posthog.com    — opcional
 *   POSTHOG_PERSONAL_API_KEY    phx_...                     — solo para --dashboard
 *   POSTHOG_PROJECT_ID          id numérico del proyecto    — solo para --dashboard
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ==========================================================================
   Configuración
   ========================================================================= */

const args = process.argv.slice(2);
const flag = (nombre, porDefecto = null) => {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : porDefecto;
};
const tiene = (nombre) => args.includes(`--${nombre}`);

cargarEnvLocal();

/**
 * El sitio puede apuntar a un proxy inverso propio (NEXT_PUBLIC_POSTHOG_HOST
 * = '/ingest'), pero este script corre en Node y necesita el host absoluto.
 * Prioridad: --host  >  POSTHOG_INGEST_HOST  >  NEXT_PUBLIC_POSTHOG_HOST (si
 * es absoluto)  >  la región por defecto.
 */
function resolverHost() {
  const candidatos = [flag('host'), process.env.POSTHOG_INGEST_HOST, process.env.NEXT_PUBLIC_POSTHOG_HOST];
  for (const candidato of candidatos) {
    if (candidato && /^https?:\/\//.test(candidato)) return candidato.replace(/\/$/, '');
  }
  const region = process.env.POSTHOG_REGION === 'eu' ? 'eu' : 'us';
  return `https://${region}.i.posthog.com`;
}

const CONFIG = {
  dias: Number(flag('days', 35)),
  usuarios: Number(flag('users', 1200)),
  host: resolverHost(),
  clave: flag('key') ?? process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '',
  seco: tiene('dry-run'),
  dashboard: tiene('dashboard'),
  semilla: Number(flag('seed', 20260925)),
};

/* --------------------------------------------------------------------------
   Secciones por variante.
   Tienen que coincidir con /config/sections.config.ts. Si se reordena una
   página, actualizar también acá (el script es standalone a propósito: corre
   sin build y sin TypeScript).
   ----------------------------------------------------------------------- */

const PAGINAS = {
  general: {
    ruta: '/',
    secciones: [
      'hero', 'indicadores-clave', 'quienes-somos', 'operaciones',
      'sustentabilidad', 'inversores', 'prensa', 'contacto',
    ],
  },
  inversor: {
    ruta: '/variantes/inversor',
    secciones: [
      'hero-inversor', 'resultados', 'produccion', 'inversores',
      'calendario-ir', 'operaciones', 'sustentabilidad', 'prensa', 'contacto-ir',
    ],
  },
  tech: {
    ruta: '/variantes/tech',
    secciones: [
      'hero-tech', 'eficiencia-perforacion', 'operaciones', 'digitalizacion',
      'emisiones', 'produccion', 'prensa', 'contacto',
    ],
  },
};

/**
 * Tasas por variante. Son las que hacen que la demo cuente la historia del
 * CHANGELOG: el hero del perfil inversor tiene que mover `documento_descarga`
 * y `ir_contacto_click`; el tech, la lectura de gráficos.
 */
const PERFILES = {
  general: {
    peso: 0.40,
    retencionBase: 0.22,
    profundidadMedia: 0.45,
    tasas: {
      cta_click: 0.062,
      documento_descarga: 0.018,
      cotizacion_click: 0.021,
      evento_calendario_click: 0.002,
      ir_contacto_click: 0.004,
      grafico_tabla_abierta: 0.009,
    },
  },
  inversor: {
    peso: 0.34,
    retencionBase: 0.38,
    profundidadMedia: 0.62,
    tasas: {
      cta_click: 0.147,
      documento_descarga: 0.114,
      cotizacion_click: 0.068,
      evento_calendario_click: 0.041,
      ir_contacto_click: 0.052,
      grafico_tabla_abierta: 0.024,
    },
  },
  tech: {
    peso: 0.26,
    retencionBase: 0.30,
    profundidadMedia: 0.71,
    tasas: {
      cta_click: 0.129,
      documento_descarga: 0.021,
      cotizacion_click: 0.012,
      evento_calendario_click: 0.003,
      ir_contacto_click: 0.006,
      grafico_tabla_abierta: 0.063,
    },
  },
};

const DOCUMENTOS = [
  { id: 'presentacion-2t2026', periodo: '2T2026', formato: 'PDF', peso: 0.58 },
  { id: 'ff-2t2026', periodo: '2T2026', formato: 'PDF', peso: 0.14 },
  { id: 'earnings-release-2t2026', periodo: '2T2026', formato: 'PDF', peso: 0.12 },
  { id: 'form-20f-2025', periodo: 'FY2025', formato: 'PDF', peso: 0.08 },
  { id: 'memoria-2025', periodo: 'FY2025', formato: 'PDF', peso: 0.05 },
  { id: 'reporte-sustentabilidad-2025', periodo: 'FY2025', formato: 'PDF', peso: 0.03 },
];

const FUENTES = [
  { utm: 'google / organic', peso: 0.38, referrer: 'https://www.google.com/' },
  { utm: 'directo', peso: 0.24, referrer: '$direct' },
  { utm: 'linkedin / social', peso: 0.16, referrer: 'https://www.linkedin.com/' },
  { utm: 'bolsar / referral', peso: 0.09, referrer: 'https://www.bolsar.info/' },
  { utm: 'newsletter / email', peso: 0.08, referrer: 'https://mail.google.com/' },
  { utm: 'seekingalpha / referral', peso: 0.05, referrer: 'https://seekingalpha.com/' },
];

const PAISES = [
  { codigo: 'AR', nombre: 'Argentina', peso: 0.46 },
  { codigo: 'US', nombre: 'United States', peso: 0.27 },
  { codigo: 'GB', nombre: 'United Kingdom', peso: 0.08 },
  { codigo: 'BR', nombre: 'Brazil', peso: 0.07 },
  { codigo: 'ES', nombre: 'Spain', peso: 0.05 },
  { codigo: 'CL', nombre: 'Chile', peso: 0.04 },
  { codigo: 'CA', nombre: 'Canada', peso: 0.03 },
];

const DISPOSITIVOS = [
  { tipo: 'Desktop', peso: 0.58, os: 'Mac OS X', navegador: 'Chrome' },
  { tipo: 'Mobile', peso: 0.34, os: 'iOS', navegador: 'Mobile Safari' },
  { tipo: 'Tablet', peso: 0.08, os: 'iPadOS', navegador: 'Mobile Safari' },
];

const BASE_URL = 'https://www.cordilleraenergia.com.ar';

/* ==========================================================================
   Azar determinístico (mulberry32): dos corridas con la misma semilla
   producen exactamente el mismo dataset. Necesario para poder repetir la demo.
   ========================================================================= */

let estado = CONFIG.semilla >>> 0;
function azar() {
  estado |= 0;
  estado = (estado + 0x6d2b79f5) | 0;
  let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const entre = (min, max) => min + azar() * (max - min);
const enteroEntre = (min, max) => Math.floor(entre(min, max + 1));
const ocurre = (probabilidad) => azar() < probabilidad;
const elegir = (lista) => lista[Math.floor(azar() * lista.length)];

function elegirPonderado(lista, campoPeso = 'peso') {
  const total = lista.reduce((acc, item) => acc + item[campoPeso], 0);
  let r = azar() * total;
  for (const item of lista) {
    r -= item[campoPeso];
    if (r <= 0) return item;
  }
  return lista[lista.length - 1];
}

function uuid() {
  const hex = '0123456789abcdef';
  let salida = '';
  for (let i = 0; i < 32; i += 1) salida += hex[Math.floor(azar() * 16)];
  return `${salida.slice(0, 8)}-${salida.slice(8, 12)}-${salida.slice(12, 16)}-${salida.slice(16, 20)}-${salida.slice(20)}`;
}

/* ==========================================================================
   Generación
   ========================================================================= */

function crearPersonas() {
  const personas = [];
  for (let i = 0; i < CONFIG.usuarios; i += 1) {
    const perfil = elegirPonderado(
      Object.entries(PERFILES).map(([nombre, datos]) => ({ nombre, ...datos })),
    );
    const dispositivo = elegirPonderado(DISPOSITIVOS);
    const fuente = elegirPonderado(FUENTES);
    const pais = elegirPonderado(PAISES);

    personas.push({
      id: `anon_${uuid()}`,
      perfil: perfil.nombre,
      dispositivo,
      fuente,
      pais,
      // Cuánto tiende a volver esta persona en particular
      afinidad: entre(0.55, 1.5),
      // Día en que aparece por primera vez
      // Sesgo hacia los primeros días: así hay cohortes con profundidad
      // suficiente para que la retención semanal tenga cinco columnas.
      primerDia: Math.floor(Math.pow(azar(), 1.35) * CONFIG.dias),
    });
  }
  return personas;
}

/** Menos tráfico los fines de semana; más los días de publicación. */
function factorDelDia(fecha) {
  const dia = fecha.getUTCDay();
  if (dia === 0) return 0.34;
  if (dia === 6) return 0.41;
  if (dia === 1) return 1.12;
  return 1;
}

function generarSesion(persona, fecha, eventos) {
  const perfil = PERFILES[persona.perfil];
  const pagina = PAGINAS[persona.perfil];
  const sesionId = uuid();

  // Hora del día: pico entre las 9 y las 18 ART
  const hora = enteroEntre(7, 21);
  const inicio = new Date(fecha);
  inicio.setUTCHours(hora, enteroEntre(0, 59), enteroEntre(0, 59), 0);

  let t = inicio.getTime();
  const avanzar = (min, max) => {
    t += enteroEntre(min, max) * 1000;
    return new Date(t).toISOString();
  };

  const comunes = {
    distinct_id: persona.id,
    $session_id: sesionId,
    $window_id: uuid(),
    variante: persona.perfil,
    ruta: pagina.ruta,
    $current_url: `${BASE_URL}${pagina.ruta}`,
    $host: 'www.cordilleraenergia.com.ar',
    $pathname: pagina.ruta,
    $device_type: persona.dispositivo.tipo,
    $os: persona.dispositivo.os,
    $browser: persona.dispositivo.navegador,
    $referrer: persona.fuente.referrer,
    $referring_domain: persona.fuente.referrer === '$direct' ? '$direct' : new URL(persona.fuente.referrer).hostname,
    utm_source: persona.fuente.utm,
    $geoip_country_code: persona.pais.codigo,
    $geoip_country_name: persona.pais.nombre,
    // El batch histórico no tiene IP real: se evita que PostHog la sobrescriba
    $geoip_disable: true,
  };

  const emitir = (evento, extra = {}, ts = new Date(t).toISOString()) => {
    eventos.push({ event: evento, timestamp: ts, properties: { ...comunes, ...extra } });
  };

  emitir('$pageview', {
    $set: {
      variante_asignada: persona.perfil,
      primera_fuente: persona.fuente.utm,
      pais: persona.pais.nombre,
    },
    $set_once: { primera_visita: inicio.toISOString() },
  });
  emitir('variante_vista', {}, avanzar(0, 1));

  // Recorrido por secciones, con abandono creciente
  let continuidad = 1;
  let seccionesVistas = 0;
  for (let i = 0; i < pagina.secciones.length; i += 1) {
    if (i > 0) {
      // Cuanto más "profundo" es el perfil, menos cae la continuidad
      continuidad *= entre(0.62, 0.94) + perfil.profundidadMedia * 0.18;
      if (!ocurre(Math.min(continuidad, 1))) break;
    }
    emitir('seccion_vista', { seccion_id: pagina.secciones[i], posicion: i + 1 }, avanzar(3, 26));
    seccionesVistas += 1;
  }

  // Hitos de scroll coherentes con hasta dónde llegó
  const alcanzado = seccionesVistas / pagina.secciones.length;
  for (const hito of [25, 50, 75, 100]) {
    if (alcanzado * 100 >= hito) emitir('scroll_profundidad', { porcentaje: hito }, avanzar(1, 9));
  }

  if (persona.dispositivo.tipo === 'Mobile' && ocurre(0.18)) {
    emitir('menu_abierto', {}, avanzar(2, 15));
  }

  if (ocurre(perfil.tasas.cta_click)) {
    emitir('cta_click', {
      cta_id: persona.perfil === 'inversor' ? 'hero-calendario' : 'hero-resultados',
      seccion_id: pagina.secciones[0],
    }, avanzar(2, 20));
  }

  if (ocurre(perfil.tasas.cotizacion_click)) {
    emitir('cotizacion_click', { origen: ocurre(0.6) ? 'hero' : 'header' }, avanzar(2, 18));
  }

  if (ocurre(perfil.tasas.documento_descarga)) {
    const documento = elegirPonderado(DOCUMENTOS);
    emitir('documento_descarga', {
      documento_id: documento.id,
      periodo: documento.periodo,
      formato: documento.formato,
      origen: ocurre(0.62) ? 'hero' : 'listado',
      seccion_id: persona.perfil === 'inversor' ? 'hero-inversor' : 'inversores',
    }, avanzar(3, 30));
  }

  if (ocurre(perfil.tasas.evento_calendario_click)) {
    emitir('evento_calendario_click', {
      evento_id: elegir(['3t2026', 'investor-day', 'latam-energy']),
      tipo: 'Resultados',
      seccion_id: 'calendario-ir',
    }, avanzar(3, 25));
  }

  if (ocurre(perfil.tasas.grafico_tabla_abierta)) {
    emitir('grafico_tabla_abierta', {
      grafico: persona.perfil === 'tech' ? 'Días por pozo, promedio anual' : 'Producción trimestral por fluido',
      tipo: persona.perfil === 'tech' ? 'columnas' : 'lineas',
    }, avanzar(4, 30));
  }

  if (ocurre(perfil.tasas.ir_contacto_click)) {
    emitir('ir_contacto_click', {
      canal: ocurre(0.78) ? 'email' : 'telefono',
      seccion_id: 'contacto-ir',
    }, avanzar(3, 28));
  }

  emitir('$pageleave', {}, avanzar(5, 60));
}

function generarEventos(personas) {
  const eventos = [];
  const hoy = new Date();
  hoy.setUTCHours(0, 0, 0, 0);

  for (let d = 0; d < CONFIG.dias; d += 1) {
    const fecha = new Date(hoy);
    fecha.setUTCDate(fecha.getUTCDate() - (CONFIG.dias - 1 - d));
    const factor = factorDelDia(fecha);

    for (const persona of personas) {
      if (d < persona.primerDia) continue;

      const perfil = PERFILES[persona.perfil];
      const diasDesdeAlta = d - persona.primerDia;

      // Primera visita garantizada; después, retorno con decaimiento
      let probabilidad;
      if (diasDesdeAlta === 0) {
        probabilidad = 1;
      } else {
        probabilidad =
          perfil.retencionBase * persona.afinidad * factor * Math.pow(diasDesdeAlta + 1, -0.42);
      }

      if (!ocurre(Math.min(probabilidad, 0.95))) continue;

      generarSesion(persona, fecha, eventos);
      // Alguna gente abre dos veces el mismo día (típico en días de resultados)
      if (ocurre(0.07)) generarSesion(persona, fecha, eventos);
    }
  }

  eventos.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return eventos;
}

/* ==========================================================================
   Envío
   ========================================================================= */

async function enviar(eventos) {
  const TAMANO = 500;
  let enviados = 0;

  for (let i = 0; i < eventos.length; i += TAMANO) {
    const lote = eventos.slice(i, i + TAMANO);
    const respuesta = await fetch(`${CONFIG.host}/batch/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: CONFIG.clave,
        // Sin esto PostHog puede descartar eventos con timestamp viejo
        historical_migration: true,
        batch: lote,
      }),
    });

    if (!respuesta.ok) {
      const cuerpo = await respuesta.text();
      throw new Error(`PostHog respondió ${respuesta.status}: ${cuerpo.slice(0, 400)}`);
    }

    enviados += lote.length;
    process.stdout.write(`\r  enviados ${enviados}/${eventos.length} eventos`);
  }
  process.stdout.write('\n');
}

function escribirJSONL(eventos) {
  const dir = path.join(RAIZ, 'scripts', 'salida');
  fs.mkdirSync(dir, { recursive: true });
  const archivo = path.join(dir, 'posthog-seed.jsonl');
  fs.writeFileSync(archivo, eventos.map((e) => JSON.stringify(e)).join('\n') + '\n');
  return archivo;
}

/* ==========================================================================
   Dashboard del reporte semanal (opcional)
   ========================================================================= */

const INSIGHTS = [
  {
    name: 'Descargas de la presentación del trimestre, por variante',
    description:
      'ISS-04 · Hipótesis: exponer trimestre, formato y peso hace que el inversor abra la presentación del trimestre en curso.',
    query: {
      kind: 'InsightVizNode',
      source: {
        kind: 'TrendsQuery',
        dateRange: { date_from: '-30d' },
        interval: 'week',
        series: [{ kind: 'EventsNode', event: 'documento_descarga', math: 'total' }],
        breakdownFilter: { breakdown: 'variante', breakdown_type: 'event' },
      },
    },
  },
  {
    name: 'Contactos de IR, por variante',
    description:
      'ISS-07 · Hipótesis: un email visible supera al formulario de nueve campos con 3 % de completitud.',
    query: {
      kind: 'InsightVizNode',
      source: {
        kind: 'TrendsQuery',
        dateRange: { date_from: '-30d' },
        interval: 'week',
        series: [{ kind: 'EventsNode', event: 'ir_contacto_click', math: 'dau' }],
        breakdownFilter: { breakdown: 'variante', breakdown_type: 'event' },
      },
    },
  },
  {
    name: 'Embudo: visita → sección → descarga',
    description: 'ISS-01 y ISS-04 · Dónde se cae el recorrido hasta el documento.',
    query: {
      kind: 'InsightVizNode',
      source: {
        kind: 'FunnelsQuery',
        dateRange: { date_from: '-30d' },
        series: [
          { kind: 'EventsNode', event: 'variante_vista' },
          { kind: 'EventsNode', event: 'seccion_vista' },
          { kind: 'EventsNode', event: 'documento_descarga' },
        ],
        breakdownFilter: { breakdown: 'variante', breakdown_type: 'event' },
      },
    },
  },
  {
    name: 'Retención semanal de visitantes',
    description: 'Cuánta gente vuelve al sitio semana a semana, por variante.',
    query: {
      kind: 'InsightVizNode',
      source: {
        kind: 'RetentionQuery',
        dateRange: { date_from: '-35d' },
        retentionFilter: {
          period: 'Week',
          totalIntervals: 5,
          targetEntity: { id: 'variante_vista', type: 'events' },
          returningEntity: { id: 'variante_vista', type: 'events' },
          retentionType: 'retention_first_time',
        },
      },
    },
  },
  {
    name: 'Profundidad de scroll alcanzada',
    description:
      'ISS-05 · Hipótesis: con las cifras arriba el inversor scrollea menos; el perfil técnico baja más.',
    query: {
      kind: 'InsightVizNode',
      source: {
        kind: 'TrendsQuery',
        dateRange: { date_from: '-30d' },
        series: [{ kind: 'EventsNode', event: 'scroll_profundidad', math: 'total' }],
        breakdownFilter: { breakdown: 'porcentaje', breakdown_type: 'event' },
      },
    },
  },
];

async function crearDashboard() {
  const clave = process.env.POSTHOG_PERSONAL_API_KEY;
  const proyecto = process.env.POSTHOG_PROJECT_ID;

  if (!clave || !proyecto) {
    console.log(
      '\n  --dashboard omitido: faltan POSTHOG_PERSONAL_API_KEY y/o POSTHOG_PROJECT_ID en .env.local.',
    );
    return;
  }

  // El host de la API no es el de ingesta: us.i.posthog.com ingesta, us.posthog.com es la app
  const api = CONFIG.host.replace('.i.posthog.com', '.posthog.com');
  const cabeceras = { 'Content-Type': 'application/json', Authorization: `Bearer ${clave}` };

  const respuestaDashboard = await fetch(`${api}/api/projects/${proyecto}/dashboards/`, {
    method: 'POST',
    headers: cabeceras,
    body: JSON.stringify({
      name: 'Reporte semanal · Rediseño 2026',
      description:
        'Una tarjeta por hipótesis del CHANGELOG. Corte por `variante`: general (control), inversor y tech.',
    }),
  });

  if (!respuestaDashboard.ok) {
    console.log(`\n  No se pudo crear el dashboard (${respuestaDashboard.status}): ${(await respuestaDashboard.text()).slice(0, 300)}`);
    console.log('  Las insights se pueden crear a mano; las queries están en scripts/seed-posthog.mjs.');
    return;
  }

  const dashboard = await respuestaDashboard.json();

  for (const insight of INSIGHTS) {
    const respuesta = await fetch(`${api}/api/projects/${proyecto}/insights/`, {
      method: 'POST',
      headers: cabeceras,
      body: JSON.stringify({ ...insight, dashboards: [dashboard.id] }),
    });
    const estado = respuesta.ok ? 'ok' : `error ${respuesta.status}`;
    console.log(`  · ${insight.name} — ${estado}`);
  }

  console.log(`\n  Dashboard: ${api}/project/${proyecto}/dashboard/${dashboard.id}`);
}

/* ==========================================================================
   Utilidades
   ========================================================================= */

function cargarEnvLocal() {
  for (const archivo of ['.env.local', '.env']) {
    const ruta = path.join(RAIZ, archivo);
    if (!fs.existsSync(ruta)) continue;
    for (const linea of fs.readFileSync(ruta, 'utf8').split('\n')) {
      const limpia = linea.trim();
      if (!limpia || limpia.startsWith('#')) continue;
      const corte = limpia.indexOf('=');
      if (corte < 0) continue;
      const nombre = limpia.slice(0, corte).trim();
      const valor = limpia.slice(corte + 1).trim().replace(/^["']|["']$/g, '');
      if (!(nombre in process.env)) process.env[nombre] = valor;
    }
  }
}

function resumir(eventos, personas) {
  const porEvento = new Map();
  const porVariante = new Map();
  const personasPorVariante = new Map();

  for (const evento of eventos) {
    porEvento.set(evento.event, (porEvento.get(evento.event) ?? 0) + 1);
    const v = evento.properties.variante;
    if (!porVariante.has(v)) porVariante.set(v, new Map());
    const mapa = porVariante.get(v);
    mapa.set(evento.event, (mapa.get(evento.event) ?? 0) + 1);
  }
  for (const persona of personas) {
    personasPorVariante.set(persona.perfil, (personasPorVariante.get(persona.perfil) ?? 0) + 1);
  }

  console.log(`\n  ${eventos.length} eventos · ${personas.length} personas · ${CONFIG.dias} días`);
  console.log(`  ventana: ${eventos[0].timestamp.slice(0, 10)} → ${eventos[eventos.length - 1].timestamp.slice(0, 10)}\n`);

  console.log('  Eventos generados');
  for (const [nombre, cantidad] of [...porEvento].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(cantidad).padStart(7)}  ${nombre}`);
  }

  console.log('\n  Tasa de conversión por variante (sobre variante_vista)');
  const metricas = ['documento_descarga', 'ir_contacto_click', 'evento_calendario_click', 'grafico_tabla_abierta', 'cta_click'];
  const encabezado = ['variante'.padEnd(10), ...metricas.map((m) => m.slice(0, 13).padStart(14))].join('');
  console.log(`    ${encabezado}`);
  for (const [variante, mapa] of porVariante) {
    const base = mapa.get('variante_vista') ?? 1;
    const fila = metricas
      .map((m) => `${(((mapa.get(m) ?? 0) / base) * 100).toFixed(1)} %`.padStart(14))
      .join('');
    console.log(`    ${variante.padEnd(10)}${fila}`);
  }
  console.log('');
}

/* ==========================================================================
   Main
   ========================================================================= */

async function main() {
  if (!CONFIG.seco && !CONFIG.clave) {
    console.error(
      '\n  Falta NEXT_PUBLIC_POSTHOG_KEY (o --key phc_...).\n' +
        '  Para ver qué generaría sin enviar nada: node scripts/seed-posthog.mjs --dry-run\n',
    );
    process.exit(1);
  }

  console.log(`\n  Cordillera Energía · seed de PostHog${CONFIG.seco ? ' (dry run)' : ''}`);

  const personas = crearPersonas();
  const eventos = generarEventos(personas);
  resumir(eventos, personas);

  if (CONFIG.seco) {
    const archivo = escribirJSONL(eventos);
    console.log(`  Escrito en ${path.relative(RAIZ, archivo)} (no se envió nada).\n`);
    return;
  }

  console.log(`  Enviando a ${CONFIG.host}/batch/ ...`);
  await enviar(eventos);
  console.log('\n  Listo. PostHog puede tardar unos minutos en procesar el lote histórico.');

  if (CONFIG.dashboard) {
    console.log('\n  Creando el dashboard del reporte semanal...');
    await crearDashboard();
  }
  console.log('');
}

main().catch((error) => {
  console.error(`\n  Error: ${error.message}\n`);
  process.exit(1);
});
