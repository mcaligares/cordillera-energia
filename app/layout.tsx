import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { empresa } from '@/data/empresa';
import { paginas } from '@/config/sections.config';
import './globals.css';

/**
 * ISS-15: el sitio usaba Arial de sistema y no tenía escala tipográfica.
 * next/font autohospeda las fuentes, las precarga y evita el layout shift.
 */
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fuente-archivo',
  weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fuente-plex-mono',
  weight: ['400', '500', '600'],
});

/** ISS-16: cada página tiene título propio, descripción y Open Graph. */
export const metadata: Metadata = {
  metadataBase: new URL(empresa.sitio),
  title: {
    default: paginas.general.titulo,
    template: `%s | ${empresa.nombre}`,
  },
  description: paginas.general.descripcion,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: empresa.nombre,
    title: paginas.general.titulo,
    description: paginas.general.descripcion,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a2540',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* ISS-16: el <html> del sitio anterior no declaraba idioma. */
    <html lang="es-AR" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        {/* ISS-14: no había skip link y el reset tenía outline: none global. */}
        <a href="#contenido" className="saltar">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
