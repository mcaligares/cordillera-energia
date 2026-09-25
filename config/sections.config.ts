/**
 * Orden, propósito y audiencia de cada sección, por página y por variante.
 *
 * ISS-17: en el sitio anterior el orden vivía a la vez en `sections.json` y
 * hardcodeado en `home.php`, y los dos no coincidían. Acá hay una sola fuente
 * de verdad: las páginas recorren este array y no deciden nada más.
 *
 * Regla de ids: los ids que venían del sitio 2019 (`hero`, `quienes-somos`,
 * `operaciones`, `sustentabilidad`, `inversores`, `prensa`, `contacto`) NO se
 * renombran, porque hay enlaces externos y anclas indexadas apuntando a ellos.
 * Todo lo que el rediseño agrega usa un id nuevo.
 */

export const PERFILES = ['general', 'inversor', 'tech'] as const;
export type Perfil = (typeof PERFILES)[number];

/** Perfiles que se publican bajo /variantes/[perfil]. */
export const PERFILES_VARIANTE = ['inversor', 'tech'] as const;
export type PerfilVariante = (typeof PERFILES_VARIANTE)[number];

export const SECCION_IDS = [
  // --- heredadas del sitio 2019 (ids congelados) ---
  'hero',
  'quienes-somos',
  'operaciones',
  'sustentabilidad',
  'inversores',
  'prensa',
  'contacto',
  // --- nuevas del rediseño 2026 ---
  'indicadores-clave',
  'hero-inversor',
  'resultados',
  'produccion',
  'calendario-ir',
  'contacto-ir',
  'hero-tech',
  'eficiencia-perforacion',
  'digitalizacion',
  'emisiones',
] as const;

export type SeccionId = (typeof SECCION_IDS)[number];

export type Audiencia = 'Inversores' | 'Técnico' | 'Prensa' | 'General';

export interface EntradaSeccion {
  /** Id estable. Es también el `id` y el `data-section` del <section>. */
  id: SeccionId;
  /** Por qué está en esta página, en esta posición. */
  proposito: string;
  /** A quién le habla. Si son varias, la primera manda en el tono. */
  audiencia: Audiencia[];
  /** Issues de ISSUES.md que esta sección resuelve en esta página. */
  resuelve?: string[];
}

export interface ConfigPagina {
  perfil: Perfil;
  ruta: string;
  nombre: string;
  /** Qué tiene que lograr la página en los primeros cinco segundos. */
  objetivo: string;
  titulo: string;
  descripcion: string;
  secciones: EntradaSeccion[];
}

/* ==========================================================================
   Home institucional (/)
   ======================================================================= */

const home: ConfigPagina = {
  perfil: 'general',
  ruta: '/',
  nombre: 'Home institucional',
  objetivo:
    'Explicar qué hace la compañía y dar entrada a los tres públicos que llegan al sitio: inversores, perfiles técnicos y prensa.',
  titulo: 'Cordillera Energía S.A. — Shale oil y gas en Vaca Muerta',
  descripcion:
    'Compañía independiente de oil & gas con foco en shale en Vaca Muerta, Neuquén. Producción, resultados trimestrales y desempeño operativo.',
  secciones: [
    {
      id: 'hero',
      proposito: 'Decir qué es la compañía y dónde opera, con las cifras que la definen a la vista.',
      audiencia: ['General', 'Inversores', 'Técnico'],
      resuelve: ['ISS-01', 'ISS-03', 'ISS-13'],
    },
    {
      id: 'indicadores-clave',
      proposito: 'Cuatro cifras que ubican el tamaño de la compañía sin leer un párrafo.',
      audiencia: ['General', 'Inversores'],
      resuelve: ['ISS-05', 'ISS-12'],
    },
    {
      id: 'quienes-somos',
      proposito: 'Dar el contexto institucional y la tesis de foco geográfico.',
      audiencia: ['General'],
      resuelve: ['ISS-05'],
    },
    {
      id: 'operaciones',
      proposito: 'Mostrar los bloques y la actividad, con datos en lugar de relato.',
      audiencia: ['Técnico', 'General'],
      resuelve: ['ISS-08'],
    },
    {
      id: 'sustentabilidad',
      proposito: 'Exponer las métricas ESG en el sitio, no solo en el reporte anual.',
      audiencia: ['General', 'Inversores'],
      resuelve: ['ISS-09'],
    },
    {
      id: 'inversores',
      proposito: 'Puerta de entrada a IR: último trimestre, documentos con fecha y peso.',
      audiencia: ['Inversores'],
      resuelve: ['ISS-04'],
    },
    {
      id: 'prensa',
      proposito: 'Últimos hechos relevantes y novedades.',
      audiencia: ['Prensa', 'General'],
    },
    {
      id: 'contacto',
      proposito: 'Canales directos por tipo de consulta, sin formulario genérico.',
      audiencia: ['General'],
      resuelve: ['ISS-07'],
    },
  ],
};

/* ==========================================================================
   Variante inversor (/variantes/inversor)
   Objetivo: producción, resultado del último trimestre y cotización visibles
   sin scrollear; presentación, calendario y contacto de IR a un clic.
   ======================================================================= */

