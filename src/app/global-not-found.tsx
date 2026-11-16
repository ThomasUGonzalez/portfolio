import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NotFoundContent } from "@/components/NotFoundContent";
import { getUI } from "@/i18n/ui";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "404 · Página no encontrada / Page not found",
  robots: { index: false },
  icons: { icon: "/favicon.ico" },
};

// Página 404 de todo el sitio. Es un único archivo estático (404.html),
// así que el idioma se elige en el navegador (ver NotFoundContent).
export default function GlobalNotFound() {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <NotFoundContent texts={{ es: getUI("es").notFound, en: getUI("en").notFound }} />
      </body>
    </html>
  );
}
