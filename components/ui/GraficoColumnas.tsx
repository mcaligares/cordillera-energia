'use client';

import { useId, useState } from 'react';
import { EVENTOS } from '@/lib/analitica/eventos';
import { capturar } from '@/lib/analitica/cliente';
import { cx, formatoNumero, ticksEje } from '@/lib/formato';
import { useAncho } from '@/lib/useAncho';
import TablaSerie from './TablaSerie';
import estilos from './GraficoColumnas.module.css';

export interface PuntoColumna {
  periodo: string;
  valor: number;
  /** Resalta el período en curso. */
  destacado?: boolean;
  /** Marca el valor como proyectado; se dibuja con textura de 45°. */
  estimado?: boolean;
}

interface Props {
  titulo: string;
  subtitulo?: string;
  nombreSerie: string;
  puntos: readonly PuntoColumna[];
  unidad: string;
  decimales?: number;
  color?: string;
  objetivo?: { valor: number; etiqueta: string };
  tono?: 'claro' | 'oscuro';
}

const MARGEN = { arriba: 34, derecha: 16, abajo: 34, izquierda: 52 };
const GROSOR_MAXIMO = 24;

/**
 * Gráfico de columnas de una sola serie, con línea de objetivo opcional.
 * Una sola serie no lleva caja de leyenda: el título ya dice qué se grafica.
 * El valor va sobre la tapa de cada columna, que es el patrón de etiqueta
 * directa para columnas.
 */
