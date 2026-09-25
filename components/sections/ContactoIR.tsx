import Encabezado from '@/components/ui/Encabezado';
import Seccion from '@/components/ui/Seccion';
import { EVENTOS } from '@/lib/analitica/eventos';
import { contactoIR } from '@/data/inversores';
import estilos from './ContactoIR.module.css';

export const SECTION_ID = 'contacto-ir' as const;

/**
 * Contacto de Relación con Inversores.
 * ISS-07: el único canal era el formulario general de nueve campos, sin
 * opción "Inversores" y con 3 % de completitud. Acá el email y el teléfono
 * están en texto, son enlaces y no hay nada entre medio.
 */
export default function ContactoIR() {
  return (
    <Seccion id={SECTION_ID} tono="oscuro" etiquetadaPor={`${SECTION_ID}-titulo`}>
      <Encabezado
        id={`${SECTION_ID}-titulo`}
        eyebrow="Relación con Inversores"
        titulo="Hablá directo con IR"
        bajada={contactoIR.bajada}
      />

      <div className={estilos.grilla}>
        <div className={estilos.principal}>
          <a
            href={`mailto:${contactoIR.email}`}
            className={estilos.email}
            data-evento={EVENTOS.IR_CONTACTO_CLICK}
            data-evento-props='{"canal":"email"}'
          >
            {contactoIR.email}
          </a>
          <a
            href={`tel:${contactoIR.telefonoHref}`}
            className={estilos.telefono}
            data-evento={EVENTOS.IR_CONTACTO_CLICK}
            data-evento-props='{"canal":"telefono"}'
          >
            {contactoIR.telefono}
          </a>
          <p className={estilos.responsable}>
            {contactoIR.responsable.nombre} — {contactoIR.responsable.cargo}
          </p>
          <address className={estilos.direccion}>{contactoIR.direccion}</address>
        </div>

        <ul className={estilos.secundario}>
          <li className={estilos.tarjeta}>
            <h3 className={estilos.tituloTarjeta}>{contactoIR.suscripcion.titulo}</h3>
            <p className={estilos.textoTarjeta}>{contactoIR.suscripcion.detalle}</p>
            <a href={contactoIR.suscripcion.href} className={estilos.enlaceTarjeta}>
              Suscribirme
              <span className="solo-lectores"> a las alertas de Relación con Inversores</span>
            </a>
          </li>
          <li className={estilos.tarjeta}>
            <h3 className={estilos.tituloTarjeta}>{contactoIR.agente.titulo}</h3>
            <p className={estilos.textoTarjeta}>{contactoIR.agente.detalle}</p>
          </li>
        </ul>
      </div>
    </Seccion>
  );
}
