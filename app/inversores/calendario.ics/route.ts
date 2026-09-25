import { empresa } from '@/data/empresa';
import { eventos } from '@/data/inversores';

export const dynamic = 'force-static';

/** Escapa según RFC 5545: coma, punto y coma, barra y salto de línea. */
function escapar(texto: string): string {
  return texto
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/** Corta las líneas a 75 octetos, como pide el RFC. */
function plegar(linea: string): string {
  if (linea.length <= 75) return linea;
  const partes = [linea.slice(0, 75)];
  let resto = linea.slice(75);
  while (resto.length > 74) {
    partes.push(` ${resto.slice(0, 74)}`);
    resto = resto.slice(74);
  }
  if (resto) partes.push(` ${resto}`);
  return partes.join('\r\n');
}

/**
 * Calendario de eventos de IR en formato iCalendar.
 *
 * ISS-06: el calendario era un PDF anual que se subía en enero y quedaba
 * desactualizado. Ahora sale del mismo array que renderiza la sección, así
 * que no puede desincronizarse: agregar un evento en /data/inversores.ts lo
 * publica en la página y en el .ics a la vez.
 */
export function GET() {
  const sello = '20260925T120000Z';

  const lineas: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${escapar(empresa.nombre)}//Relacion con Inversores//ES`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapar(`${empresa.nombreCorto} · Calendario de IR`)}`,
    'X-WR-TIMEZONE:America/Argentina/Buenos_Aires',
  ];

  for (const evento of eventos) {
    const dia = evento.fechaISO.replace(/-/g, '');
    const siguiente = new Date(`${evento.fechaISO}T00:00:00Z`);
    siguiente.setUTCDate(siguiente.getUTCDate() + 1);
    const finDia = siguiente.toISOString().slice(0, 10).replace(/-/g, '');

    lineas.push(
      'BEGIN:VEVENT',
      `UID:${evento.id}@cordilleraenergia.com.ar`,
      `DTSTAMP:${sello}`,
      // Eventos de día completo: el horario exacto cambia y vive en la página
      `DTSTART;VALUE=DATE:${dia}`,
      `DTEND;VALUE=DATE:${finDia}`,
      `SUMMARY:${escapar(`${empresa.nombreCorto} · ${evento.titulo}`)}`,
      `DESCRIPTION:${escapar(evento.detalle)}`,
      `CATEGORIES:${escapar(evento.tipo)}`,
      `URL:${empresa.sitio}${evento.href ?? '/#calendario-ir'}`,
      'END:VEVENT',
    );
  }

  lineas.push('END:VCALENDAR');

  return new Response(lineas.map(plegar).join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="cordillera-energia-ir.ics"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
