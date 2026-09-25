'use client';

import type { PostHog } from 'posthog-js';
import type { NombreEvento } from './eventos';

const CLAVE = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
/** Con el proxy inverso (HOST = '/ingest') los enlaces "ver en PostHog" que
    genera el SDK tienen que seguir apuntando a la app, no al propio dominio. */
const UI_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ??
  (HOST.startsWith('/') ? 'https://us.posthog.com' : undefined);

let instancia: PostHog | null = null;
let cargando: Promise<PostHog | null> | null = null;

/** Sin project key no hay analítica: ni bundle, ni red, ni cookies. */
export function analiticaActiva(): boolean {
  return Boolean(CLAVE);
}

/**
 * Carga `posthog-js` bajo demanda. Al ser un import dinámico, la librería
 * sale del bundle inicial y solo se descarga si el sitio está configurado
 * para medir (ISS-11: el sitio anterior cargaba 180 KB de Chart.js en todas
 * las páginas, aunque no se usaran; no repetimos el patrón con la analítica).
 */
export async function iniciarAnalitica(): Promise<PostHog | null> {
  if (!CLAVE) return null;
  if (instancia) return instancia;

  if (!cargando) {
    cargando = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(CLAVE, {
        api_host: HOST,
        ...(UI_HOST ? { ui_host: UI_HOST } : {}),
        // Con App Router el router no recarga: el pageview se dispara a mano.
        capture_pageview: false,
        capture_pageleave: true,
        // Perfiles siempre: la retención del reporte semanal cuenta visitantes
        // anónimos, que en un sitio corporativo son la mayoría del tráfico.
        person_profiles: 'always',
        // Nada de autocapture: se mide el plan de medición, no todo lo que pasa.
        autocapture: false,
        persistence: 'localStorage+cookie',
      });
      instancia = posthog;
      return posthog;
    });
  }

  return cargando;
}

export function capturar(evento: NombreEvento | '$pageview', propiedades: Record<string, unknown> = {}) {
  instancia?.capture(evento, propiedades);
}

export function registrar(propiedades: Record<string, unknown>) {
  instancia?.register(propiedades);
}
