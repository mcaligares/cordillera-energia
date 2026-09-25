import type { Cifra as DatoCifra } from '@/data/empresa';
import { cx } from '@/lib/formato';
import estilos from './Cifra.module.css';

interface Props {
  dato: DatoCifra;
  /** `xl` para el dato protagonista de un hero; `sm` para grillas densas. */
  tamano?: 'sm' | 'md' | 'xl';
  tono?: 'claro' | 'oscuro';
  className?: string;
}

const FLECHA: Record<string, string> = {
  sube: '▲',
  'sube-malo': '▲',
  baja: '▼',
  'baja-bueno': '▼',
};

/**
 * Ficha de dato: etiqueta, valor, unidad y delta contra un período nombrado.
 * ISS-05: las cifras vivían dentro de párrafos. ISS-12: el delta nunca depende
 * solo del color — siempre lleva signo y flecha, y la dirección se nombra en
 * texto para lectores de pantalla.
 */
export default function Cifra({ dato, tamano = 'md', tono = 'claro', className }: Props) {
  const { valor, unidad, etiqueta, detalle, delta } = dato;
  const esBueno = delta?.direccion === 'sube' || delta?.direccion === 'baja-bueno';

  return (
    <div className={cx(estilos.cifra, estilos[tamano], estilos[tono], className)}>
      <p className={estilos.etiqueta}>{etiqueta}</p>
      <p className={cx('dato', estilos.valor)}>
        {valor}
        <span className={estilos.unidad}>{unidad}</span>
      </p>
      <p className={estilos.pie}>
        {delta ? (
          <span className={cx(estilos.delta, esBueno ? estilos.bueno : estilos.malo)}>
            <span aria-hidden="true">{FLECHA[delta.direccion]}</span>
            <span>
              {delta.valor}{' '}
              <span className={estilos.referencia}>{delta.referencia}</span>
            </span>
          </span>
        ) : null}
        <span className={estilos.detalle}>{detalle}</span>
      </p>
    </div>
  );
}
