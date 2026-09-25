/**
 * Plan de medición del rediseño 2026.
 *
 * Cada evento de acá existe porque valida (o refuta) una hipótesis concreta
 * del CHANGELOG. Si un evento no tiene hipótesis asociada, no se mide.
 * La columna "hipótesis" es la que se lee en el reporte semanal.
 */

export const EVENTOS = {
  /** Se dispara una vez por carga de página. Es el denominador de todo. */
  VARIANTE_VISTA: 'variante_vista',
  /** Sección que estuvo al menos 1 s con la mitad visible. */
  SECCION_VISTA: 'seccion_vista',
  /** Hitos de scroll: 25, 50, 75 y 100. */
  SCROLL_PROFUNDIDAD: 'scroll_profundidad',
  /** Clic en cualquier CTA marcado con data-evento. */
  CTA_CLICK: 'cta_click',
  /** Clic en un documento de IR. Métrica principal de ISS-04. */
  DOCUMENTO_DESCARGA: 'documento_descarga',
  /** Clic en el ticker o en el panel de cotización. Métrica de ISS-02. */
  COTIZACION_CLICK: 'cotizacion_click',
  /** Clic en un evento del calendario. Métrica de ISS-06. */
  EVENTO_CALENDARIO_CLICK: 'evento_calendario_click',
  /** Clic en el email o el teléfono de IR. Métrica de ISS-07. */
  IR_CONTACTO_CLICK: 'ir_contacto_click',
  /** Apertura de la tabla de datos de un gráfico. Señal de accesibilidad real. */
  GRAFICO_TABLA_ABIERTA: 'grafico_tabla_abierta',
  /** Apertura del menú móvil. Métrica de ISS-14. */
  MENU_ABIERTO: 'menu_abierto',
} as const;

export type NombreEvento = (typeof EVENTOS)[keyof typeof EVENTOS];

/** Propiedades que viajan en todos los eventos (super properties). */
export interface PropiedadesGlobales {
  /** `general`, `inversor` o `tech`. Es la dimensión de corte del reporte. */
  variante: string;
  /** Ruta de la página, sin query. */
  ruta: string;
}

/**
 * Trazabilidad evento → hipótesis. Se exporta para que el script de reporte
 * pueda imprimir la tabla sin que nadie la mantenga en dos lugares.
 */
export const HIPOTESIS: Record<NombreEvento, { issue: string; hipotesis: string; metrica: string }> = {
  [EVENTOS.VARIANTE_VISTA]: {
    issue: '—',
    hipotesis: 'Denominador de todas las tasas.',
    metrica: 'Sesiones por variante.',
  },
  [EVENTOS.SECCION_VISTA]: {
    issue: 'ISS-01',
    hipotesis:
      'Sin carrusel, el mensaje principal llega: la primera sección la ve prácticamente todo el tráfico.',
    metrica: 'seccion_vista del hero / variante_vista ≥ 95 %.',
  },
  [EVENTOS.SCROLL_PROFUNDIDAD]: {
    issue: 'ISS-05',
    hipotesis:
      'Con las cifras arriba, el inversor no necesita scrollear tanto; el perfil técnico sí baja a buscar el detalle.',
    metrica: 'Mediana de scroll depth por variante.',
  },
  [EVENTOS.CTA_CLICK]: {
    issue: 'ISS-01',
    hipotesis: 'Un solo CTA visible convierte más que un CTA escondido en el slide 2.',
    metrica: 'cta_click del hero / variante_vista.',
  },
  [EVENTOS.DOCUMENTO_DESCARGA]: {
    issue: 'ISS-04',
    hipotesis:
      'Exponer trimestre, formato y peso hace que el inversor encuentre y abra la presentación del trimestre en curso.',
    metrica: 'documento_descarga con documento_id = presentacion-2t2026, por variante.',
  },
  [EVENTOS.COTIZACION_CLICK]: {
    issue: 'ISS-02',
    hipotesis: 'Con la cotización en el hero, el rebote temprano del tráfico de EE. UU. baja.',
    metrica: 'Tasa de rebote de sesiones con origen US y clics en cotizacion_click.',
  },
  [EVENTOS.EVENTO_CALENDARIO_CLICK]: {
    issue: 'ISS-06',
    hipotesis: 'Un calendario en HTML y vigente genera registros a los eventos; el PDF anual no generaba ninguno.',
    metrica: 'evento_calendario_click / seccion_vista de calendario-ir.',
  },
  [EVENTOS.IR_CONTACTO_CLICK]: {
    issue: 'ISS-07',
    hipotesis: 'Un email visible supera al formulario de nueve campos con 3 % de completitud.',
    metrica: 'ir_contacto_click / variante_vista, contra el 3 % del formulario viejo.',
  },
  [EVENTOS.GRAFICO_TABLA_ABIERTA]: {
    issue: 'ISS-12',
    hipotesis: 'La tabla de datos no es solo un requisito de accesibilidad: hay gente que la usa.',
    metrica: 'grafico_tabla_abierta / seccion_vista de la sección que contiene el gráfico.',
  },
  [EVENTOS.MENU_ABIERTO]: {
    issue: 'ISS-14',
    hipotesis: 'El menú accesible por teclado y por toque se usa; el de hover no se podía abrir en mobile.',
    metrica: 'menu_abierto / variante_vista en sesiones mobile.',
  },
};
