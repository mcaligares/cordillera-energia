import Link from 'next/link';
import type { ConfigPagina } from '@/config/sections.config';
import { variantes } from '@/data/navegacion';
import estilos from './BarraVariante.module.css';

interface Props {
  config: ConfigPagina;
}

/**
 * Barra de contexto de la variante. Existe para la etapa de test: deja claro
 * qué versión se está viendo y permite saltar a la otra sin volver al inicio.
 * En producción se retira o queda detrás de un flag de experimento.
 */
export default function BarraVariante({ config }: Props) {
  return (
    <div className={estilos.barra} data-variante={config.perfil}>
      <div className={`contenedor ${estilos.contenido}`}>
        <p className={estilos.etiqueta}>
          <span className={estilos.punto} aria-hidden="true" />
          Variante en test: <strong>{config.nombre}</strong>
        </p>
        <nav aria-label="Otras versiones de la home" className={estilos.enlaces}>
          <Link href="/" className={estilos.enlace}>
            Home institucional
          </Link>
          {variantes
            .filter((variante) => variante.perfil !== config.perfil)
            .map((variante) => (
              <Link key={variante.href} href={variante.href} className={estilos.enlace}>
                {variante.etiqueta}
              </Link>
            ))}
        </nav>
      </div>
    </div>
  );
}
