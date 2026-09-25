/** Sala de prensa y hechos relevantes. */

export interface Novedad {
  id: string;
  fechaISO: string;
  fecha: string;
  categoria: 'Hecho relevante' | 'Operaciones' | 'Financiamiento' | 'Sustentabilidad';
  titulo: string;
  resumen: string;
  href: string;
  /** Perfiles a los que la pieza le habla; la sección filtra por este campo. */
  perfiles: Array<'inversor' | 'tech' | 'general'>;
}

export const novedades: Novedad[] = [
  {
    id: 'resultados-2t2026',
    fechaISO: '2026-08-12',
    fecha: '12/08/2026',
    categoria: 'Hecho relevante',
    titulo: 'Cordillera Energía informa los resultados del segundo trimestre de 2026',
    resumen:
      'EBITDA ajustado de 296 MM USD, producción promedio de 92.400 boe/d y tercer trimestre consecutivo de flujo de caja libre positivo.',
    href: '/prensa/resultados-2t2026',
    perfiles: ['inversor', 'general'],
  },
  {
    id: 'record-perforacion',
    fechaISO: '2026-07-29',
    fecha: '29/07/2026',
    categoria: 'Operaciones',
    titulo: 'Nuevo récord de perforación: 3.400 metros de rama lateral en 11,4 días',
    resumen:
      'El pozo LCH-238(h) en Loma Chelforó bajó en 2,4 días el récord anterior de la compañía con perforación automatizada y geonavegación asistida.',
    href: '/prensa/record-perforacion-lch-238',
    perfiles: ['tech', 'general'],
  },
  {
    id: 'midstream',
    fechaISO: '2026-07-10',
    fecha: '10/07/2026',
    categoria: 'Hecho relevante',
    titulo: 'Acuerdo de evacuación por 15.000 bbl/d adicionales desde 2027',
    resumen:
      'Contrato firme de transporte por diez años que asegura la capacidad necesaria para el plan de desarrollo de Barda del Viento.',
    href: '/prensa/acuerdo-midstream-2026',
    perfiles: ['inversor', 'tech', 'general'],
  },
  {
    id: 'e-frac',
    fechaISO: '2026-06-22',
    fecha: '22/06/2026',
    categoria: 'Sustentabilidad',
    titulo: 'Entra en operación el segundo set de fractura eléctrica',
    resumen:
      'Alimentado con energía de red, reemplaza equipos diésel y evita unas 28.000 toneladas de CO₂e por año a plena actividad.',
    href: '/prensa/segundo-set-e-frac',
    perfiles: ['tech', 'general'],
  },
  {
    id: 'on-clase-9',
    fechaISO: '2026-05-14',
    fecha: '14/05/2026',
    categoria: 'Financiamiento',
    titulo: 'Emisión de Obligaciones Negociables Clase 9 por 300 MM USD con vencimiento 2033',
    resumen:
      'La colocación recibió ofertas por 2,4 veces el monto licitado y extiende la vida promedio de la deuda a 5,8 años.',
    href: '/prensa/on-clase-9',
    perfiles: ['inversor'],
  },
  {
    id: 'coi-ampliacion',
    fechaISO: '2026-04-08',
    fecha: '08/04/2026',
    categoria: 'Operaciones',
    titulo: 'El Centro de Operaciones Integradas incorpora la gestión de fractura en tiempo real',
    resumen:
      'La sala de Neuquén pasa a monitorear y ajustar los parámetros de bombeo de los dos sets desde una única consola.',
    href: '/prensa/coi-fractura-tiempo-real',
    perfiles: ['tech'],
  },
];

/** Devuelve las novedades que le hablan a un perfil, ordenadas por fecha. */
export function novedadesPara(
  perfil: 'inversor' | 'tech' | 'general',
  limite = 3,
): Novedad[] {
  return novedades
    .filter((n) => n.perfiles.includes(perfil))
    .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO))
    .slice(0, limite);
}
