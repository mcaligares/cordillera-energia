import Encabezado from '@/components/ui/Encabezado';
import GraficoColumnas from '@/components/ui/GraficoColumnas';
import Seccion from '@/components/ui/Seccion';
import { emisiones } from '@/data/operaciones';
import estilos from './Emisiones.module.css';

export const SECTION_ID = 'emisiones' as const;

/**
 * Intensidad de emisiones como métrica operativa.
 * ISS-09: el dato solo existía dentro del Reporte de Sustentabilidad, un PDF
 * de 118 páginas con profundidad de lectura media en la página 4.
 */
export default function Emisiones() {
  return (
    <Seccion id={SECTION_ID} tono="hundido" etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Emisiones"
        titulo={emisiones.titulo}
        bajada={emisiones.bajada}
      />

      <div className={estilos.cuerpo}>
        <div className={estilos.grafico}>
          <GraficoColumnas
            titulo="Intensidad de emisiones, alcance 1 + 2"
            subtitulo="Por barril equivalente producido. La columna con trama es proyección."
            nombreSerie={emisiones.serie.nombreSerie}
            puntos={emisiones.serie.puntos}
            unidad={emisiones.serie.unidad}
            decimales={1}
            color="serie-3"
            objetivo={emisiones.serie.objetivo}
          />
        </div>

        <ul className={estilos.palancas}>
          {emisiones.palancas.map((palanca, i) => (
            <li key={palanca.titulo} className={estilos.palanca}>
              <span className={estilos.numero} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={estilos.titulo}>{palanca.titulo}</h3>
              <p className={estilos.texto}>{palanca.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
