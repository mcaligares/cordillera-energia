'use client';

import { useId, useState } from 'react';
import { EVENTOS } from '@/lib/analitica/eventos';
import { capturar } from '@/lib/analitica/cliente';
import { cx, formatoNumero, ticksEje } from '@/lib/formato';
import { useAncho } from '@/lib/useAncho';
import TablaSerie from './TablaSerie';
import estilos from './GraficoLineas.module.css';

export interface SerieLinea {
  id: string;
  nombre: string;
  valores: number[];
  /** Variable CSS del color de la serie, ya validada contra la superficie. */
  color: string;
}

interface Props {
  titulo: string;
  subtitulo?: string;
  periodos: string[];
  series: SerieLinea[];
  unidad: string;
  decimales?: number;
  tono?: 'claro' | 'oscuro';
}

const MARGEN = { arriba: 20, derecha: 16, abajo: 34, izquierda: 58 };
const ETIQUETA_FINAL = 92;

/**
 * Gráfico de líneas con área, para series temporales.
 * ISS-11: reemplaza Chart.js + moment (180 KB) por SVG propio.
 * Las marcas siguen la especificación del sistema: línea de 2 px, marcador
 * final de 8 px con anillo del color de la superficie, área al 10 %.
 */
export default function GraficoLineas({
  titulo,
  subtitulo,
  periodos,
  series,
  unidad,
  decimales = 0,
  tono = 'claro',
}: Props) {
  const idBase = useId();
  const { ref, ancho } = useAncho<HTMLDivElement>(760);
  const [activo, setActivo] = useState<number | null>(null);
  const [verTabla, setVerTabla] = useState(false);

  const compacto = ancho < 640;
  const alto = compacto ? 260 : 340;
  const margenDerecha = compacto ? MARGEN.derecha : MARGEN.derecha + ETIQUETA_FINAL;
  const margenIzquierda = compacto ? 44 : MARGEN.izquierda;

  const anchoInterno = Math.max(ancho - margenIzquierda - margenDerecha, 120);
  const altoInterno = alto - MARGEN.arriba - MARGEN.abajo;

  const maximo = Math.max(...series.flatMap((s) => s.valores));
  const ticks = ticksEje(maximo, compacto ? 3 : 4);
  const techo = ticks[ticks.length - 1];

  const x = (i: number) =>
    margenIzquierda + (periodos.length === 1 ? anchoInterno / 2 : (anchoInterno * i) / (periodos.length - 1));
  const y = (valor: number) => MARGEN.arriba + altoInterno - (valor / techo) * altoInterno;

  const linea = (valores: number[]) => valores.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
  const area = (valores: number[]) =>
    `${linea(valores)} L${x(valores.length - 1)},${MARGEN.arriba + altoInterno} L${x(0)},${
      MARGEN.arriba + altoInterno
    } Z`;

  const resumen = series
    .map((s) => `${s.nombre}: de ${formatoNumero(s.valores[0], decimales)} en ${periodos[0]} a ${formatoNumero(
      s.valores[s.valores.length - 1],
      decimales,
    )} en ${periodos[periodos.length - 1]} ${unidad}`)
    .join('. ');

  const alMover = (evento: React.PointerEvent<SVGSVGElement>) => {
    const caja = evento.currentTarget.getBoundingClientRect();
    const px = evento.clientX - caja.left;
    const paso = anchoInterno / Math.max(periodos.length - 1, 1);
    const indice = Math.round((px - margenIzquierda) / paso);
    setActivo(Math.min(Math.max(indice, 0), periodos.length - 1));
  };

  const posicionTooltip = activo === null ? 0 : (x(activo) / Math.max(ancho, 1)) * 100;

  return (
    <figure className={cx(estilos.figura, tono === 'oscuro' && estilos.oscuro)}>
      <figcaption className={estilos.encabezado}>
        <div>
          <h3 className={estilos.titulo}>{titulo}</h3>
          {subtitulo ? <p className={estilos.subtitulo}>{subtitulo}</p> : null}
        </div>
        {series.length > 1 ? (
          <ul className={estilos.leyenda}>
            {series.map((serie) => (
              <li key={serie.id} className={estilos.itemLeyenda}>
                <span
                  className={estilos.muestra}
                  style={{ backgroundColor: `var(--${serie.color})` }}
                  aria-hidden="true"
                />
                {serie.nombre}
              </li>
            ))}
          </ul>
        ) : null}
      </figcaption>

      <div className={estilos.lienzo} ref={ref}>
        <svg
          role="img"
          aria-label={`${titulo}. ${resumen}.`}
          width={ancho}
          height={alto}
          viewBox={`0 0 ${ancho} ${alto}`}
          className={estilos.svg}
          onPointerMove={alMover}
          onPointerLeave={() => setActivo(null)}
        >
          {/* Grilla horizontal: 1 px, sólida, un paso por encima de la superficie */}
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
                {formatoNumero(tick, decimales)}
              </text>
            </g>
          ))}

          {periodos.map((periodo, i) => (
            <text key={periodo} x={x(i)} y={alto - 10} className={estilos.tickX}>
              {compacto && i % 2 === 1 && periodos.length > 4 ? '' : periodo}
            </text>
          ))}

          {series.map((serie) => (
            <g key={serie.id}>
              {/* El wash solo se dibuja con una serie: con dos superpuestas
                  se lee como area apilada y miente sobre el total. */}
              {series.length === 1 ? (
                <path d={area(serie.valores)} fill={`var(--${serie.color})`} fillOpacity="0.1" />
              ) : null}
              <path
                d={linea(serie.valores)}
                fill="none"
                stroke={`var(--${serie.color})`}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Marcador final: 8 px con anillo de 2 px del color de la superficie */}
              <circle
                cx={x(serie.valores.length - 1)}
                cy={y(serie.valores[serie.valores.length - 1])}
                r="4"
                fill={`var(--${serie.color})`}
                stroke={tono === 'oscuro' ? 'var(--grafico-superficie-inv)' : 'var(--grafico-superficie)'}
                strokeWidth="2"
              />
              {!compacto ? (
                <text
                  x={x(serie.valores.length - 1) + 14}
                  y={y(serie.valores[serie.valores.length - 1]) + 4}
                  className={estilos.etiquetaFinal}
                >
                  {serie.nombre}
                </text>
              ) : null}
            </g>
          ))}

          {activo !== null ? (
            <g aria-hidden="true">
              <line
                x1={x(activo)}
                x2={x(activo)}
                y1={MARGEN.arriba}
                y2={MARGEN.arriba + altoInterno}
                className={estilos.cursor}
              />
              {series.map((serie) => (
                <circle
                  key={`${idBase}-${serie.id}`}
                  cx={x(activo)}
                  cy={y(serie.valores[activo])}
                  r="4.5"
                  fill={`var(--${serie.color})`}
                  stroke={tono === 'oscuro' ? 'var(--grafico-superficie-inv)' : 'var(--grafico-superficie)'}
                  strokeWidth="2"
                />
              ))}
            </g>
          ) : null}
        </svg>

        {activo !== null ? (
          <div
            className={estilos.tooltip}
            style={{
              left: `${posicionTooltip}%`,
              transform: `translateX(${posicionTooltip > 66 ? '-100%' : posicionTooltip < 20 ? '0' : '-50%'})`,
            }}
            aria-hidden="true"
          >
            <p className={estilos.tooltipPeriodo}>{periodos[activo]}</p>
            <ul>
              {series.map((serie) => (
                <li key={serie.id} className={estilos.tooltipFila}>
                  <span
                    className={estilos.muestra}
                    style={{ backgroundColor: `var(--${serie.color})` }}
                  />
                  <span className={estilos.tooltipNombre}>{serie.nombre}</span>
                  <span className={cx(estilos.tooltipValor, 'tabular')}>
                    {formatoNumero(serie.valores[activo], decimales)}
                  </span>
                </li>
              ))}
            </ul>
            <p className={estilos.tooltipUnidad}>{unidad}</p>
          </div>
        ) : null}
      </div>

      <div className={estilos.piePie}>
        <button
          type="button"
          className={estilos.alternar}
          onClick={() => {
            setVerTabla((v) => !v);
            if (!verTabla) capturar(EVENTOS.GRAFICO_TABLA_ABIERTA, { grafico: titulo, tipo: 'lineas' });
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
          columnas={['Período', ...series.map((s) => `${s.nombre} (${unidad})`)]}
          filas={periodos.map((periodo, i) => [
            periodo,
            ...series.map((s) => formatoNumero(s.valores[i], decimales)),
          ])}
        />
      </div>
    </figure>
  );
}
