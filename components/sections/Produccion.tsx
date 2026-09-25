import Encabezado from '@/components/ui/Encabezado';
import GraficoLineas from '@/components/ui/GraficoLineas';
import Seccion from '@/components/ui/Seccion';
import { guidance, serieProduccion } from '@/data/inversores';
import { formatoNumero } from '@/lib/formato';
import estilos from './Produccion.module.css';

export const SECTION_ID = 'produccion' as const;

const periodos = serieProduccion.puntos.map((p) => p.periodo);
const primero = serieProduccion.puntos[0];
const ultimo = serieProduccion.puntos[serieProduccion.puntos.length - 1];
const crecimiento = Math.round(
  ((ultimo.petroleo + ultimo.gas) / (primero.petroleo + primero.gas) - 1) * 100,
);

/**
 * Serie de producción por fluido.
 * ISS-05: la producción vivía en prosa y no había ninguna serie en el sitio.
 * ISS-11: el gráfico es SVG propio; no se carga ninguna librería de charts.
 */
export default function Produccion() {
  return (
    <Seccion id={SECTION_ID} tono="hundido" etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Producción"
        titulo="Cinco trimestres de crecimiento consecutivo"
        bajada={`La producción total creció ${crecimiento} % desde el ${primero.periodo}. El petróleo explica el 62 % del mix del último trimestre.`}
      />

      <div className={estilos.cuerpo}>
        <div className={estilos.grafico}>
          <GraficoLineas
            titulo={serieProduccion.titulo}
            subtitulo={serieProduccion.subtitulo}
            periodos={periodos}
            unidad={serieProduccion.unidad}
            series={[
              {
                id: 'petroleo',
                nombre: 'Petróleo',
                color: 'serie-1',
                valores: serieProduccion.puntos.map((p) => p.petroleo),
              },
              {
                id: 'gas',
                nombre: 'Gas natural',
                color: 'serie-2',
                valores: serieProduccion.puntos.map((p) => p.gas),
              },
            ]}
          />
        </div>

        <aside className={estilos.lateral}>
          <div className={estilos.bloque}>
            <p className={estilos.etiqueta}>Total {ultimo.periodo}</p>
            <p className={`dato ${estilos.valor}`}>
              {formatoNumero(ultimo.petroleo + ultimo.gas)}
              <span>boe/d</span>
            </p>
          </div>

          <div className={estilos.bloque}>
            <h3 className={estilos.tituloBloque}>{guidance.titulo}</h3>
            <ul className={estilos.lista}>
              {guidance.items.map((item) => (
                <li key={item.etiqueta}>
                  <span className={estilos.listaEtiqueta}>{item.etiqueta}</span>
                  <span className={`tabular ${estilos.listaValor}`}>{item.valor}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Seccion>
  );
}
