/**
 * Formateo de números en convención es-AR (punto para miles, coma decimal).
 * Se hace a mano y no con Intl para que el string del servidor y el del
 * cliente sean idénticos y no haya mismatch de hidratación.
 */

export function formatoNumero(valor: number, decimales = 0): string {
  const negativo = valor < 0;
  const abs = Math.abs(valor);
  const fijo = abs.toFixed(decimales);
  const [entera, decimal] = fijo.split('.');
  const conMiles = entera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const salida = decimal ? `${conMiles},${decimal}` : conMiles;
  return negativo ? `−${salida}` : salida;
}

/** Ticks redondos para un eje: mínimo 0 y un techo por encima del máximo. */
export function ticksEje(maximo: number, cantidad = 4): number[] {
  if (maximo <= 0) return [0];
  const bruto = maximo / cantidad;
  const magnitud = Math.pow(10, Math.floor(Math.log10(bruto)));
  const normalizado = bruto / magnitud;
  const paso =
    (normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 2.5 ? 2.5 : normalizado <= 5 ? 5 : 10) *
    magnitud;
  const ticks: number[] = [];
  for (let t = 0; t <= maximo + paso * 0.001; t += paso) ticks.push(Number(t.toFixed(6)));
  if (ticks[ticks.length - 1] < maximo) ticks.push(Number((ticks[ticks.length - 1] + paso).toFixed(6)));
  return ticks;
}

/** Une clases ignorando los valores vacíos. */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(' ');
}
