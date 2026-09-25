/**
 * Operaciones, perforación, digitalización y emisiones.
 * Resuelve ISS-08 (Operaciones sin métricas; "días por pozo" era la consulta
 * #1 del buscador interno y no existía en el sitio) e ISS-09 (emisiones solo
 * dentro del PDF de sustentabilidad).
 */

import type { Cifra } from './empresa';

/* ---------------------------------------------------------------------- */

export interface Bloque {
  id: string;
  nombre: string;
  participacion: string;
  rol: 'Operado' | 'No operado';
  superficie: string;
  pozosActivos: number;
  estado: string;
}

export const bloques: Bloque[] = [
  {
    id: 'loma-chelforo',
    nombre: 'Loma Chelforó',
    participacion: '100 %',
    rol: 'Operado',
    superficie: '220 km²',
    pozosActivos: 142,
    estado: 'Desarrollo pleno',
  },
  {
    id: 'barda-del-viento',
    nombre: 'Barda del Viento',
    participacion: '85 %',
    rol: 'Operado',
    superficie: '165 km²',
    pozosActivos: 98,
    estado: 'Desarrollo pleno',
  },
  {
    id: 'puesto-cordillera',
    nombre: 'Puesto Cordillera',
    participacion: '70 %',
    rol: 'Operado',
    superficie: '98 km²',
    pozosActivos: 31,
    estado: 'Piloto ampliado',
  },
  {
    id: 'cerro-aguada',
    nombre: 'Cerro Aguada',
    participacion: '30 %',
    rol: 'No operado',
    superficie: '142 km²',
    pozosActivos: 24,
    estado: 'Delineación',
  },
];

export const operaciones = {
  titulo: 'Cuatro bloques, una sola curva de aprendizaje',
  bajada:
    'Toda la actividad se concentra en un área contigua de la ventana de petróleo de Vaca Muerta. Repetir el mismo tipo de pozo en la misma roca es lo que hace que cada pad salga mejor que el anterior.',
  resumen: [
    { etiqueta: 'Superficie neta', valor: '625', unidad: 'km²' },
    { etiqueta: 'Pozos activos', valor: '295', unidad: 'pozos' },
    { etiqueta: 'Equipos de perforación', valor: '4', unidad: 'rigs propios' },
    { etiqueta: 'Sets de fractura', valor: '2', unidad: 'uno eléctrico' },
  ],
} as const;

/* -------------------------------------------------------------------------
   Eficiencia de perforación — ISS-08
   ---------------------------------------------------------------------- */

export const eficiencia = {
  titulo: 'Cinco años bajando la curva',
  bajada:
    'Tiempo de spud a rig release en pozos horizontales, promedio por año. Es la métrica que mejor resume la eficiencia del ciclo de perforación y la que más nos preguntan.',
  serie: {
    unidad: 'días',
    nombreSerie: 'Días por pozo (promedio)',
    objetivo: { valor: 12, etiqueta: 'Objetivo: 12 días' },
    puntos: [
      { periodo: '2022', valor: 28.4 },
      { periodo: '2023', valor: 24.1 },
      { periodo: '2024', valor: 19.7 },
      { periodo: '2025', valor: 16.2 },
      { periodo: '2026 (1S)', valor: 13.8, destacado: true },
    ],
  },
  record: {
    valor: '11,4',
    unidad: 'días',
    etiqueta: 'Récord de la compañía',
    detalle: 'Pozo LCH-238(h), rama lateral de 3.400 m · julio de 2026',
  },
  metricas: [
    {
      id: 'metros-dia',
      valor: '1.180',
      unidad: 'm/día',
      etiqueta: 'Metros perforados por día',
      detalle: 'Promedio 1S2026',
      delta: { valor: '+22 %', direccion: 'sube', referencia: 'vs. 2025' },
    },
    {
      id: 'etapas-dia',
      valor: '8,4',
      unidad: 'etapas/día',
      etiqueta: 'Etapas de fractura por día',
      detalle: 'Récord de 11 en un turno',
      delta: { valor: '+31 %', direccion: 'sube', referencia: 'vs. 2025' },
    },
    {
      id: 'lateral',
      valor: '3.150',
      unidad: 'm',
      etiqueta: 'Rama lateral promedio',
      detalle: 'Pozos conectados en 1S2026',
      delta: { valor: '+17 %', direccion: 'sube', referencia: 'vs. 2025' },
    },
    {
      id: 'npt',
      valor: '4,1',
      unidad: '%',
      etiqueta: 'Tiempo no productivo (NPT)',
      detalle: 'Sobre horas de equipo',
      delta: { valor: '−3,6 p.p.', direccion: 'baja-bueno', referencia: 'vs. 2025' },
    },
  ] as Cifra[],
} as const;

