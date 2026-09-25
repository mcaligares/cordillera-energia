import Boton from '@/components/ui/Boton';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { EVENTOS } from '@/lib/analitica/eventos';
import { eventos } from '@/data/inversores';
import estilos from './CalendarioIR.module.css';

export const SECTION_ID = 'calendario-ir' as const;

const MES_CORTO = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

function partes(fechaISO: string) {
  const [anio, mes, dia] = fechaISO.split('-');
  return { dia, mes: MES_CORTO[Number(mes) - 1], anio };
}

/**
 * Calendario de eventos de IR.
 * ISS-06: reemplaza el PDF anual que se subía en enero y no se volvía a tocar.
 * Cada evento es HTML con su <time datetime>, indexable y siempre vigente.
 */
export default function CalendarioIR() {
  return (
    <Seccion id={SECTION_ID} tono="hundido" etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Calendario"
        titulo="Próximos eventos"
        bajada="Fechas de publicación de resultados, conferencias y el Investor Day. Se actualiza en el momento en que se confirma cada fecha."
        acciones={
          <Boton
            href="/inversores/calendario.ics"
            variante="secundario"
            meta="Archivo .ics"
            evento={EVENTOS.CTA_CLICK}
            eventoProps={{ cta_id: 'calendario-ics' }}
          >
            Agregar al calendario
          </Boton>
        }
      />

      <ol className={estilos.lista}>
        {eventos.map((evento) => {
          const { dia, mes, anio } = partes(evento.fechaISO);
          return (
            <li key={evento.id} className={estilos.evento}>
              <time className={estilos.fecha} dateTime={evento.fechaISO}>
                <span className={estilos.dia}>{dia}</span>
                <span className={estilos.mes}>{mes}</span>
                <span className={estilos.anio}>{anio}</span>
              </time>

              <div className={estilos.detalle}>
                <p className={estilos.tipo}>{evento.tipo}</p>
                <h3 className={estilos.titulo}>{evento.titulo}</h3>
                <p className={estilos.texto}>{evento.detalle}</p>
                {evento.href ? (
                  <Boton
                    href={evento.href}
                    variante="fantasma"
                    evento={EVENTOS.EVENTO_CALENDARIO_CLICK}
                    eventoProps={{ evento_id: evento.id, tipo: evento.tipo }}
                  >
                    {evento.hrefTexto}
                    <span className="solo-lectores"> para {evento.titulo}</span>
                  </Boton>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Seccion>
  );
}
