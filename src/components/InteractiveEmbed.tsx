"use client";

import { useState } from "react";
import { buttonClass } from "./ui";

/** Página interactiva embebida: el iframe recién se carga cuando se toca el botón. */
export function InteractiveEmbed({
  src,
  title,
  labels,
}: {
  src: string;
  title: string;
  labels: { open: string; close: string; newTab: string; note: string };
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" onClick={() => setOpen(true)} className={buttonClass("primary")}>
          <svg aria-hidden width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
            <path d="M5 2.5v13l10.5-6.5z" />
          </svg>
          {labels.open}
        </button>
        <p className="text-sm text-muted">{labels.note}</p>
      </div>
    );
  }

  return (
    <div>
      <iframe
        src={src}
        title={title}
        className="h-[70svh] min-h-[420px] w-full rounded-xl border border-line bg-black"
        allow="fullscreen"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={() => setOpen(false)} className={buttonClass("secondary")}>
          {labels.close}
        </button>
        <a href={src} target="_blank" rel="noopener" className={buttonClass("secondary")}>
          {labels.newTab} ↗
        </a>
      </div>
    </div>
  );
}
