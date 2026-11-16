import type { ComponentProps, ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Piezas chicas de interfaz que se repiten en todo el sitio. */

export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-md border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink/90">
      {children}
    </li>
  );
}

export function TagList({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  );
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

const buttonStyles = {
  primary: "bg-accent text-accent-ink hover:bg-accent/85",
  secondary: "border border-line bg-surface text-ink hover:border-accent/60 hover:text-accent",
};

/** Enlace con aspecto de botón. */
export function ButtonLink({
  variant = "secondary",
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: keyof typeof buttonStyles }) {
  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export const buttonClass = (variant: keyof typeof buttonStyles) =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${buttonStyles[variant]}`;

/** Sección de la home: ancla para el menú, título y contenido. */
export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="border-t border-line/60 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <h2 id={`${id}-titulo`} className="text-2xl font-bold tracking-tight sm:text-3xl">
            <span aria-hidden className="mr-2 text-accent">
              /
            </span>
            {title}
          </h2>
          {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
        </Reveal>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
