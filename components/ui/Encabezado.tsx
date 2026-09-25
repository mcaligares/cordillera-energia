import type { ReactNode } from 'react';
import { cx } from '@/lib/formato';
import estilos from './Encabezado.module.css';

interface Props {
  /** El id que la sección usa en aria-labelledby. */
  id: string;
  eyebrow?: string;
  titulo: string;
  bajada?: string;
  /** Nivel del heading. Todas las secciones son h2 salvo casos justificados. */
  nivel?: 2 | 3;
  alineacion?: 'izquierda' | 'centro';
  acciones?: ReactNode;
}

/** Encabezado de sección: eyebrow + heading real + bajada (ISS-13, ISS-15). */
export default function Encabezado({
  id,
  eyebrow,
  titulo,
  bajada,
  nivel = 2,
  alineacion = 'izquierda',
  acciones,
}: Props) {
  const Titulo = nivel === 2 ? 'h2' : 'h3';

  return (
    <header className={cx(estilos.encabezado, alineacion === 'centro' && estilos.centro)}>
      <div className={estilos.texto}>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <Titulo id={id} className={cx(estilos.titulo, nivel === 3 && estilos.tituloChico)}>
          {titulo}
        </Titulo>
        {bajada ? <p className={estilos.bajada}>{bajada}</p> : null}
      </div>
      {acciones ? <div className={estilos.acciones}>{acciones}</div> : null}
    </header>
  );
}