export default function GraficoColumnas({
  titulo,
  subtitulo,
  nombreSerie,
  puntos,
  unidad,
  decimales = 1,
  color = 'serie-1',
  objetivo,
  tono = 'claro',
}: Props) {
  const idBase = useId();
  const { ref, ancho } = useAncho<HTMLDivElement>(760);
  const [activo, setActivo] = useState<number | null>(null);
  const [verTabla, setVerTabla] = useState(false);

  const compacto = ancho < 560;
  const alto = compacto ? 260 : 320;
  const margenIzquierda = compacto ? 40 : MARGEN.izquierda;
  const margenDerecha = objetivo && !compacto ? 150 : MARGEN.derecha;

  const anchoInterno = Math.max(ancho - margenIzquierda - margenDerecha, 120);
  const altoInterno = alto - MARGEN.arriba - MARGEN.abajo;

  const maximo = Math.max(...puntos.map((p) => p.valor), objetivo?.valor ?? 0);
  const ticks = ticksEje(maximo, compacto ? 3 : 4);
  const techo = ticks[ticks.length - 1];

  const banda = anchoInterno / puntos.length;
  const grosor = Math.min(GROSOR_MAXIMO, banda * 0.52);
  const base = MARGEN.arriba + altoInterno;

  const centro = (i: number) => margenIzquierda + banda * i + banda / 2;
  const y = (valor: number) => MARGEN.arriba + altoInterno - (valor / techo) * altoInterno;

  /** Columna con tapa redondeada de 4 px y base recta sobre la línea cero. */
  const columna = (i: number, valor: number) => {
    const alturaBarra = Math.max(base - y(valor), 2);
    const x0 = centro(i) - grosor / 2;
    const y0 = base - alturaBarra;
    const r = Math.min(4, grosor / 2, alturaBarra);
    return `M${x0},${base} L${x0},${y0 + r} Q${x0},${y0} ${x0 + r},${y0} L${x0 + grosor - r},${y0} Q${
      x0 + grosor
    },${y0} ${x0 + grosor},${y0 + r} L${x0 + grosor},${base} Z`;
  };

  const resumen = `${nombreSerie}: de ${formatoNumero(puntos[0].valor, decimales)} en ${
    puntos[0].periodo
  } a ${formatoNumero(puntos[puntos.length - 1].valor, decimales)} en ${
    puntos[puntos.length - 1].periodo
  } ${unidad}`;

  return (
    <figure className={cx(estilos.figura, tono === 'oscuro' && estilos.oscuro)}>
      <figcaption className={estilos.encabezado}>
        <h3 className={estilos.titulo}>{titulo}</h3>
        {subtitulo ? <p className={estilos.subtitulo}>{subtitulo}</p> : null}
      </figcaption>

      <div className={estilos.lienzo} ref={ref}>
        <svg
          role="img"
          aria-label={`${titulo}. ${resumen}.${objetivo ? ` ${objetivo.etiqueta}.` : ''}`}
          width={ancho}
          height={alto}
          viewBox={`0 0 ${ancho} ${alto}`}
          className={estilos.svg}
          onPointerLeave={() => setActivo(null)}
        >
          <defs>
            {/* Textura a 45° para los valores proyectados: la trama distingue
                el estimado del dato cerrado sin depender del color. */}
            <pattern
              id={`${idBase}-trama`}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill={`var(--${color})`} fillOpacity="0.24" />
              <line x1="0" y1="0" x2="0" y2="6" stroke={`var(--${color})`} strokeWidth="3" />
            </pattern>
          </defs>

          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={margenIzquierda}
                x2={margenIzquierda + anchoInterno}
                y1={y(tick)}
                y2={y(tick)}
                className={estilos.grilla}
              />
              <text x={margenIzquierda - 10} y={y(tick) + 4} className={cx(estilos.tickY, 'tabular')}>
                {formatoNumero(tick, tick % 1 === 0 ? 0 : decimales)}
              </text>
            </g>
          ))}

          {puntos.map((punto, i) => (
            <g
              key={punto.periodo}
              onPointerEnter={() => setActivo(i)}
              className={estilos.grupoColumna}
            >
              {/* Área de hover más grande que la marca */}
              <rect
                x={margenIzquierda + banda * i}
                y={MARGEN.arriba}
                width={banda}
                height={altoInterno}
                fill="transparent"
              />
              <path
                d={columna(i, punto.valor)}
                fill={punto.estimado ? `url(#${idBase}-trama)` : `var(--${color})`}
                fillOpacity={activo === null || activo === i ? 1 : 0.55}
                className={estilos.columna}
              />
              <text x={centro(i)} y={y(punto.valor) - 12} className={cx(estilos.valor, 'tabular')}>
                {formatoNumero(punto.valor, decimales)}
              </text>
              <text x={centro(i)} y={alto - 10} className={estilos.tickX}>
                {punto.periodo}
              </text>
            </g>
          ))}

          {objetivo ? (
            <g>
              <line
                x1={margenIzquierda}
                x2={margenIzquierda + anchoInterno + (compacto ? 0 : 12)}
                y1={y(objetivo.valor)}
                y2={y(objetivo.valor)}
                className={estilos.objetivo}
              />
              {!compacto ? (
                <text
                  x={margenIzquierda + anchoInterno + 20}
                  y={y(objetivo.valor) + 4}
                  className={estilos.etiquetaObjetivo}
                >
                  {objetivo.etiqueta}
                </text>
              ) : null}
            </g>
          ) : null}
        </svg>

        {activo !== null ? (
          <div
            className={estilos.tooltip}
            style={{
              left: `${(centro(activo) / Math.max(ancho, 1)) * 100}%`,
              transform: `translateX(${
                centro(activo) / ancho > 0.7 ? '-100%' : centro(activo) / ancho < 0.2 ? '0' : '-50%'
              })`,
            }}
            aria-hidden="true"
          >
            <p className={estilos.tooltipPeriodo}>{puntos[activo].periodo}</p>
            <p className={cx(estilos.tooltipValor, 'tabular')}>
              {formatoNumero(puntos[activo].valor, decimales)}{' '}
              <span className={estilos.tooltipUnidad}>{unidad}</span>
            </p>
            {puntos[activo].estimado ? <p className={estilos.tooltipNota}>Valor proyectado</p> : null}
          </div>
        ) : null}
      </div>

      {objetivo && compacto ? (
        <p className={estilos.objetivoMobile}>{objetivo.etiqueta}</p>
      ) : null}

      <div className={estilos.piePie}>
        <button
          type="button"
          className={estilos.alternar}
          onClick={() => {
            setVerTabla((v) => !v);
            if (!verTabla) capturar(EVENTOS.GRAFICO_TABLA_ABIERTA, { grafico: titulo, tipo: 'columnas' });
          }}
          aria-expanded={verTabla}
          aria-controls={`${idBase}-tabla`}
        >
          {verTabla ? 'Ocultar tabla de datos' : 'Ver tabla de datos'}
        </button>
      </div>

      <div id={`${idBase}-tabla`} hidden={!verTabla}>
        <TablaSerie
          tono={tono}
          caption={`${titulo}. Valores en ${unidad}.`}
          columnas={['Período', `${nombreSerie} (${unidad})`]}
          filas={puntos.map((p) => [
            p.estimado ? `${p.periodo} (proyectado)` : p.periodo,
            formatoNumero(p.valor, decimales),
          ])}
        />
      </div>
    </figure>
  );
}
