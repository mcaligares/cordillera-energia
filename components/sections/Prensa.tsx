import Boton from '@/components/ui/Boton';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { novedadesPara } from '@/data/prensa';
import type { Perfil } from '@/config/sections.config';
import estilos from './Prensa.module.css';

export const SECTION_ID = 'prensa' as const;

interface Props {
  /** La variante filtra las novedades a las que le hablan a su audiencia. */
  perfil?: Perfil;
}

const BAJADA: Record<Perfil, string> = {
  general: 'Hechos relevantes, novedades operativas y comunicados de prensa.',
  inversor:
    'Hechos relevantes publicados simultáneamente en la Comisión Nacional de Valores y en la SEC.',
  tech: 'Novedades de perforación, completación y tecnología de operación.',
};

export default function Prensa({ perfil = 'general' }: Props) {
  const clave = perfil === 'general' ? 'general' : perfil;
  const items = novedadesPara(clave, 3);

  return (
    <Seccion id={SECTION_ID} tono="hundido" etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Sala de prensa"
        titulo="Últimas novedades"
        bajada={BAJADA[perfil]}
        acciones={
          <Boton href="/prensa" variante="secundario">
            Ver todas
          </Boton>
        }
      />

      <ul className={estilos.grilla}>
        {items.map((novedad) => (
          <li key={novedad.id} className={estilos.item}>
            <article className={estilos.articulo}>
              <p className={estilos.meta}>
                <span className={estilos.categoria}>{novedad.categoria}</span>
                <time dateTime={novedad.fechaISO}>{novedad.fecha}</time>
              </p>
              <h3 className={estilos.titulo}>
                <a href={novedad.href} className={estilos.enlace}>
                  {novedad.titulo}
                </a>
              </h3>
              <p className={estilos.resumen}>{novedad.resumen}</p>
            </article>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
