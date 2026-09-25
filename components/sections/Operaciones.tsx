import Image from 'next/image';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { bloques, operaciones } from '@/data/operaciones';
import estilos from './Operaciones.module.css';
import locacion from '@/assets/marca/operaciones.png';

export const SECTION_ID = 'operaciones' as const;

/**
 * Bloques y actividad.
 * ISS-08: reemplaza 1.900 palabras de relato institucional por la tabla de
 * activos y cuatro cifras de actividad.
 */
export default function Operaciones() {
  return (
    <Seccion id={SECTION_ID} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Operaciones"
        titulo={operaciones.titulo}
        bajada={operaciones.bajada}
      />

      {/* "625 km²" no significa nada como número suelto: la vista aérea le
          da la escala antes de que aparezca la tabla de bloques. */}
      <figure className={estilos.figura}>
        <Image
          src={locacion}
          alt="Vista aérea de una locación de Cordillera Energía en la estepa neuquina al atardecer: el pad de grava con el equipo de perforación, las instalaciones auxiliares y el camino de acceso, con la cordillera nevada en el horizonte."
          sizes="(min-width: 1280px) 1216px, 100vw"
          placeholder="blur"
          quality={78}
          className={estilos.imagen}
        />
        <figcaption className={estilos.epigrafe}>
          Loma Chelforó · desarrollo pleno
        </figcaption>
      </figure>

      <dl className={estilos.resumen}>
        {operaciones.resumen.map((item) => (
          <div key={item.etiqueta} className={estilos.resumenItem}>
            <dt>{item.etiqueta}</dt>
            <dd className="dato">
              {item.valor} <span>{item.unidad}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className={estilos.envoltorioTabla}>
        <table className={estilos.tabla}>
          <caption className={estilos.caption}>
            Bloques en la ventana de petróleo de Vaca Muerta, provincia de Neuquén.
          </caption>
          <thead>
            <tr>
              <th scope="col">Bloque</th>
              <th scope="col">Rol</th>
              <th scope="col" className={estilos.numerica}>
                Participación
              </th>
              <th scope="col" className={estilos.numerica}>
                Superficie
              </th>
              <th scope="col" className={estilos.numerica}>
                Pozos activos
              </th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {bloques.map((bloque) => (
              <tr key={bloque.id}>
                <th scope="row">{bloque.nombre}</th>
                <td>
                  <span
                    className={
                      bloque.rol === 'Operado'
                        ? `${estilos.rol} ${estilos.operado}`
                        : estilos.rol
                    }
                  >
                    {bloque.rol}
                  </span>
                </td>
                <td className={estilos.numerica}>{bloque.participacion}</td>
                <td className={estilos.numerica}>{bloque.superficie}</td>
                <td className={estilos.numerica}>{bloque.pozosActivos}</td>
                <td className={estilos.estado}>{bloque.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Seccion>
  );
}
