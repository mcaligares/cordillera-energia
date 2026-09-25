import Analitica from '@/components/analitica/Analitica';
import RenderizadorSecciones from '@/components/layout/RenderizadorSecciones';
import { paginas } from '@/config/sections.config';
import type { Metadata } from 'next';

const config = paginas.general;

export const metadata: Metadata = {
  title: { absolute: config.titulo },
  description: config.descripcion,
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <Analitica variante={config.perfil} />
      <RenderizadorSecciones config={config} />
    </>
  );
}
