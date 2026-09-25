import Boton from '@/components/ui/Boton';
import Seccion from '@/components/ui/Seccion';
import Sparkline from '@/components/ui/Sparkline';
import { ultimoPeriodo } from '@/data/empresa';
import { cotizacion, documentoDestacado, resultados, serieProduccion } from '@/data/inversores';
import { EVENTOS } from '@/lib/analitica/eventos';
import { formatoNumero } from '@/lib/formato';
import estilos from './HeroInversor.module.css';

export const SECTION_ID = 'hero-inversor' as const;

const ultimo = serieProduccion.puntos[serieProduccion.puntos.length - 1];
const produccionTotal = ultimo.petroleo + ultimo.gas;
const destacados = ['ebitda', 'neto'].map((id) => resultados.find((r) => r.id === id)!);

/**
 * Hero del perfil inversor.
 *
 * Objetivo del perfil: producción, resultado del trimestre y cotización
 * visibles sin scrollear, y presentación, calendario y contacto de IR a un
 * clic. Esto resuelve, en una sola pantalla:
 *   ISS-01  el carrusel que escondía el CTA,
 *   ISS-02  la cotización que estaba a tres clics,
 *   ISS-04  el link a "Presentación de resultados" sin trimestre ni peso,
 *   ISS-05  las cifras que solo existían dentro de un párrafo.
 */
export default function HeroInversor() {
  return (
    <Seccion id={SECTION_ID} tono="oscuro" contenedor={false} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <div className={`contenedor ${estilos.grilla}`}>
        <div className={estilos.principal}>
          <p className={estilos.kicker}>
            <span className={estilos.chip}>{ultimoPeriodo.trimestre}</span>
            Publicado el {ultimoPeriodo.publicado}
          </p>

          <h1 id={`${SECTION_ID}-titulo`} className={estilos.titulo}>
            {ultimoPeriodo.trimestreLargo}
          </h1>

          <dl className={estilos.cifras}>
            <div className={estilos.cifraPrincipal}>
              <dt>Producción total</dt>
              <dd>
                <span className={`dato ${estilos.valorGrande}`}>{formatoNumero(produccionTotal)}</span>
                <span className={estilos.unidad}>boe/d</span>
                <span className={estilos.delta}>
                  <span aria-hidden="true">▲</span> +34 % <span>vs. 2T2025</span>
                </span>
              </dd>
            </div>

            {destacados.map((dato) => (
              <div key={dato.id} className={estilos.cifraSecundaria}>
                <dt>{dato.etiqueta}</dt>
                <dd>
                  <span className={`dato ${estilos.valorMedio}`}>{dato.valor}</span>
                  <span className={estilos.unidad}>{dato.unidad}</span>
                  {dato.delta ? (
                    <span className={estilos.delta}>
                      <span aria-hidden="true">▲</span> {dato.delta.valor}{' '}
                      <span>{dato.delta.referencia}</span>
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          <div className={estilos.acciones}>
            <Boton
              href={documentoDestacado.href}
              variante="primario"
              tono="oscuro"
              tamano="lg"
              meta={`${documentoDestacado.formato} · ${documentoDestacado.peso} · ${documentoDestacado.fecha}`}
              contexto={`en formato ${documentoDestacado.formato}, ${documentoDestacado.peso}`}
              evento={EVENTOS.DOCUMENTO_DESCARGA}
              eventoProps={{
                documento_id: documentoDestacado.id,
                periodo: documentoDestacado.periodo,
                formato: documentoDestacado.formato,
                origen: 'hero',
              }}
            >
              {documentoDestacado.titulo} {documentoDestacado.periodo}
            </Boton>
            <Boton
              href="#calendario-ir"
              variante="secundario"
              tono="oscuro"
              tamano="lg"
              evento={EVENTOS.CTA_CLICK}
              eventoProps={{ cta_id: 'hero-calendario' }}
            >
              Calendario de eventos
            </Boton>
            <Boton
              href="#contacto-ir"
              variante="fantasma"
              tono="oscuro"
              tamano="lg"
              evento={EVENTOS.CTA_CLICK}
              eventoProps={{ cta_id: 'hero-contacto-ir' }}
            >
              Contacto de IR
            </Boton>
          </div>
        </div>

        {/* ---------- Panel de cotización ---------- */}
        <aside className={estilos.panel} aria-labelledby={`${SECTION_ID}-cotizacion`}>
          <div className={estilos.panelCabecera}>
            <h2 id={`${SECTION_ID}-cotizacion`} className={estilos.panelTitulo}>
              <span className={estilos.simbolo}>{cotizacion.ticker}</span>
              <span className={estilos.panelSubtitulo}>Cotización</span>
            </h2>
            <Sparkline
              valores={cotizacion.serieADR}
              descripcion={`Evolución del ADR desde el ${cotizacion.serieDesde}: de ${cotizacion.serieADR[0]} a ${cotizacion.serieADR[cotizacion.serieADR.length - 1]} dólares.`}
              superficie="var(--sup-oscura-elevada)"
            />
          </div>

          <ul className={estilos.mercados}>
            {cotizacion.mercados.map((mercado) => (
              <li key={mercado.id} className={estilos.mercado}>
                <div className={estilos.mercadoPlaza}>
                  <span className={estilos.plaza}>{mercado.plaza}</span>
                  <span className={estilos.instrumento}>{mercado.instrumento}</span>
                </div>
                <div className={estilos.mercadoPrecio}>
                  <span className={`tabular ${estilos.precio}`}>
                    <span className={estilos.moneda}>{mercado.moneda}</span> {mercado.precio}
                  </span>
                  <span className={estilos.variacion}>
                    <span aria-hidden="true">▲</span> {mercado.variacion}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <dl className={estilos.panelPie}>
            <dt>{cotizacion.capitalizacion.etiqueta}</dt>
            <dd className="tabular">
              {cotizacion.capitalizacion.valor}{' '}
              <span>{cotizacion.capitalizacion.unidad}</span>
            </dd>
          </dl>

          <p className={estilos.nota}>
            <time dateTime={cotizacion.actualizadoISO}>{cotizacion.actualizado}</time>.{' '}
            {cotizacion.demora}
          </p>
        </aside>
      </div>
    </Seccion>
  );
}
