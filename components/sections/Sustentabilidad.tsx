import Boton from '@/components/ui/Boton';
import Cifra from '@/components/ui/Cifra';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { EVENTOS } from '@/lib/analitica/eventos';
import { sustentabilidad } from '@/data/empresa';
import estilos from './Sustentabilidad.module.css';

export const SECTION_ID = 'sustentabilidad' as const;

/**
 * Métricas ESG en el sitio.
 * ISS-09: estaban solo dentro del reporte anual en PDF.
 */
export default function Sustentabilidad() {
  const { reporte } = sustentabilidad;

  return (
    <Seccion id={SECTION_ID} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Sustentabilidad"
        titulo={sustentabilidad.titulo}
        bajada={sustentabilidad.bajada}
        acciones={
          <Boton
            href={reporte.href}
            variante="secundario"
            meta={`${reporte.formato} · ${reporte.peso} · ${reporte.paginas} pp.`}
            contexto={`en formato ${reporte.formato}, ${reporte.peso}`}
            evento={EVENTOS.DOCUMENTO_DESCARGA}
            eventoProps={{
              documento_id: 'reporte-sustentabilidad-2025',
              periodo: 'FY2025',
              formato: reporte.formato,
              origen: 'sustentabilidad',
            }}
          >
            {reporte.titulo}
          </Boton>
        }
      />

      <div className={estilos.grilla}>
        {sustentabilidad.metricas.map((metrica) => (
          <Cifra key={metrica.id} dato={metrica} tamano="sm" className={estilos.celda} />
        ))}
      </div>
    </Seccion>
  );
}
