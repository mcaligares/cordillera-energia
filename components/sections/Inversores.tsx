import Boton from '@/components/ui/Boton';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { EVENTOS } from '@/lib/analitica/eventos';
import { contactoIR, documentos, ultimoPeriodoDocumentos } from '@/data/inversores';
import estilos from './Inversores.module.css';

export const SECTION_ID = 'inversores' as const;

/**
 * Centro de documentos de IR.
 *
 * ISS-04: en el sitio anterior había cuatro links con el texto "Presentación
 * de resultados" y ninguno decía a qué trimestre correspondía, qué formato
 * era ni cuánto pesaba. Acá cada documento declara período, fecha, formato y
 * peso, y el nombre accesible del enlace los incluye.
 */
export default function Inversores() {
  return (
    <Seccion id={SECTION_ID} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Inversores"
        titulo="Documentos y reportes"
        bajada="Todo lo que publicamos, con su fecha y su peso a la vista. Los documentos del trimestre en curso aparecen primero."
        acciones={
          <Boton
            href={contactoIR.suscripcion.href}
            variante="secundario"
            evento={EVENTOS.CTA_CLICK}
            eventoProps={{ cta_id: 'alertas-ir' }}
          >
            Suscribirse a las alertas de IR
          </Boton>
        }
      />

      <ul className={estilos.lista}>
        {documentos.map((documento) => (
          <li key={documento.id}>
            <a
              href={documento.href}
              className={documento.destacado ? `${estilos.fila} ${estilos.destacada}` : estilos.fila}
              data-evento={EVENTOS.DOCUMENTO_DESCARGA}
              data-evento-props={JSON.stringify({
                documento_id: documento.id,
                periodo: documento.periodo,
                formato: documento.formato,
                origen: 'listado',
              })}
            >
              <span className={estilos.periodo}>{documento.periodo}</span>

              <span className={estilos.textos}>
                <span className={estilos.titulo}>{documento.titulo}</span>
                <span className={estilos.meta}>
                  <time dateTime={documento.fechaISO}>{documento.fecha}</time>
                  <span aria-hidden="true">·</span>
                  <span>{documento.formato}</span>
                  <span aria-hidden="true">·</span>
                  <span>{documento.peso}</span>
                </span>
              </span>

              {documento.destacado ? (
                <span className={estilos.insignia}>Último trimestre</span>
              ) : null}

              <span className={estilos.flecha} aria-hidden="true">
                ↓
              </span>
              <span className="solo-lectores">
                Descargar {documento.titulo} de {documento.periodo}, {documento.formato},{' '}
                {documento.peso}, publicado el {documento.fecha}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className={estilos.pie}>
        Última actualización de esta sección: {ultimoPeriodoDocumentos}. Los hechos relevantes se
        publican simultáneamente en la Comisión Nacional de Valores y en la SEC.
      </p>
    </Seccion>
  );
}
