'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import Logo from '@/components/ui/Logo';
import { navPrincipal } from '@/data/navegacion';
import { cotizacion } from '@/data/inversores';
import { EVENTOS } from '@/lib/analitica/eventos';
import { capturar } from '@/lib/analitica/cliente';
import { cx } from '@/lib/formato';
import estilos from './Header.module.css';

/**
 * Cabecera del sitio.
 *
 * ISS-14: el menú anterior abría solo con :hover, el botón era un <div> sin
 * nombre accesible y no había forma de operarlo con teclado. Ahora es un
 * <button> con aria-expanded/aria-controls, cierra con Escape, devuelve el
 * foco al botón y se cierra al navegar.
 *
 * ISS-02: el ticker de CDLE queda accesible desde cualquier página.
 */
export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const idMenu = useId();
  const adr = cotizacion.mercados[0];

  // Cerrar con Escape y devolver el foco al disparador
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        setAbierto(false);
        botonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [abierto]);

  return (
    <header className={estilos.header} data-tono="oscuro">
      <div className={cx('contenedor', estilos.barra)}>
        <Link href="/" className={estilos.logo} aria-label="Cordillera Energía, ir al inicio">
          <Logo />
        </Link>

        <nav className={estilos.navEscritorio} aria-label="Navegación principal">
          <ul className={estilos.lista}>
            {navPrincipal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={estilos.enlace}>
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.acciones}>
          <Link
            href="/#inversores"
            className={estilos.ticker}
            data-evento={EVENTOS.COTIZACION_CLICK}
            data-evento-props='{"origen":"header"}'
          >
            <span className={estilos.tickerSimbolo}>{cotizacion.ticker}</span>
            <span className={cx(estilos.tickerPrecio, 'tabular')}>
              {adr.moneda} {adr.precio}
            </span>
            <span className={estilos.tickerVariacion}>
              <span aria-hidden="true">▲</span> {adr.variacion}
            </span>
            <span className="solo-lectores">
              Cotización del ADR en {adr.plaza}, actualizada el {cotizacion.actualizado}. Ir a la
              sección de inversores.
            </span>
          </Link>

          <button
            ref={botonRef}
            type="button"
            className={estilos.hamburguesa}
            aria-expanded={abierto}
            aria-controls={idMenu}
            onClick={() => {
              setAbierto((v) => !v);
              if (!abierto) capturar(EVENTOS.MENU_ABIERTO);
            }}
          >
            <span className={estilos.iconoHamburguesa} aria-hidden="true">
              <span className={cx(estilos.raya, abierto && estilos.rayaArriba)} />
              <span className={cx(estilos.raya, abierto && estilos.rayaMedio)} />
              <span className={cx(estilos.raya, abierto && estilos.rayaAbajo)} />
            </span>
            {abierto ? 'Cerrar menú' : 'Menú'}
          </button>
        </div>
      </div>

      <div id={idMenu} className={cx(estilos.panel, abierto && estilos.panelAbierto)} hidden={!abierto}>
        <nav className="contenedor" aria-label="Navegación principal, versión móvil">
          <ul className={estilos.listaPanel}>
            {navPrincipal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={estilos.enlacePanel}
                  onClick={() => setAbierto(false)}
                >
                  <span className={estilos.etiquetaPanel}>{item.etiqueta}</span>
                  {item.descripcion ? (
                    <span className={estilos.descripcionPanel}>{item.descripcion}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
