import type { ReactNode } from 'react';
import type { SeccionId } from '@/config/sections.config';
import { cx } from '@/lib/formato';
import estilos from './Seccion.module.css';

export type TonoSeccion = 'claro' | 'hundido' | 'oscuro';

interface Props {
  /** Id estable de ISSUES/sections.config. Va como `id` y como `data-section`. */
  id: SeccionId;
  tono?: TonoSeccion;
  /** Id del encabezado que nombra la sección, para el landmark. */
  etiquetadaPor?: string;
  /** Para secciones sin encabezado visible (el hero, por ejemplo). */
  etiqueta?: string;
  className?: string;
  /** false para secciones a sangre que manejan su propio ancho (los heroes). */
  contenedor?: boolean;
  children: ReactNode;
}

/**
 * Envoltorio único de sección. Garantiza que todas las secciones del sitio
 * rendericen el mismo contrato: <section id data-section> con landmark
 * nombrado (ISS-13: antes los títulos eran <div class="section-title"> y no
 * había forma de navegar por encabezados ni por landmarks).
 */
export default function Seccion({
  id,
  tono = 'claro',
  etiquetadaPor,
  etiqueta,
  className,
  contenedor = true,
  children,
}: Props) {
  return (
    <section
      id={id}
      data-section={id}
      data-tono={tono}
      aria-labelledby={etiquetadaPor}
      aria-label={etiquetadaPor ? undefined : etiqueta}
      className={cx(
        'seccion',
        estilos.seccion,
        estilos[tono],
        // Las secciones a sangre (los heroes) manejan su propio ritmo vertical.
        !contenedor && estilos.sinPadding,
        className,
      )}
    >
      {contenedor ? <div className="contenedor">{children}</div> : children}
    </section>
  );
}
