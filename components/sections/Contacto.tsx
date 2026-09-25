import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { contacto } from '@/data/empresa';
import type { Perfil } from '@/config/sections.config';
import estilos from './Contacto.module.css';

export const SECTION_ID = 'contacto' as const;

interface Props {
  perfil?: Perfil;
}

/** El canal que cada perfil busca primero se muestra destacado. */
const PRIORIDAD: Record<Perfil, string> = {
  general: 'general',
  inversor: 'general',
  tech: 'tecnica',
};

/**
 * Canales de contacto.
 * ISS-07: el sitio anterior tenía un único formulario de nueve campos con un
 * <select> de once motivos y 3 % de completitud. Acá cada consulta tiene su
 * dirección, visible y en texto.
 */
export default function Contacto({ perfil = 'general' }: Props) {
  const prioritario = PRIORIDAD[perfil];
  const canales = [...contacto.canales].sort((a, b) =>
    a.id === prioritario ? -1 : b.id === prioritario ? 1 : 0,
  );

  return (
    <Seccion id={SECTION_ID} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Contacto"
        titulo="Escribinos al canal que corresponde"
        bajada="Cada consulta llega directo al equipo que la responde. No hay formulario intermedio."
      />

      <div className={estilos.cuerpo}>
        <ul className={estilos.canales}>
          {canales.map((canal, i) => (
            <li
              key={canal.id}
              className={i === 0 ? `${estilos.canal} ${estilos.destacado}` : estilos.canal}
            >
              <h3 className={estilos.titulo}>{canal.titulo}</h3>
              <a href={`mailto:${canal.email}`} className={estilos.email}>
                {canal.email}
              </a>
              <p className={estilos.detalle}>{canal.detalle}</p>
            </li>
          ))}
        </ul>

        <div className={estilos.oficinas}>
          <h3 className={estilos.tituloOficinas}>Oficinas</h3>
          <ul>
            {contacto.oficinas.map((oficina) => (
              <li key={oficina.ciudad} className={estilos.oficina}>
                <p className={estilos.ciudad}>{oficina.ciudad}</p>
                <address className={estilos.direccion}>{oficina.direccion}</address>
                <p className={estilos.detalleOficina}>{oficina.detalle}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Seccion>
  );
}
