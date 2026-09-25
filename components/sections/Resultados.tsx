import Boton from '@/components/ui/Boton';
import Cifra from '@/components/ui/Cifra';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { ultimoPeriodo } from '@/data/empresa';
import { EVENTOS } from '@/lib/analitica/eventos';
import { documentoDestacado, guidance, resultados } from '@/data/inversores';
import estilos from './Resultados.module.css';

export const SECTION_ID = 'resultados' as const;

/**
 * Resultados del trimestre.
 * ISS-05: seis cifras y el guidance en una pantalla, en lugar de un párrafo
 * con números embebidos. Cada delta nombra el período de comparación.
 */
export default function Resultados() {
  return (
    <Seccion id={SECTION_ID} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow={`Resultados ${ultimoPeriodo.trimestre}`}
        titulo="Las cifras del trimestre"
        bajada={`Cerrado el ${ultimoPeriodo.cierre} y publicado el ${ultimoPeriodo.publicado}. Cifras en dólares, bajo NIIF.`}
        acciones={
          <Boton
            href={documentoDestacado.href}
            variante="secundario"
            meta={`${documentoDestacado.formato} · ${documentoDestacado.peso}`}
            contexto={`en formato ${documentoDestacado.formato}, ${documentoDestacado.peso}`}
            evento={EVENTOS.DOCUMENTO_DESCARGA}
            eventoProps={{
              documento_id: documentoDestacado.id,
              periodo: documentoDestacado.periodo,
              formato: documentoDestacado.formato,
              origen: 'resultados',
            }}
          >
            Presentación {documentoDestacado.periodo}
          </Boton>
        }
      />

      <div className={estilos.grilla}>
        {resultados.map((dato) => (
          <Cifra key={dato.id} dato={dato} tamano="sm" className={estilos.celda} />
        ))}
      </div>

      <div className={estilos.guidance}>
        <h3 className={estilos.tituloGuidance}>{guidance.titulo}</h3>
        <table className={estilos.tabla}>
          <caption className="solo-lectores">
            Guidance 2026: rango proyectado y estado de cada métrica.
          </caption>
          <thead>
            <tr>
              <th scope="col">Métrica</th>
              <th scope="col">Rango 2026</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {guidance.items.map((item) => (
              <tr key={item.etiqueta}>
                <th scope="row">{item.etiqueta}</th>
                <td className="tabular">{item.valor}</td>
                <td>
                  <span className={estilos.estado}>{item.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Seccion>
  );
}
