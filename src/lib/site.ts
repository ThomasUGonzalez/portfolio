export const langs = ["es", "en"] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = "es";

export function isLang(value: string): value is Lang {
  return (langs as readonly string[]).includes(value);
}

/**
 * URL pública del sitio (para Open Graph y sitemap).
 * En Vercel se detecta sola; para un dominio propio, definí NEXT_PUBLIC_SITE_URL.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
