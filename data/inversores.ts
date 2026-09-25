/**
 * Contenido del universo "Relación con Inversores".
 * Resuelve ISS-04 (documentos sin metadatos), ISS-05 (cifras solo en prosa),
 * ISS-06 (calendario en PDF anual) y ISS-07 (IR sin contacto directo).
 */

import type { Cifra } from './empresa';

/* -------------------------------------------------------------------------
   Cotización
   ISS-02: el precio no existía en la home. Ahora es parte del hero del perfil
   inversor, con su fecha y su aclaración de demora explícitas.
   ---------------------------------------------------------------------- */

export const cotizacion = {
  ticker: 'CDLE',
  actualizado: '24/09/2026, 17:00 ART',
  actualizadoISO: '2026-09-24T17:00:00-03:00',
  demora: 'Precios demorados 20 minutos. Fuente: NYSE y BYMA.',
  mercados: [
    {
      id: 'nyse',
      plaza: 'NYSE',
      instrumento: 'ADR',
      simbolo: 'CDLE',
      precio: '34,18',
      moneda: 'USD',
      variacion: '+2,71 %',
      direccion: 'sube' as const,
      nota: '1 ADR = 5 acciones ordinarias',
    },
    {
      id: 'byma',
      plaza: 'BYMA',
      instrumento: 'Acción ordinaria',
      simbolo: 'CDLE',
      precio: '12.485',
      moneda: 'ARS',
      variacion: '+1,94 %',
      direccion: 'sube' as const,
      nota: 'Panel líder',
    },
  ],
  capitalizacion: { valor: '4.120', unidad: 'MM USD', etiqueta: 'Capitalización bursátil' },
  /** Serie de 24 cierres del ADR para el sparkline del hero. */
  serieADR: [
    29.4, 29.1, 29.9, 30.6, 30.2, 31.1, 31.8, 31.4, 30.9, 31.6, 32.4, 32.1, 32.8, 33.4, 33.0,
    32.6, 33.3, 33.9, 33.5, 34.1, 33.7, 33.2, 33.3, 34.18,
  ],
  serieDesde: '28/08/2026',
} as const;

/* -------------------------------------------------------------------------
   Resultados trimestrales
   ---------------------------------------------------------------------- */

export const resultados: Cifra[] = [
  {
    id: 'ingresos',
    valor: '512',
    unidad: 'MM USD',
    etiqueta: 'Ingresos',
    detalle: 'Ventas netas del trimestre',
    delta: { valor: '+28 %', direccion: 'sube', referencia: 'vs. 2T2025' },
  },
  {
    id: 'ebitda',
    valor: '296',
    unidad: 'MM USD',
    etiqueta: 'EBITDA ajustado',
    detalle: 'Margen 57,8 %',
    delta: { valor: '+31 %', direccion: 'sube', referencia: 'vs. 2T2025' },
  },
  {
    id: 'neto',
    valor: '118',
    unidad: 'MM USD',
    etiqueta: 'Resultado neto',
    detalle: 'Atribuible a los accionistas',
    delta: { valor: '+22 %', direccion: 'sube', referencia: 'vs. 2T2025' },
  },
  {
    id: 'fcf',
    valor: '41',
    unidad: 'MM USD',
    etiqueta: 'Flujo de caja libre',
    detalle: 'Tercer trimestre consecutivo positivo',
    delta: { valor: '+19 MM', direccion: 'sube', referencia: 'vs. 2T2025' },
  },
  {
    id: 'capex',
    valor: '231',
    unidad: 'MM USD',
    etiqueta: 'Capex',
    detalle: '83 % perforación y completación',
    delta: { valor: '+14 %', direccion: 'sube', referencia: 'vs. 2T2025' },
  },
  {
    id: 'apalancamiento',
    valor: '1,1',
    unidad: 'veces',
    etiqueta: 'Deuda neta / EBITDA',
    detalle: 'Covenant: máximo 3,0×',
    delta: { valor: '−0,4×', direccion: 'baja-bueno', referencia: 'vs. 2T2025' },
  },
];

export const guidance = {
  titulo: 'Guidance 2026',
  items: [
    { etiqueta: 'Producción', valor: '95.000 – 99.000 boe/d', estado: 'Reafirmado' },
    { etiqueta: 'Capex', valor: '880 – 920 MM USD', estado: 'Reafirmado' },
    { etiqueta: 'Lifting cost', valor: '6,50 – 7,00 USD/boe', estado: 'Mejorado' },
  ],
} as const;

/* -------------------------------------------------------------------------
   Serie de producción
   ISS-05: la producción vivía dentro de un párrafo. Ahora es una serie.
   ---------------------------------------------------------------------- */

export const serieProduccion = {
  titulo: 'Producción trimestral por fluido',
  subtitulo: 'Promedio diario, en boe/d. Últimos cinco trimestres.',
  unidad: 'boe/d',
  series: [
    { id: 'petroleo', nombre: 'Petróleo', color: 'serie-1' },
    { id: 'gas', nombre: 'Gas natural', color: 'serie-2' },
  ],
  puntos: [
    { periodo: '2T2025', petroleo: 44100, gas: 24800 },
    { periodo: '3T2025', petroleo: 48600, gas: 25600 },
    { periodo: '4T2025', petroleo: 52900, gas: 26900 },
    { periodo: '1T2026', petroleo: 57300, gas: 28800 },
    { periodo: '2T2026', petroleo: 61800, gas: 30600 },
  ],
} as const;

/* -------------------------------------------------------------------------
   Documentos
   ISS-04: cada documento declara trimestre, fecha, formato y peso.
   ---------------------------------------------------------------------- */

