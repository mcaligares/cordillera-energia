'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { EVENTOS } from '@/lib/analitica/eventos';
import { analiticaActiva, capturar, iniciarAnalitica, registrar } from '@/lib/analitica/cliente';

interface Props {
  /** Variante de la página; viaja como super property en todos los eventos. */
  variante: string;
}

/**
 * Integración con PostHog.
 *
 * Un solo componente cliente en toda la app. Las secciones siguen siendo
 * Server Components y solo declaran atributos `data-evento` en el markup;
 * acá se escucha por delegación. Medir no obliga a hidratar ninguna sección.
 *
 * Sin `NEXT_PUBLIC_POSTHOG_KEY` no hace nada: en local y en preview el sitio
 * corre sin analítica, sin red y sin cookies.
 */
export default function Analitica({ variante }: Props) {
  const ruta = usePathname();
  const [listo, setListo] = useState(false);
  const hitos = useRef(new Set<number>());

  useEffect(() => {
    if (!analiticaActiva()) return;
    let vigente = true;
    iniciarAnalitica().then(() => {
      if (vigente) setListo(true);
    });
    return () => {
      vigente = false;
    };
  }, []);

  /* --- Pageview y variante ------------------------------------------------ */
  useEffect(() => {
    if (!listo) return;
    registrar({ variante, ruta });
    capturar('$pageview', { variante, ruta });
    capturar(EVENTOS.VARIANTE_VISTA, { variante, ruta });
    hitos.current = new Set<number>();
  }, [listo, variante, ruta]);

  /* --- Clics por delegación ----------------------------------------------- */
  useEffect(() => {
    if (!listo) return;

    const alHacerClic = (evento: MouseEvent) => {
      const objetivo = (evento.target as HTMLElement | null)?.closest<HTMLElement>('[data-evento]');
      const nombre = objetivo?.dataset.evento;
      if (!objetivo || !nombre) return;

      let props: Record<string, unknown> = {};
      if (objetivo.dataset.eventoProps) {
        try {
          props = JSON.parse(objetivo.dataset.eventoProps);
        } catch {
          props = { props_invalidas: objetivo.dataset.eventoProps };
        }
      }

      const seccion = objetivo.closest<HTMLElement>('[data-section]');

      capturar(nombre as never, {
        ...props,
        seccion_id: props.seccion_id ?? seccion?.dataset.section ?? null,
        destino: objetivo.getAttribute('href'),
        texto: objetivo.textContent?.trim().slice(0, 80),
      });
    };

    document.addEventListener('click', alHacerClic, { capture: true });
    return () => document.removeEventListener('click', alHacerClic, { capture: true });
  }, [listo]);

  /* --- Secciones vistas ---------------------------------------------------- */
  useEffect(() => {
    if (!listo) return;

    const secciones = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    if (secciones.length === 0) return;

    const temporizadores = new Map<Element, ReturnType<typeof setTimeout>>();
    const vistas = new Set<string>();

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const id = (entrada.target as HTMLElement).dataset.section;
          if (!id || vistas.has(id)) continue;

          if (entrada.isIntersecting) {
            // Un vistazo de menos de un segundo no cuenta como sección vista.
            temporizadores.set(
              entrada.target,
              setTimeout(() => {
                vistas.add(id);
                capturar(EVENTOS.SECCION_VISTA, {
                  seccion_id: id,
                  posicion: secciones.findIndex((s) => s.dataset.section === id) + 1,
                });
                observer.unobserve(entrada.target);
              }, 1000),
            );
          } else {
            const pendiente = temporizadores.get(entrada.target);
            if (pendiente) clearTimeout(pendiente);
          }
        }
      },
      { threshold: 0.5 },
    );

    secciones.forEach((seccion) => observer.observe(seccion));

    return () => {
      temporizadores.forEach((t) => clearTimeout(t));
      observer.disconnect();
    };
  }, [listo, ruta]);

  /* --- Profundidad de scroll ------------------------------------------------ */
  useEffect(() => {
    if (!listo) return;

    let pendiente = false;

    const medir = () => {
      pendiente = false;
      const documento = document.documentElement;
      if (documento.scrollHeight - window.innerHeight <= 0) return;

      const porcentaje = Math.round(
        ((window.scrollY + window.innerHeight) / documento.scrollHeight) * 100,
      );

      for (const hito of [25, 50, 75, 100]) {
        if (porcentaje >= hito && !hitos.current.has(hito)) {
          hitos.current.add(hito);
          capturar(EVENTOS.SCROLL_PROFUNDIDAD, { porcentaje: hito });
        }
      }
    };

    const alScrollear = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(medir);
    };

    window.addEventListener('scroll', alScrollear, { passive: true });
    medir();
    return () => window.removeEventListener('scroll', alScrollear);
  }, [listo, ruta]);

  return null;
}
