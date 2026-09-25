import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { digitalizacion } from '@/data/operaciones';
import estilos from './Digitalizacion.module.css';

export const SECTION_ID = 'digitalizacion' as const;

/**
 * Stack de operación digital. Cada pieza va con la métrica que mueve al lado;
 * sin la métrica, la pieza no entra en esta sección.
 */
export default function Digitalizacion() {
  return (
    <Seccion id={SECTION_ID} tono="oscuro" etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Tecnología"
        titulo={digitalizacion.titulo}
        bajada={digitalizacion.bajada}
      />

      <ul className={estilos.grilla}>
        {digitalizacion.capacidades.map((capacidad) => (
          <li key={capacidad.id} className={estilos.tarjeta}>
            <div className={estilos.metrica}>
              <span className={`dato ${estilos.metricaValor}`}>{capacidad.metrica.valor}</span>
              <span className={estilos.metricaEtiqueta}>{capacidad.metrica.etiqueta}</span>
            </div>
            <h3 className={estilos.titulo}>{capacidad.titulo}</h3>
            <p className={estilos.texto}>{capacidad.texto}</p>
          </li>
        ))}
      </ul>

      <dl className={estilos.stack}>
        {digitalizacion.stack.map((item) => (
          <div key={item.etiqueta} className={estilos.stackItem}>
            <dt>{item.etiqueta}</dt>
            <dd>{item.valor}</dd>
          </div>
        ))}
      </dl>
    </Seccion>
  );
}
