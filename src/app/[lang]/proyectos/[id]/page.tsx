import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ClipTabs } from "@/components/ClipTabs";
import { InteractiveEmbed } from "@/components/InteractiveEmbed";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ButtonLink, StatusBadge, TagList } from "@/components/ui";
import { getUI } from "@/i18n/ui";
import { accentFor } from "@/lib/color";
import { getProject, getProjects } from "@/lib/content";
import { isLang, langs } from "@/lib/site";

type Props = { params: Promise<{ lang: string; id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  langs.flatMap((lang) => getProjects().map((p) => ({ lang, id: p.id })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const project = getProject(id);
  if (!project || !isLang(lang)) return {};
  const title = project.titulo[lang];
  const description = project.resumen[lang];
  const path = `proyectos/${id}/`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/${path}`,
      languages: { es: `/es/${path}`, en: `/en/${path}`, "x-default": `/es/${path}` },
    },
    openGraph: { title, description, url: `/${lang}/${path}`, images: [`/og/${lang}.png`] },
    twitter: { card: "summary_large_image", title, description, images: [`/og/${lang}.png`] },
  };
}

/** Bloque de texto con su subtítulo. */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">{title}</h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { lang, id } = await params;
  const project = getProject(id);
  if (!project || !isLang(lang)) notFound();
  const ui = getUI(lang);
  const d = ui.detalle;
  const titulo = project.titulo[lang];
  const { videoMedia: video, repo } = project;
  const videoLabels = { play: ui.video.play, pause: ui.video.pause };

  const mainVideo = (
    <VideoPlayer
      src={video.src}
      width={video.width}
      height={video.height}
      logo={project.logo}
      color={project.colorMarca}
      label={`${ui.video.de} ${titulo}`}
      playLabel={videoLabels.play}
      pauseLabel={videoLabels.pause}
    />
  );

  // Contenido en el orden pedido: problema, rol, qué hice, decisión, aclaración, clips, interactivo.
  const body = (
    <div className="min-w-0 space-y-8">
      <Block title={d.problema}>
        <p className="text-lg leading-relaxed">{project.problema[lang]}</p>
      </Block>
      <Block title={d.rol}>
        <p className="leading-relaxed text-ink/90">{project.rol[lang]}</p>
      </Block>
      <Block title={d.queHice}>
        <ul className="space-y-2.5">
          {project.queHice[lang].map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-ink/90">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Block>

      <section className="rounded-2xl border border-accent/50 bg-accent/10 p-5 sm:p-6">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
          <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0l2.1 5.3L16 6l-4.4 3.9L12.9 16 8 12.9 3.1 16l1.3-6.1L0 6l5.9-.7z" />
          </svg>
          {d.decision}
        </h2>
        <p className="text-lg font-medium leading-relaxed">{project.decision[lang]}</p>
      </section>

      {project.aclaracion && (
        <aside className="border-l-2 border-line pl-4 text-sm leading-relaxed text-muted">
          <strong className="font-semibold text-ink/90">{d.aclaracion}: </strong>
          {project.aclaracion[lang]}
        </aside>
      )}

      {project.clipsMedia.length > 0 && (
        <Block title={d.clips}>
          <ClipTabs
            clips={project.clipsMedia.map((c) => ({ ...c, titulo: c.titulo[lang] }))}
            logo={project.logo}
            color={project.colorMarca}
            labels={{ tabs: d.clips, video: ui.video.de, ...videoLabels }}
          />
        </Block>
      )}

      {project.interactivo && project.interactivoSrc && (
        <Block title={d.interactivo}>
          <InteractiveEmbed
            src={project.interactivoSrc}
            title={`${d.interactivo}: ${titulo}`}
            labels={{
              open: project.interactivo.boton[lang],
              close: d.cerrar,
              newTab: d.nuevaPestana,
              note: d.interactivoNota,
            }}
          />
        </Block>
      )}
    </div>
  );

  const hasLinks = repo.tipo !== "ninguno" || project.demo;
  const meta = (
    <div className="space-y-6 rounded-2xl border border-line bg-surface p-5">
      <Block title={d.stack}>
        <TagList items={project.stack} label={d.stack} />
      </Block>
      <Block title={d.estado}>
        <StatusBadge>{project.estado[lang]}</StatusBadge>
      </Block>
      {hasLinks && (
        <Block title={d.enlaces}>
          <div className="flex flex-col items-start gap-3">
            {repo.tipo === "publico" && repo.url && repo.texto && (
              <ButtonLink variant="primary" href={repo.url} target="_blank" rel="noopener">
                {repo.texto[lang]} ↗
              </ButtonLink>
            )}
            {repo.tipo === "privado" && repo.texto && (
              <Link href={`/${lang}/#contacto`} className="text-sm font-medium text-accent underline underline-offset-4">
                {repo.texto[lang]}
              </Link>
            )}
            {project.demo && (
              <ButtonLink href={project.demo} target="_blank" rel="noopener">
                {d.demo} ↗
              </ButtonLink>
            )}
          </div>
        </Block>
      )}
    </div>
  );

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`/${lang}/#proyectos`} className="inline-flex min-h-11 items-center text-sm font-medium text-muted hover:text-accent">
        ← {d.volver}
      </Link>

      <header className="mt-2 flex items-start gap-4">
        <img
          src={project.logo}
          alt={`${ui.logoDe} ${titulo}`}
          width={64}
          height={64}
          className="size-14 shrink-0 rounded-xl border-2 sm:size-16"
          style={{ borderColor: accentFor(project.colorMarca), backgroundColor: project.colorMarca }}
        />
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{titulo}</h1>
          <p className="mt-2 text-muted">{project.resumen[lang]}</p>
        </div>
      </header>

      {video.vertical ? (
        // Video vertical: queda fijo a la izquierda en escritorio; arriba en celular.
        <div className="mt-8 grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">{mainVideo}</div>
          <div className="min-w-0 space-y-8">
            {body}
            {meta}
          </div>
        </div>
      ) : (
        // Video horizontal: a todo el ancho, con el texto abajo y los datos al costado.
        <div className="mt-8">
          {mainVideo}
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
            {body}
            <div className="lg:sticky lg:top-24 lg:self-start">{meta}</div>
          </div>
        </div>
      )}
    </article>
  );
}
