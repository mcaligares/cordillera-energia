/**
 * Región del proyecto de PostHog: 'us' o 'eu'. Solo afecta al proxy inverso.
 * Se lee en build porque los rewrites se resuelven en ese momento.
 */
const REGION = process.env.POSTHOG_REGION === 'eu' ? 'eu' : 'us';

/**
 * Cabeceras de seguridad. No incluyen Content-Security-Policy: una CSP estricta
 * en Next necesita nonces por request (middleware), y el sitio hoy es 100 %
 * estático. Queda anotado como paso siguiente en el README.
 */
const CABECERAS_SEGURIDAD = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // ISS-10: se servían JPG de ~1,9 MB sin dimensiones. Ahora next/image
    // entrega AVIF/WebP con width y height declarados en cada <Image />.
    formats: ['image/avif', 'image/webp'],
    // Next 16 exige declarar las calidades que se usan en <Image quality>.
    qualities: [75, 78],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [48, 64, 96, 128, 256, 384],
  },

  // PostHog necesita que no se normalice la barra final de /ingest/...
  skipTrailingSlashRedirect: true,

  async headers() {
    return [{ source: '/:path*', headers: CABECERAS_SEGURIDAD }];
  },

  /**
   * Proxy inverso de PostHog.
   *
   * Los bloqueadores de publicidad filtran `*.posthog.com` por lista. En un
   * sitio de IR eso no es un detalle: el perfil técnico —justo el de la
   * variante `tech`— es el que más los usa, así que la variante que queremos
   * medir es la que peor se mediría. Sirviendo la ingesta desde el propio
   * dominio, los eventos llegan.
   *
   * Se activa poniendo NEXT_PUBLIC_POSTHOG_HOST=/ingest en Vercel.
   * Con el host absoluto (us.i.posthog.com) el proxy simplemente no se usa.
   */
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: `https://${REGION}-assets.i.posthog.com/static/:path*`,
      },
      {
        source: '/ingest/:path*',
        destination: `https://${REGION}.i.posthog.com/:path*`,
      },
    ];
  },
};

export default nextConfig;