const inversor: ConfigPagina = {
  perfil: 'inversor',
  ruta: '/variantes/inversor',
  nombre: 'Home para inversores',
  objetivo:
    'En los primeros cinco segundos: producción del trimestre, EBITDA y cotización de CDLE. Presentación de resultados, calendario y contacto de IR a un clic.',
  titulo: 'Inversores | Cordillera Energía S.A. (CDLE)',
  descripcion:
    'Producción, resultados del 2T2026 y cotización de CDLE en NYSE y BYMA. Presentación de resultados, calendario de eventos y contacto de Relación con Inversores.',
  secciones: [
    {
      id: 'hero-inversor',
      proposito:
        'Producción, EBITDA y cotización en la primera pantalla, más el acceso directo a la presentación del trimestre.',
      audiencia: ['Inversores'],
      resuelve: ['ISS-01', 'ISS-02', 'ISS-03', 'ISS-04', 'ISS-05'],
    },
    {
      id: 'resultados',
      proposito: 'Las seis cifras del trimestre y el guidance, en una sola pantalla.',
      audiencia: ['Inversores'],
      resuelve: ['ISS-05'],
    },
    {
      id: 'produccion',
      proposito: 'La serie que muestra que el crecimiento es sostenido y no un trimestre suelto.',
      audiencia: ['Inversores'],
      resuelve: ['ISS-05', 'ISS-11'],
    },
    {
      id: 'inversores',
      proposito: 'Todos los documentos del trimestre y del ejercicio, con fecha, formato y peso.',
      audiencia: ['Inversores'],
      resuelve: ['ISS-04'],
    },
    {
      id: 'calendario-ir',
      proposito: 'Próximos eventos con fecha, en HTML y no en un PDF anual.',
      audiencia: ['Inversores'],
      resuelve: ['ISS-06'],
    },
    {
      id: 'operaciones',
      proposito: 'El respaldo operativo de los números: qué hay detrás de la producción.',
      audiencia: ['Inversores', 'Técnico'],
      resuelve: ['ISS-08'],
    },
    {
      id: 'sustentabilidad',
      proposito: 'Las métricas que piden los fondos con mandato ESG, sin abrir el reporte.',
      audiencia: ['Inversores'],
      resuelve: ['ISS-09'],
    },
    {
      id: 'prensa',
      proposito: 'Hechos relevantes recientes, filtrados a lo que le importa a un inversor.',
      audiencia: ['Inversores', 'Prensa'],
    },
    {
      id: 'contacto-ir',
      proposito: 'Email y teléfono de IR, sin formulario intermedio.',
      audiencia: ['Inversores'],
      resuelve: ['ISS-07'],
    },
  ],
};

/* ==========================================================================
   Variante tech (/variantes/tech)
   Objetivo: eficiencia operativa y tecnología, con métricas visualizadas y
   sin texto institucional.
   ======================================================================= */

const tech: ConfigPagina = {
  perfil: 'tech',
  ruta: '/variantes/tech',
  nombre: 'Home técnica y de operaciones',
  objetivo:
    'En los primeros cinco segundos: días por pozo, metros por día y grado de automatización. Después, cómo se consiguieron.',
  titulo: 'Operaciones y tecnología | Cordillera Energía S.A.',
  descripcion:
    'Días por pozo, eficiencia de perforación, digitalización de la operación e intensidad de emisiones en los bloques de Cordillera Energía en Vaca Muerta.',
  secciones: [
    {
      id: 'hero-tech',
      proposito:
        'Días por pozo arriba de todo: es la consulta #1 del buscador interno y no existía en el sitio.',
      audiencia: ['Técnico'],
      resuelve: ['ISS-01', 'ISS-03', 'ISS-08'],
    },
    {
      id: 'eficiencia-perforacion',
      proposito: 'La curva de días por pozo contra el objetivo, y las métricas que la explican.',
      audiencia: ['Técnico'],
      resuelve: ['ISS-08', 'ISS-11'],
    },
    {
      id: 'operaciones',
      proposito: 'Dónde se perfora: bloques, participación y pozos activos.',
      audiencia: ['Técnico'],
      resuelve: ['ISS-08'],
    },
    {
      id: 'digitalizacion',
      proposito: 'Qué hay en el stack y qué mueve cada pieza, con la métrica al lado.',
      audiencia: ['Técnico'],
    },
    {
      id: 'emisiones',
      proposito: 'Intensidad de emisiones como métrica operativa, no como capítulo de un PDF.',
      audiencia: ['Técnico'],
      resuelve: ['ISS-09'],
    },
    {
      id: 'produccion',
      proposito: 'El resultado de la eficiencia, expresado en producción.',
      audiencia: ['Técnico', 'Inversores'],
      resuelve: ['ISS-05', 'ISS-11'],
    },
    {
      id: 'prensa',
      proposito: 'Novedades técnicas y de operaciones.',
      audiencia: ['Técnico', 'Prensa'],
    },
    {
      id: 'contacto',
      proposito: 'Canal técnico y de talento, que es lo que busca este perfil.',
      audiencia: ['Técnico'],
      resuelve: ['ISS-07'],
    },
  ],
};

export const paginas: Record<Perfil, ConfigPagina> = { general: home, inversor, tech };

export function getConfigPagina(perfil: Perfil): ConfigPagina {
  return paginas[perfil];
}

export function esPerfilVariante(valor: string): valor is PerfilVariante {
  return (PERFILES_VARIANTE as readonly string[]).includes(valor);
}