export interface Documento {
  id: string;
  titulo: string;
  periodo: string;
  fecha: string;
  fechaISO: string;
  href: string;
  formato: string;
  peso: string;
  destacado?: boolean;
}

export const documentos: Documento[] = [
  {
    id: 'presentacion-2t2026',
    titulo: 'Presentación de resultados',
    periodo: '2T2026',
    fecha: '12/08/2026',
    fechaISO: '2026-08-12',
    href: '/docs/cordillera-presentacion-2t2026.pdf',
    formato: 'PDF',
    peso: '3,1 MB',
    destacado: true,
  },
  {
    id: 'ff-2t2026',
    titulo: 'Estados financieros',
    periodo: '2T2026',
    fecha: '12/08/2026',
    fechaISO: '2026-08-12',
    href: '/docs/cordillera-eeff-2t2026.pdf',
    formato: 'PDF',
    peso: '2,4 MB',
  },
  {
    id: 'earnings-release-2t2026',
    titulo: 'Earnings release (EN)',
    periodo: '2T2026',
    fecha: '12/08/2026',
    fechaISO: '2026-08-12',
    href: '/docs/cordillera-earnings-release-2q2026.pdf',
    formato: 'PDF',
    peso: '0,9 MB',
  },
  {
    id: 'webcast-2t2026',
    titulo: 'Grabación del conference call',
    periodo: '2T2026',
    fecha: '13/08/2026',
    fechaISO: '2026-08-13',
    href: '/docs/cordillera-webcast-2t2026',
    formato: 'Audio',
    peso: '48 min',
  },
  {
    id: 'memoria-2025',
    titulo: 'Memoria y balance anual',
    periodo: 'FY2025',
    fecha: '06/03/2026',
    fechaISO: '2026-03-06',
    href: '/docs/cordillera-memoria-2025.pdf',
    formato: 'PDF',
    peso: '8,2 MB',
  },
  {
    id: 'form-20f-2025',
    titulo: 'Form 20-F',
    periodo: 'FY2025',
    fecha: '28/04/2026',
    fechaISO: '2026-04-28',
    href: '/docs/cordillera-form-20f-2025.pdf',
    formato: 'PDF',
    peso: '5,7 MB',
  },
];

/** Fecha del documento más reciente, para el pie de la sección. */
export const ultimoPeriodoDocumentos = documentos
  .map((d) => d.fecha)
  .sort((a, b) => b.split('/').reverse().join('').localeCompare(a.split('/').reverse().join('')))[0];

/** El documento que el hero del perfil inversor expone como CTA principal. */
export const documentoDestacado =
  documentos.find((d) => d.destacado) ?? documentos[0];

/* -------------------------------------------------------------------------
   Calendario
   ISS-06: reemplaza el PDF anual. Cada evento tiene fecha ISO y estado.
   ---------------------------------------------------------------------- */

export interface Evento {
  id: string;
  fechaISO: string;
  fecha: string;
  titulo: string;
  detalle: string;
  tipo: 'Resultados' | 'Conferencia' | 'Investor Day' | 'Asamblea';
  href?: string;
  hrefTexto?: string;
}

export const eventos: Evento[] = [
  {
    id: '3t2026',
    fechaISO: '2026-11-05',
    fecha: '5 de noviembre de 2026',
    titulo: 'Resultados 3T2026',
    detalle: 'Publicación tras el cierre de mercado y conference call el 6/11 a las 10:00 ET.',
    tipo: 'Resultados',
    href: '/inversores/webcast/3t2026',
    hrefTexto: 'Registrarse al call',
  },
  {
    id: 'latam-energy',
    fechaISO: '2026-11-18',
    fecha: '18 de noviembre de 2026',
    titulo: 'Latam Energy Conference',
    detalle: 'Nueva York. Presentación corporativa y reuniones uno a uno.',
    tipo: 'Conferencia',
  },
  {
    id: 'investor-day',
    fechaISO: '2026-12-03',
    fecha: '3 de diciembre de 2026',
    titulo: 'Investor Day 2026',
    detalle: 'Buenos Aires y transmisión en vivo. Plan de desarrollo 2027-2030.',
    tipo: 'Investor Day',
    href: '/inversores/investor-day-2026',
    hrefTexto: 'Agendar',
  },
  {
    id: '4t2026',
    fechaISO: '2027-02-25',
    fecha: '25 de febrero de 2027',
    titulo: 'Resultados 4T2026 y ejercicio 2026',
    detalle: 'Cierre anual, reservas certificadas y guidance 2027.',
    tipo: 'Resultados',
  },
];

/* -------------------------------------------------------------------------
   Contacto de IR
   ISS-07: email y teléfono directos, sin formulario de 9 campos.
   ---------------------------------------------------------------------- */

export const contactoIR = {
  titulo: 'Relación con Inversores',
  bajada:
    'Escribinos directamente. Respondemos consultas de analistas, fondos e inversores individuales dentro de las 48 h hábiles.',
  responsable: {
    nombre: 'Lucía Ferreyra',
    cargo: 'Directora de Relación con Inversores',
  },
  email: 'ir@cordilleraenergia.com.ar',
  telefono: '+54 299 447 2145',
  telefonoHref: '+542994472145',
  direccion: 'Av. Argentina 1200, Piso 8 · Neuquén (Q8300) · Argentina',
  suscripcion: {
    titulo: 'Alertas de IR',
    detalle: 'Resultados, hechos relevantes y eventos, en el momento en que se publican.',
    href: '/inversores/alertas',
  },
  agente: {
    titulo: 'Agente depositario de los ADR',
    detalle: 'The Bank of New York Mellon · shareowners@bnymellon.com',
  },
} as const;
