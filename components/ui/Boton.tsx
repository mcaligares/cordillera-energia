import Link from 'next/link';
import type { ReactNode } from 'react';
import type { NombreEvento } from '@/lib/analitica/eventos';
import { cx } from '@/lib/formato';
import estilos from './Boton.module.css';

interface Props {
  href: string;
  children: ReactNode;
  variante?: 'primario' | 'secundario' | 'fantasma';
  tono?: 'claro' | 'oscuro';
  tamano?: 'md' | 'lg';
  /** Texto chico bajo la etiqueta: formato y peso de un documento (ISS-04). */
  meta?: string;
  /** Contexto extra solo para lectores de pantalla. */
  contexto?: string;
  externo?: boolean;
  /** Evento de analítica. Lo lee por delegación el componente Analitica, así
      la sección puede seguir siendo un Server Component. */
  evento?: NombreEvento;
  eventoProps?: Record<string, unknown>;
  className?: string;
}

export default function Boton({
  href,
  children,
  variante = 'primario',
  tono = 'claro',
  tamano = 'md',
  meta,
  contexto,
  externo = false,
  evento,
  eventoProps,
  className,
}: Props) {
  const clases = cx(estilos.boton, estilos[variante], estilos[tono], estilos[tamano], className);
  const atributos = evento
    ? { 'data-evento': evento, 'data-evento-props': JSON.stringify(eventoProps ?? {}) }
    : {};

  const contenido = (
    <>
      <span className={estilos.etiqueta}>
        {children}
        {contexto ? <span className="solo-lectores"> {contexto}</span> : null}
      </span>
      {meta ? (
        <span className={estilos.meta} aria-hidden="true">
          {meta}
        </span>
      ) : null}
    </>
  );

  if (externo) {
    return (
      <a href={href} className={clases} rel="noopener noreferrer" {...atributos}>
        {contenido}
      </a>
    );
  }

  return (
    <Link href={href} className={clases} {...atributos}>
      {contenido}
    </Link>
  );
}
