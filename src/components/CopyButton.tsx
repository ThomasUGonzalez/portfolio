"use client";

import { useState } from "react";
import { buttonClass } from "./ui";

/** Copia un texto al portapapeles y lo confirma (también para lectores de pantalla). */
export function CopyButton({ text, label, doneLabel }: { text: string; label: string; doneLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button type="button" onClick={copy} className={buttonClass("secondary")}>
      <span aria-live="polite">{copied ? doneLabel : label}</span>
    </button>
  );
}
