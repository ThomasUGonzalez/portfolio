"use client";

import { useEffect, useState } from "react";
import { defaultLang, langs, type Lang } from "@/lib/site";
import { buttonClass } from "./ui";

type Texts = { titulo: string; texto: string; volver: string };

/** Idioma de la 404: el de la URL (/en/...), si no el último elegido, si no español. */
function detectLang(): Lang {
  const fromUrl = window.location.pathname.split("/")[1];
  if (fromUrl === "es" || fromUrl === "en") return fromUrl;
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "es" || stored === "en") return stored;
  } catch {}
  return defaultLang;
}

export function NotFoundContent({ texts }: { texts: Record<Lang, Texts> }) {
  const [lang, setLang] = useState<Lang>(defaultLang);

  useEffect(() => {
    const detected = detectLang();
    setLang(detected);
    document.documentElement.lang = detected;
  }, []);

  const t = texts[lang];
  const other = langs.find((l) => l !== lang) ?? defaultLang;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center px-4 py-16 sm:px-6">
      <p className="text-6xl font-bold tracking-tight text-accent sm:text-7xl">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{t.titulo}</h1>
      <p className="mt-3 text-muted">{t.texto}</p>
      <a href={`/${lang}/`} className={`${buttonClass("primary")} mt-8`}>
        ← {t.volver}
      </a>
      {/* La misma salida en el otro idioma, por si la detección no acertó */}
      <a href={`/${other}/`} lang={other} hrefLang={other} className="mt-6 text-sm text-muted underline underline-offset-4 hover:text-accent">
        {texts[other].titulo} · {texts[other].volver}
      </a>
    </main>
  );
}
