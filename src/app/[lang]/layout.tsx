import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { initialsOf } from "@/components/Avatar";
import { Header } from "@/components/Header";
import { getUI } from "@/i18n/ui";
import { getPerfil } from "@/lib/content";
import { isLang, langs, siteUrl } from "@/lib/site";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

type Props = { params: Promise<{ lang: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => langs.map((lang) => ({ lang }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const perfil = getPerfil();
  const title = `${perfil.nombre} · ${perfil.titular[lang]}`;
  const description = perfil.bajada[lang];
  const image = { url: `/og/${lang}.png`, width: 1200, height: 630, alt: title };

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${perfil.nombreCorto}` },
    description,
    icons: { icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-touch-icon.png" },
    alternates: {
      canonical: `/${lang}/`,
      languages: { es: "/es/", en: "/en/", "x-default": "/es/" },
    },
    openGraph: {
      type: "website",
      siteName: perfil.nombre,
      title,
      description,
      url: `/${lang}/`,
      locale: lang === "es" ? "es_AR" : "en_US",
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export default async function LangLayout({ children, params }: Props & { children: ReactNode }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const ui = getUI(lang);
  const perfil = getPerfil();

  const nav = (Object.keys(ui.nav) as (keyof typeof ui.nav)[]).map((key) => ({
    href: `/${lang}/#${sectionIds[key]}`,
    label: ui.nav[key],
  }));

  return (
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Marca que hay JavaScript: habilita las animaciones de aparición */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-ink"
        >
          {ui.skip}
        </a>
        <Header
          lang={lang}
          initials={initialsOf(perfil.nombreCorto)}
          name={perfil.nombre}
          nav={nav}
          labels={{ menu: ui.menu, langSwitch: ui.langSwitch }}
        />
        <main id="contenido" className="pt-16">
          {children}
        </main>
        <footer className="border-t border-line/60 py-8 text-center text-sm text-muted">
          {perfil.nombre} · {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}

/** Ancla de cada entrada del menú (coinciden con los id de las secciones de la home). */
const sectionIds = {
  proyectos: "proyectos",
  sobreMi: "sobre-mi",
  trayectoria: "experiencia",
  skills: "skills",
  contacto: "contacto",
} as const;
