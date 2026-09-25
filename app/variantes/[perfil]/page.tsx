import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RenderizadorSecciones from '@/components/layout/RenderizadorSecciones';
import { PERFILES_VARIANTE, esPerfilVariante, paginas } from '@/config/sections.config';
import BarraVariante from '@/components/layout/BarraVariante';
import Analitica from '@/components/analitica/Analitica';

interface Props {
  params: Promise<{ perfil: string }>;
}

/** Las dos variantes se generan estáticas en build. */
export function generateStaticParams() {
  return PERFILES_VARIANTE.map((perfil) => ({ perfil }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { perfil } = await params;
  if (!esPerfilVariante(perfil)) return {};
  const config = paginas[perfil];
  return {
    title: { absolute: config.titulo },
    description: config.descripcion,
    alternates: { canonical: config.ruta },
    openGraph: { title: config.titulo, description: config.descripcion },
  };
}

/**
 * Variante de homepage por perfil.
 * Reutiliza exactamente los mismos componentes que la home institucional: lo
 * único que cambia es el array de `sections.config.ts` que se recorre.
 */
export default async function PaginaVariante({ params }: Props) {
  const { perfil } = await params;
  if (!esPerfilVariante(perfil)) notFound();

  const config = paginas[perfil];

  return (
    <>
      <Analitica variante={config.perfil} />
      <BarraVariante config={config} />
      <RenderizadorSecciones config={config} />
    </>
  );
}
