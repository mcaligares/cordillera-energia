import Boton from '@/components/ui/Boton';
import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { quienesSomos } from '@/data/empresa';
import estilos from './QuienesSomos.module.css';

export const SECTION_ID = 'quienes-somos' as const;

export default function QuienesSomos() {
  return (
    <Seccion id={SECTION_ID} etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Quiénes somos"
        titulo={quienesSomos.titulo}
        bajada={quienesSomos.bajada}
      />

      <div className={estilos.cuerpo}>
        <div className={estilos.texto}>
          {quienesSomos.parrafos.map((parrafo) => (
            <p key={parrafo.slice(0, 32)}>{parrafo}</p>
          ))}
          <Boton href="/#operaciones" variante="fantasma">
            Ver dónde operamos
          </Boton>
        </div>

        <ul className={estilos.pilares}>
          {quienesSomos.pilares.map((pilar, i) => (
            <li key={pilar.titulo} className={estilos.pilar}>
              <span className={estilos.numero} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={estilos.tituloPilar}>{pilar.titulo}</h3>
              <p className={estilos.textoPilar}>{pilar.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
