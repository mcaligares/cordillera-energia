import type { ConfigPagina } from '@/config/sections.config';
import { registroSecciones } from '@/lib/registry';

interface Props {
  config: ConfigPagina;
}

/**
 * Recorre el array de la página y renderiza. No decide nada más: el orden, el
 * propósito y la audiencia de cada sección viven en `sections.config.ts`
 * (ISS-17: antes el orden estaba duplicado en `sections.json` y en `home.php`).
 */
export default function RenderizadorSecciones({ config }: Props) {
  return (
    <>
      {config.secciones.map((entrada) => {
        const Componente = registroSecciones[entrada.id];
        return <Componente key={entrada.id} perfil={config.perfil} />;
      })}
    </>
  );
}
