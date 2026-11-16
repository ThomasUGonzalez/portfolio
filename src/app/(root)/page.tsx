import type { Metadata } from "next";
import { getPerfil } from "@/lib/content";
import { defaultLang } from "@/lib/site";

export const metadata: Metadata = {
  title: getPerfil().nombre,
  alternates: { canonical: `/${defaultLang}/` },
};

// "/" lleva al último idioma elegido (guardado en el navegador) o a español.
const redirect = `
  var lang = null;
  try { lang = localStorage.getItem("lang"); } catch (e) {}
  location.replace(lang === "en" ? "/en/" : "/${defaultLang}/");
`;

export default function RootPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <script dangerouslySetInnerHTML={{ __html: redirect }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=/${defaultLang}/`} />
      </noscript>
      <p className="flex gap-4">
        <a href="/es/" className="text-accent underline">
          Español
        </a>
        <a href="/en/" className="text-accent underline">
          English
        </a>
      </p>
    </main>
  );
}