/* -------------------------------------------------------------------------
   Digitalización
   ---------------------------------------------------------------------- */

export const digitalizacion = {
  titulo: 'La operación corre sobre datos en tiempo real',
  bajada:
    'El Centro de Operaciones Integradas de Neuquén recibe la telemetría de los cuatro bloques y ejecuta los modelos que deciden parámetros de perforación, mantenimiento y optimización de producción.',
  capacidades: [
    {
      id: 'coi',
      titulo: 'Centro de Operaciones Integradas',
      texto:
        'Sala 24/7 en Neuquén con ingeniería de subsuelo, perforación y producción en el mismo turno. Un cambio de parámetro llega al equipo en campo en menos de 90 segundos.',
      metrica: { valor: '24/7', etiqueta: 'operación continua' },
    },
    {
      id: 'geonavegacion',
      titulo: 'Geonavegación asistida por modelo',
      texto:
        'El modelo geológico se actualiza con datos de LWD durante la perforación y propone la corrección de trayectoria. El operador direccional decide; el modelo acorta el tiempo de decisión.',
      metrica: { valor: '96 %', etiqueta: 'del lateral en ventana objetivo' },
    },
    {
      id: 'predictivo',
      titulo: 'Mantenimiento predictivo',
      texto:
        'Vibración, presión y temperatura de bombas y compresores alimentan modelos de falla entrenados con seis años de historia propia.',
      metrica: { valor: '−37 %', etiqueta: 'paradas no programadas' },
    },
    {
      id: 'gemelo',
      titulo: 'Gemelo digital del pad',
      texto:
        'Cada pad tiene su réplica de simulación: se prueban secuencias de fractura y esquemas de producción antes de ejecutarlos en campo.',
      metrica: { valor: '4,2 TB', etiqueta: 'ingestados por día' },
    },
  ],
  stack: [
    { etiqueta: 'Telemetría', valor: '100 % de los pozos, 12.400 sensores' },
    { etiqueta: 'Latencia de campo a sala', valor: 'menor a 90 s' },
    { etiqueta: 'Perforación automatizada', valor: '78 % de los pozos del 1S2026' },
    { etiqueta: 'Modelos en producción', valor: '17, con reentrenamiento mensual' },
  ],
} as const;

/* -------------------------------------------------------------------------
   Emisiones — ISS-09
   ---------------------------------------------------------------------- */

export const emisiones = {
  titulo: 'Intensidad de emisiones',
  bajada:
    'Emisiones de alcance 1 y 2 por barril equivalente producido, en kg de CO₂e. Verificadas por tercera parte desde 2023.',
  serie: {
    unidad: 'kg CO₂e/boe',
    nombreSerie: 'Intensidad alcance 1+2',
    objetivo: { valor: 8, etiqueta: 'Meta 2027: 8,0' },
    puntos: [
      { periodo: '2022', valor: 18.9 },
      { periodo: '2023', valor: 16.4 },
      { periodo: '2024', valor: 13.8 },
      { periodo: '2025', valor: 11.2 },
      { periodo: '2026e', valor: 9.5, estimado: true },
    ],
  },
  palancas: [
    {
      titulo: 'Fractura eléctrica',
      texto:
        'El segundo set de fractura funciona con energía de red en lugar de diésel. Sobre el total de etapas del 1S2026 evitó 14.200 t de CO₂e.',
    },
    {
      titulo: 'Eliminación del venteo rutinario',
      texto:
        'Tres de los cuatro bloques ya no ventean en operación normal. El cuarto queda sujeto a la ampliación del gasoducto de captación, prevista para 2027.',
    },
    {
      titulo: 'Detección de fugas',
      texto:
        'Campañas trimestrales con cámara óptica de gas y sobrevuelo con sensor de metano en los 625 km² operados.',
    },
  ],
} as const;
