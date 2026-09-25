import estilos from './Sparkline.module.css';

interface Props {
  valores: readonly number[];
  /** Descripción para lectores de pantalla; el dato exacto va al lado en texto. */
  descripcion: string;
  ancho?: number;
  alto?: number;
  color?: string;
  /** Color de la superficie sobre la que se apoya, para el anillo del punto. */
  superficie?: string;
}

/**
 * Micro-serie de apoyo a una cifra. Sin ejes, sin grilla y sin tooltip: es un
 * indicador de forma, no un gráfico para leer valores. El valor exacto siempre
 * está en texto al lado (Server Component: no necesita interactividad).
 */
export default function Sparkline({
  valores,
  descripcion,
  ancho = 132,
  alto = 40,
  color = 'var(--c-verde-300)',
  superficie = 'var(--sup-oscura)',
}: Props) {
  const minimo = Math.min(...valores);
  const maximo = Math.max(...valores);
  const rango = maximo - minimo || 1;
  const relleno = 5;

  const x = (i: number) => (i / (valores.length - 1)) * (ancho - relleno * 2) + relleno;
  const y = (v: number) => alto - relleno - ((v - minimo) / rango) * (alto - relleno * 2);

  const d = valores.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const ultimo = valores.length - 1;

  return (
    <svg
      className={estilos.sparkline}
      viewBox={`0 0 ${ancho} ${alto}`}
      width={ancho}
      height={alto}
      role="img"
      aria-label={descripcion}
      focusable="false"
    >
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(ultimo)} cy={y(valores[ultimo])} r="4" fill={color} stroke={superficie} strokeWidth="2" />
    </svg>
  );
}
