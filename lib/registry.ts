import type { ComponentType } from 'react';
import type { Perfil, SeccionId } from '@/config/sections.config';

import Hero from '@/components/sections/Hero';
import HeroInversor from '@/components/sections/HeroInversor';
import HeroTech from '@/components/sections/HeroTech';
import Indicadores from '@/components/sections/Indicadores';
import QuienesSomos from '@/components/sections/QuienesSomos';
import Resultados from '@/components/sections/Resultados';
import Produccion from '@/components/sections/Produccion';
import Inversores from '@/components/sections/Inversores';
import CalendarioIR from '@/components/sections/CalendarioIR';
import ContactoIR from '@/components/sections/ContactoIR';
import Operaciones from '@/components/sections/Operaciones';
import EficienciaPerforacion from '@/components/sections/EficienciaPerforacion';
import Digitalizacion from '@/components/sections/Digitalizacion';
import Emisiones from '@/components/sections/Emisiones';
import Sustentabilidad from '@/components/sections/Sustentabilidad';
import Prensa from '@/components/sections/Prensa';
import Contacto from '@/components/sections/Contacto';

/** Todas las secciones reciben el perfil; la mayoría lo ignora. */
export interface PropsSeccion {
  perfil?: Perfil;
}

/**
 * Único lugar donde un id de sección se resuelve a un componente.
 * Es un Record completo sobre SeccionId: si se agrega un id a
 * `sections.config.ts` y no se registra acá, TypeScript rompe el build.
 */
export const registroSecciones: Record<SeccionId, ComponentType<PropsSeccion>> = {
  hero: Hero,
  'quienes-somos': QuienesSomos,
  operaciones: Operaciones,
  sustentabilidad: Sustentabilidad,
  inversores: Inversores,
  prensa: Prensa,
  contacto: Contacto,
  'indicadores-clave': Indicadores,
  'hero-inversor': HeroInversor,
  resultados: Resultados,
  produccion: Produccion,
  'calendario-ir': CalendarioIR,
  'contacto-ir': ContactoIR,
  'hero-tech': HeroTech,
  'eficiencia-perforacion': EficienciaPerforacion,
  digitalizacion: Digitalizacion,
  emisiones: Emisiones,
};
