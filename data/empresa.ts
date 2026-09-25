/**
 * Datos institucionales de Cordillera Energía S.A.
 * ISS-18: el contenido sale del markup. Para actualizar una cifra se edita
 * este archivo, no un componente.
 */

export type Direccion = 'sube' | 'baja' | 'baja-bueno' | 'sube-malo';

export interface Delta {
  valor: string;
  direccion: Direccion;
  referencia: string;
}

export interface Cifra {
  id: string;
  valor: string;
  unidad: string;
  etiqueta: string;
  detalle: string;
  delta: Delta | null;
}

export const empresa = {
  nombre: 'Cordillera Energía S.A.',
  nombreCorto: 'Cordillera Energía',
  descriptor: 'Compañía independiente de oil & gas enfocada en shale, Vaca Muerta, Neuquén.',
  fundacion: 2011,
  sede: 'Neuquén, Argentina',
  empleados: 1180,
  sitio: 'https://www.cordilleraenergia.com.ar',
} as const;

export const ultimoPeriodo = {
  trimestre: '2T2026',
  trimestreLargo: 'Segundo trimestre de 2026',
  cierre: '30 de junio de 2026',
  publicado: '12 de agosto de 2026',
  publicadoISO: '2026-08-12',
} as const;

/** Bloque de indicadores de la home institucional. */
export const indicadoresClave: Cifra[] = [
  {
    id: 'reservas',
    valor: '412',
    unidad: 'MMboe',
    etiqueta: 'Reservas 2P',
    detalle: 'Certificadas al 31/12/2025',
    delta: { valor: '+18 %', direccion: 'sube', referencia: 'vs. 2024' },
  },
  {
    id: 'superficie',
    valor: '625',
    unidad: 'km² netos',
    etiqueta: 'Superficie en Vaca Muerta',
    detalle: '4 bloques, 3 operados',
    delta: null,
  },
  {
    id: 'pozos',
    valor: '295',
    unidad: 'pozos activos',
    etiqueta: 'Pozos en producción',
    detalle: '34 conectados en el 1S2026',
    delta: { valor: '+13 %', direccion: 'sube', referencia: 'vs. 2025' },
  },
  {
    id: 'lifting',
    valor: '6,80',
    unidad: 'USD/boe',
    etiqueta: 'Lifting cost',
    detalle: ultimoPeriodo.trimestre,
    delta: { valor: '−12 %', direccion: 'baja-bueno', referencia: 'vs. 2T2025' },
  },
];

export const quienesSomos = {
  titulo: 'Una operadora construida sobre el dato',
  bajada:
    'Cordillera Energía desarrolla shale oil y shale gas en la ventana de petróleo de Vaca Muerta. Operamos tres de nuestros cuatro bloques y ejecutamos el ciclo completo: exploración, perforación, completación y producción.',
  parrafos: [
    'Desde 2011 concentramos la inversión en un área acotada de la formación, con un solo objetivo: bajar el costo de desarrollo por barril repitiendo el mismo pozo cada vez mejor. Esa disciplina se ve en los números de perforación y en el lifting cost.',
    'Cotizamos en BYMA desde 2017 y tenemos ADRs en NYSE bajo el ticker CDLE desde 2021. Reportamos bajo NIIF y publicamos resultados trimestrales con conference call abierta.',
  ],
  pilares: [
    {
      titulo: 'Foco geográfico',
      texto:
        'Cuatro bloques contiguos en el corazón de la ventana de petróleo. Sin dispersión de capital.',
    },
    {
      titulo: 'Operación propia',
      texto:
        'Operamos el 85 % de nuestra producción. Las decisiones técnicas y los tiempos son nuestros.',
    },
    {
      titulo: 'Mejora medible',
      texto:
        'Cada pozo se compara con el anterior. La curva de aprendizaje es el activo principal.',
    },
  ],
} as const;

export const sustentabilidad = {
  titulo: 'Desempeño ambiental y social',
  bajada:
    'Publicamos las métricas ESG en el sitio, no solo en el reporte anual. Los datos siguen el estándar SASB Oil & Gas — Exploration & Production.',
  metricas: [
    {
      id: 'intensidad',
      valor: '11,2',
      unidad: 'kg CO₂e/boe',
      etiqueta: 'Intensidad de emisiones alcance 1+2',
      detalle: 'Cierre 2025',
      delta: { valor: '−41 %', direccion: 'baja-bueno', referencia: 'vs. 2022' },
    },
    {
      id: 'agua',
      valor: '68',
      unidad: '%',
      etiqueta: 'Agua de retorno reutilizada',
      detalle: 'Promedio 1S2026',
      delta: { valor: '+23 p.p.', direccion: 'sube', referencia: 'vs. 2023' },
    },
    {
      id: 'venteo',
      valor: '3 de 4',
      unidad: 'bloques',
      etiqueta: 'Sin venteo rutinario',
      detalle: 'Meta: 4 de 4 en 2027',
      delta: null,
    },
    {
      id: 'trir',
      valor: '0,41',
      unidad: 'TRIR',
      etiqueta: 'Índice de accidentabilidad registrable',
      detalle: '12 meses móviles',
      delta: { valor: '−28 %', direccion: 'baja-bueno', referencia: 'vs. 2025' },
    },
  ] as Cifra[],
  reporte: {
    titulo: 'Reporte de Sustentabilidad 2025',
    href: '/docs/cordillera-reporte-sustentabilidad-2025.pdf',
    formato: 'PDF',
    peso: '6,4 MB',
    paginas: 118,
  },
} as const;

export const contacto = {
  canales: [
    {
      id: 'general',
      titulo: 'Consultas generales',
      email: 'contacto@cordilleraenergia.com.ar',
      detalle: '+54 299 447 2100 · lunes a viernes de 9 a 18 h (ART).',
    },
    {
      id: 'prensa',
      titulo: 'Prensa',
      email: 'prensa@cordilleraenergia.com.ar',
      detalle: 'Respuesta dentro de las 24 h hábiles.',
    },
    {
      id: 'proveedores',
      titulo: 'Proveedores y contrataciones',
      email: 'compras@cordilleraenergia.com.ar',
      detalle: 'Registro de proveedores y pliegos vigentes.',
    },
    {
      id: 'tecnica',
      titulo: 'Colaboración técnica y carreras',
      email: 'talento@cordilleraenergia.com.ar',
      detalle: 'Perfiles de subsuelo, perforación, datos y automatización.',
    },
  ],
  telefono: '+54 299 447 2100',
  telefonoHref: '+542994472100',
  oficinas: [
    { ciudad: 'Neuquén', direccion: 'Av. Argentina 1200, Piso 8', detalle: 'Sede operativa' },
    {
      ciudad: 'Buenos Aires',
      direccion: 'Della Paolera 265, Piso 21',
      detalle: 'Oficina corporativa',
    },
    { ciudad: 'Añelo', direccion: 'Ruta Provincial 7, km 18', detalle: 'Base de campo' },
  ],
} as const;
