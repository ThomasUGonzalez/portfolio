"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { langs, type Lang } from "@/lib/site";

type NavItem = { href: string; label: string };

/** Selector ES | EN: lleva a la misma página en el otro idioma y recuerda la elección. */
function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(es|en)(?=\/|$)/, "");

  return (
    <div role="group" aria-label={label} className="flex rounded-lg border border-line p-0.5 text-xs font-semibold">
      {langs.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest || "/"}`}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          onClick={() => {
            try {
              localStorage.setItem("lang", l);
            } catch {}
          }}
          className={`rounded-md px-2.5 py-1.5 uppercase transition-colors ${
            l === lang ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

export function Header({
  lang,
  initials,
  name,
  nav,
  labels,
}: {
  lang: Lang;
  initials: string;
  name: string;
  nav: NavItem[];
  labels: { menu: string; langSwitch: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={`/${lang}/`} aria-label={name} className="text-lg font-bold tracking-tight text-accent">
          {initials}
        </Link>

        <nav aria-label={labels.menu} className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-md px-3 py-2 text-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch lang={lang} label={labels.langSwitch} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={labels.menu}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-lg border border-line text-ink md:hidden"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      <nav id="menu-movil" aria-label={labels.menu} hidden={!open} className="border-t border-line/70 bg-bg md:hidden">
        <ul className="mx-auto max-w-5xl px-4 py-2">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-md px-2 py-3 text-ink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
