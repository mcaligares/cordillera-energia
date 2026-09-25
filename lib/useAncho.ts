'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Mide el ancho disponible del contenedor para dibujar el SVG a escala 1:1.
 * Sin esto habría que estirar un viewBox fijo y el texto de los ejes quedaría
 * de 6 px en mobile. El valor inicial es el que se usa en el render del
 * servidor, así el gráfico ya sale dibujado antes de hidratar.
 */
export function useAncho<T extends HTMLElement>(anchoInicial = 720) {
  const ref = useRef<T>(null);
  const [ancho, setAncho] = useState(anchoInicial);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    const observer = new ResizeObserver((entradas) => {
      const medido = entradas[0]?.contentRect.width ?? 0;
      if (medido > 0) setAncho(Math.round(medido));
    });

    observer.observe(nodo);
    return () => observer.disconnect();
  }, []);

  return { ref, ancho };
}
