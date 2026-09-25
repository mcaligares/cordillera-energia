import estilos from './Logo.module.css';
import { cx } from '@/lib/formato';

interface Props {
  /** `completo` incluye el nombre; `marca` es solo el isotipo. */
  variante?: 'completo' | 'marca';
  className?: string;
}

/**
 * Isologo de Cordillera Energía. Va inline y no por next/image a propósito:
 * hereda el color del contexto (claro y oscuro con el mismo archivo), no pesa
 * una request y queda nítido en cualquier densidad de pantalla.
 *
 * Continuidad de marca: se conserva el isotipo de tres crestas del sitio 2019;
 * lo que cambia es el ajuste óptico y el tratamiento del nombre, que pasa de
 * Arial a la tipografía del sistema.
 */
export default function Logo({ variante = 'completo', className }: Props) {
  return (
    <span className={cx(estilos.logo, className)}>
      <svg
        className={estilos.marca}
        viewBox="0 0 40 40"
        width="40"
        height="40"
        role="img"
        aria-label="Cordillera Energía"
        focusable="false"
      >
        <rect width="40" height="40" rx="7" className={estilos.caja} />
        {/* Tres crestas ascendentes: la más alta en el acento de marca */}
        <path d="M6 29 L13.5 17.5 L21 29 Z" className={estilos.crestaFondo} />
        <path d="M17 29 L24.5 15 L32 29 Z" className={estilos.crestaMedia} />
        <path d="M22.5 22.5 L27 15.5 L31.5 22.5 Z" className={estilos.crestaAcento} />
        <rect x="6" y="30.5" width="28" height="2" rx="1" className={estilos.base} />
      </svg>
      {variante === 'completo' ? (
        <span className={estilos.nombre}>
          <span className={estilos.principal}>Cordillera</span>
          <span className={estilos.secundario}>Energía</span>
        </span>
      ) : null}
    </span>
  );
}
