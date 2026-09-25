import Image from 'next/image';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { digitalizacion } from '@/data/operaciones';
import estilos from './Digitalizacion.module.css';
import sala from '@/assets/marca/digitalizacion.png';

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

      {/* El COI es la pieza que más le habla al perfil técnico y hasta acá
          era solo texto. La foto le pone cara antes de enumerar el stack. */}
      <figure className={estilos.figura}>
        <Image
          src={sala}
          alt="Sala del Centro de Operaciones Integradas en Neuquén: pantallas con telemetría de pozos, un modelo de subsuelo y trayectorias de perforación, con el equipo de ingeniería de turno."
          sizes="(min-width: 1280px) 1216px, 100vw"
          placeholder="blur"
          quality={78}
          className={estilos.imagen}
        />
        <figcaption className={estilos.epigrafe}>
          Centro de Operaciones Integradas · Neuquén
        </figcaption>
      </figure>

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
