import Link from 'next/link';
import estilos from './not-found.module.css';

export default function NoEncontrado() {
  return (
    <div className={`contenedor ${estilos.pagina}`}>
      <p className={estilos.codigo}>404</p>
      <h1 className={estilos.titulo}>No encontramos esta página</h1>
      <p className={estilos.texto}>
        Puede que el enlace haya cambiado. Desde el inicio se llega a resultados, operaciones y
        contacto.
      </p>
      <Link href="/" className={estilos.enlace}>
        Volver al inicio
      </Link>
    </div>
  );
}
