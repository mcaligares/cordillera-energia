import Image from 'next/image';
import Boton from '@/components/ui/Boton';
import Seccion from '@/components/ui/Seccion';
import { EVENTOS } from '@/lib/analitica/eventos';
import { digitalizacion, eficiencia } from '@/data/operaciones';
import estilos from './HeroTech.module.css';
import arte from '@/assets/marca/subsuelo-lateral.png';

export const SECTION_ID = 'hero-tech' as const;

const serie = eficiencia.serie.puntos;
const actual = serie[serie.length - 1];
const inicial = serie[0];
const mejora = Math.round((1 - actual.valor / inicial.valor) * 100);

const apoyo = [
  eficiencia.metricas.find((m) => m.id === 'metros-dia')!,
  eficiencia.metricas.find((m) => m.id === 'etapas-dia')!,
  {
    id: 'automatizacion',
    valor: '78',
    unidad: '%',
    etiqueta: 'Pozos con perforación automatizada',
    detalle: '1S2026',
    delta: null,
  },
];

/**
 * Hero del perfil técnico.
 *
 * Arriba de todo va días por pozo: es la consulta #1 del buscador interno
 * (1.204 búsquedas en seis meses) y en el sitio anterior devolvía cero
 * resultados (ISS-08). Sin relato institucional: la cifra, la comparación y
 * el acceso a cómo se consiguió.
 */
export default function HeroTech() {
  return (
    <Seccion id={SECTION_ID} tono="oscuro" contenedor={false} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <div className={estilos.fondo}>
        <Image
          src={arte}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          quality={78}
          className={estilos.imagen}
        />
        <div className={estilos.velo} aria-hidden="true" />
      </div>

      <div className={`contenedor ${estilos.contenido}`}>
        <p className={estilos.kicker}>Operaciones · {actual.periodo}</p>

        <h1 id={`${SECTION_ID}-titulo`} className={estilos.titulo}>
          Días por pozo
        </h1>

        <div className={estilos.bloqueDato}>
          <p className={`dato ${estilos.valor}`}>
            {String(actual.valor).replace('.', ',')}
            <span className={estilos.unidad}>días</span>
          </p>
          <p className={estilos.contexto}>
            Spud a rig release, promedio de pozos horizontales.{' '}
            <strong>−{mejora} %</strong> respecto de {inicial.periodo}, cuando el promedio era de{' '}
            {String(inicial.valor).replace('.', ',')} días. Récord de la compañía:{' '}
            {eficiencia.record.valor} días.
          </p>
        </div>

        <dl className={estilos.apoyo}>
          {apoyo.map((metrica) => (
            <div key={metrica.id} className={estilos.item}>
              <dt>{metrica.etiqueta}</dt>
              <dd className="tabular">
                {metrica.valor} <span>{metrica.unidad}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className={estilos.acciones}>
          <Boton
            href="#eficiencia-perforacion"
            variante="primario"
            tono="oscuro"
            tamano="lg"
            evento={EVENTOS.CTA_CLICK}
            eventoProps={{ cta_id: 'hero-eficiencia' }}
          >
            Cómo bajamos la curva
          </Boton>
          <Boton
            href="#digitalizacion"
            variante="secundario"
            tono="oscuro"
            tamano="lg"
            evento={EVENTOS.CTA_CLICK}
            eventoProps={{ cta_id: 'hero-digitalizacion' }}
          >
            {digitalizacion.capacidades.length} piezas del stack
          </Boton>
        </div>
      </div>
    </Seccion>
  );
}
