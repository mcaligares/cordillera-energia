import Image from 'next/image';
import Boton from '@/components/ui/Boton';
import Seccion from '@/components/ui/Seccion';
import { empresa, ultimoPeriodo } from '@/data/empresa';
import { EVENTOS } from '@/lib/analitica/eventos';
import { formatoNumero } from '@/lib/formato';
import { cotizacion, resultados, serieProduccion } from '@/data/inversores';
import estilos from './Hero.module.css';
import arte from '@/assets/marca/hero-cordillera.png';

export const SECTION_ID = 'hero' as const;

const ultimo = serieProduccion.puntos[serieProduccion.puntos.length - 1];
const produccionTotal = ultimo.petroleo + ultimo.gas;
const ebitda = resultados.find((r) => r.id === 'ebitda');

/**
 * Hero institucional.
 *
 * ISS-01: reemplaza el carrusel de tres slides con autoplay. Un solo mensaje,
 * un CTA principal visible sin scrollear y sin rotación automática.
 * ISS-03: una sola imagen, servida por next/image con `priority` y `sizes`,
 * con dimensiones declaradas (el LCP era de 4,8 s con cuatro JPG en paralelo).
 * ISS-13: un único <h1> en la página.
 */
export default function Hero() {
  return (
    <Seccion id={SECTION_ID} tono="oscuro" contenedor={false} etiqueta="Presentación">
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
        <p className={estilos.kicker}>Vaca Muerta · Neuquén, Argentina</p>
        <h1 className={estilos.titulo}>Energía que nace de la cordillera</h1>
        <p className={estilos.bajada}>
          {empresa.nombreCorto} produce {formatoNumero(produccionTotal)} boe/d de shale oil
          y gas en cuatro bloques de Vaca Muerta. Tres de ellos los operamos nosotros.
        </p>

        <div className={estilos.acciones}>
          <Boton
            href="/#inversores"
            variante="primario"
            tono="oscuro"
            tamano="lg"
            evento={EVENTOS.CTA_CLICK}
            eventoProps={{ cta_id: 'hero-resultados' }}
          >
            Resultados {ultimoPeriodo.trimestre}
          </Boton>
          <Boton
            href="/#operaciones"
            variante="secundario"
            tono="oscuro"
            tamano="lg"
            evento={EVENTOS.CTA_CLICK}
            eventoProps={{ cta_id: 'hero-operaciones' }}
          >
            Cómo operamos
          </Boton>
        </div>

        <dl className={estilos.cinta}>
          <div className={estilos.item}>
            <dt>Producción {ultimoPeriodo.trimestre}</dt>
            <dd className="tabular">
              {formatoNumero(produccionTotal)} <span>boe/d</span>
            </dd>
          </div>
          <div className={estilos.item}>
            <dt>EBITDA ajustado</dt>
            <dd className="tabular">
              {ebitda?.valor} <span>MM USD</span>
            </dd>
          </div>
          <div className={estilos.item}>
            <dt>{cotizacion.ticker} · {cotizacion.mercados[0].plaza}</dt>
            <dd className="tabular">
              {cotizacion.mercados[0].precio} <span>USD</span>
            </dd>
          </div>
        </dl>
      </div>
    </Seccion>
  );
}
