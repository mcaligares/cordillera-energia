/** Navegación principal y pie de página. */

export interface ItemNav {
  etiqueta: string;
  href: string;
  descripcion?: string;
}

export const navPrincipal: ItemNav[] = [
  { etiqueta: 'Compañía', href: '/#quienes-somos', descripcion: 'Quiénes somos y dónde operamos' },
  { etiqueta: 'Operaciones', href: '/#operaciones', descripcion: 'Bloques, perforación y tecnología' },
  { etiqueta: 'Sustentabilidad', href: '/#sustentabilidad', descripcion: 'Desempeño ambiental y social' },
  { etiqueta: 'Inversores', href: '/#inversores', descripcion: 'Resultados, documentos y calendario' },
  { etiqueta: 'Prensa', href: '/#prensa', descripcion: 'Hechos relevantes y novedades' },
  { etiqueta: 'Contacto', href: '/#contacto' },
];

export const navPie: Array<{ titulo: string; items: ItemNav[] }> = [
  {
    titulo: 'Compañía',
    items: [
      { etiqueta: 'Quiénes somos', href: '/#quienes-somos' },
      { etiqueta: 'Operaciones', href: '/#operaciones' },
      { etiqueta: 'Sustentabilidad', href: '/#sustentabilidad' },
      { etiqueta: 'Trabajá con nosotros', href: '/carreras' },
    ],
  },
  {
    titulo: 'Inversores',
    items: [
      { etiqueta: 'Resultados trimestrales', href: '/#resultados' },
      { etiqueta: 'Documentos y reportes', href: '/#inversores' },
      { etiqueta: 'Calendario de eventos', href: '/#calendario-ir' },
      { etiqueta: 'Contacto de IR', href: '/#contacto-ir' },
    ],
  },
  {
    titulo: 'Gobierno corporativo',
    items: [
      { etiqueta: 'Directorio', href: '/gobierno/directorio' },
      { etiqueta: 'Código de ética', href: '/gobierno/codigo-de-etica' },
      { etiqueta: 'Línea de denuncias', href: '/gobierno/linea-de-denuncias' },
      { etiqueta: 'Política de privacidad', href: '/legales/privacidad' },
    ],
  },
];

/** Variantes de homepage disponibles, usado por el pie para señalarlas. */
export const variantes = [
  { perfil: 'inversor', etiqueta: 'Home para inversores', href: '/variantes/inversor' },
  { perfil: 'tech', etiqueta: 'Home técnica y de operaciones', href: '/variantes/tech' },
];
