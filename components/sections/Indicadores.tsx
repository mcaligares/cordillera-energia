import Cifra from '@/components/ui/Cifra';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { indicadoresClave } from '@/data/empresa';
import estilos from './Indicadores.module.css';

export const SECTION_ID = 'indicadores-clave' as const;

/**
 * Cuatro cifras que ubican el tamaño de la compañía.
 * ISS-05: antes estaban dentro de párrafos de "Quiénes somos" y el test
 * moderado mostraba 1 min 48 s para encontrar una sola de ellas.
 */
export default function Indicadores() {
  return (
    <Seccion id={SECTION_ID} tono="hundido" etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="La compañía en cuatro cifras"
        titulo="Escala del activo"
        bajada="Datos estructurales del portafolio. Las cifras del trimestre están en la sección de inversores."
      />
      <div className={estilos.grilla}>
        {indicadoresClave.map((dato) => (
          <Cifra key={dato.id} dato={dato} />
        ))}
      </div>
    </Seccion>
  );
}
