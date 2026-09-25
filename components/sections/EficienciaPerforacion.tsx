import Cifra from '@/components/ui/Cifra';
import Encabezado from '@/components/ui/Encabezado';
import GraficoColumnas from '@/components/ui/GraficoColumnas';
import Seccion from '@/components/ui/Seccion';
import { eficiencia } from '@/data/operaciones';
import estilos from './EficienciaPerforacion.module.css';

export const SECTION_ID = 'eficiencia-perforacion' as const;

/**
 * Curva de días por pozo y las métricas que la explican.
 * ISS-08: la sección "Operaciones" del sitio anterior tenía 1.900 palabras y
 * ninguna métrica. ISS-11: el gráfico es SVG propio, sin Chart.js.
 */
export default function EficienciaPerforacion() {
  return (
    <Seccion id={SECTION_ID} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Eficiencia de perforación"
        titulo={eficiencia.titulo}
        bajada={eficiencia.bajada}
      />

      <div className={estilos.cuerpo}>
        <div className={estilos.grafico}>
          <GraficoColumnas
            titulo="Días por pozo, promedio anual"
            subtitulo="Pozos horizontales, de spud a rig release."
            nombreSerie={eficiencia.serie.nombreSerie}
            puntos={eficiencia.serie.puntos}
            unidad={eficiencia.serie.unidad}
            decimales={1}
            color="serie-1"
            objetivo={eficiencia.serie.objetivo}
          />
        </div>

        <aside className={estilos.record}>
          <p className={estilos.recordEtiqueta}>{eficiencia.record.etiqueta}</p>
          <p className={`dato ${estilos.recordValor}`}>
            {eficiencia.record.valor}
            <span>{eficiencia.record.unidad}</span>
          </p>
          <p className={estilos.recordDetalle}>{eficiencia.record.detalle}</p>
        </aside>
      </div>

      <div className={estilos.metricas}>
        {eficiencia.metricas.map((metrica) => (
          <Cifra key={metrica.id} dato={metrica} tamano="sm" />
        ))}
      </div>
    </Seccion>
  );
}
