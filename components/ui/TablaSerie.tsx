import estilos from './TablaSerie.module.css';

interface Props {
  caption: string;
  columnas: string[];
  filas: string[][];
  tono?: 'claro' | 'oscuro';
}

/**
 * Vista de tabla de un gráfico. Es el camino accesible canónico: todo lo que
 * el SVG muestra visualmente está acá en texto, navegable y seleccionable.
 */
export default function TablaSerie({ caption, columnas, filas, tono = 'claro' }: Props) {
  return (
    <div className={tono === 'oscuro' ? `${estilos.envoltorio} ${estilos.oscuro}` : estilos.envoltorio}>
      <table className={estilos.tabla}>
        <caption className="solo-lectores">{caption}</caption>
        <thead>
          <tr>
            {columnas.map((columna, i) => (
              <th key={columna} scope="col" className={i === 0 ? undefined : estilos.numerica}>
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila[0]}>
              {fila.map((celda, i) =>
                i === 0 ? (
                  <th key={i} scope="row">
                    {celda}
                  </th>
                ) : (
                  <td key={i} className={estilos.numerica}>
                    {celda}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
