import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { navPie, variantes } from '@/data/navegacion';
import { contactoIR, cotizacion } from '@/data/inversores';
import { empresa } from '@/data/empresa';
import estilos from './Footer.module.css';

export default function Footer() {
  const anio = 2026;

  return (
    <footer className={estilos.pie} data-tono="oscuro">
      <div className="contenedor">
        <div className={estilos.superior}>
          <div className={estilos.identidad}>
            <Logo />
            <p className={estilos.descriptor}>{empresa.descriptor}</p>
            <p className={estilos.cotiza}>
              BYMA y NYSE · ticker{' '}
              <span className={estilos.ticker}>{cotizacion.ticker}</span>
            </p>
          </div>

          {navPie.map((grupo) => (
            <nav
              key={grupo.titulo}
              aria-labelledby={`pie-${grupo.titulo.toLowerCase().replace(/\s+/g, '-')}`}
              className={estilos.columna}
            >
              <h2
                id={`pie-${grupo.titulo.toLowerCase().replace(/\s+/g, '-')}`}
                className={estilos.tituloColumna}
              >
                {grupo.titulo}
              </h2>
              <ul>
                {grupo.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={estilos.enlace}>
                      {item.etiqueta}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={estilos.columna}>
            <h2 className={estilos.tituloColumna}>Relación con Inversores</h2>
            <ul>
              <li>
                <a href={`mailto:${contactoIR.email}`} className={estilos.enlace}>
                  {contactoIR.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contactoIR.telefonoHref}`} className={estilos.enlace}>
                  {contactoIR.telefono}
                </a>
              </li>
            </ul>
            <h2 className={estilos.tituloColumna}>Versiones de esta home</h2>
            <ul>
              {variantes.map((variante) => (
                <li key={variante.href}>
                  <Link href={variante.href} className={estilos.enlace}>
                    {variante.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={estilos.inferior}>
          <p>
            © {anio} {empresa.nombre} Todos los derechos reservados.
          </p>
          <p className={estilos.legal}>
            Las cifras operativas y financieras corresponden al {' '}
            <abbr title="segundo trimestre de 2026">2T2026</abbr> salvo indicación en contrario.
            {' '}
            {cotizacion.demora}
          </p>
        </div>
      </div>
    </footer>
  );
}
