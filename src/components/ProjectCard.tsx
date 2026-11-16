import Link from "next/link";
import { accentFor } from "@/lib/color";
import type { Project } from "@/lib/content";
import type { Lang } from "@/lib/site";
import type { UI } from "@/i18n/ui";
import { StatusBadge, TagList } from "./ui";

/** Tarjeta de la grilla de proyectos. Toda la tarjeta lleva al detalle. */
export function ProjectCard({ project, lang, ui }: { project: Project; lang: Lang; ui: UI }) {
  const titulo = project.titulo[lang];

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface transition-transform duration-200 hover:-translate-y-1 focus-within:-translate-y-1"
      style={{ borderColor: accentFor(project.colorMarca) }}
    >
      <div className="grid h-36 place-items-center" style={{ backgroundColor: project.colorMarca }}>
        <img
          src={project.portada}
          alt={`${ui.logoDe} ${titulo}`}
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
          className="size-24 rounded-2xl shadow-lg shadow-black/30"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold leading-snug">
            <Link href={`/${lang}/proyectos/${project.id}/`} className="after:absolute after:inset-0 group-hover:text-accent">
              {titulo}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.resumen[lang]}</p>
        </div>
        <div>
          <StatusBadge>{project.estado[lang]}</StatusBadge>
        </div>
        <TagList items={project.stack} label={ui.detalle.stack} />
        <p aria-hidden className="mt-auto text-sm font-semibold text-accent">
          {ui.proyectos.ver} →
        </p>
      </div>
    </article>
  );
}
