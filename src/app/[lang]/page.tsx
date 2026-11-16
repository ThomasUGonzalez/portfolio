import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { CopyButton } from "@/components/CopyButton";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { ButtonLink, Section, TagList } from "@/components/ui";
import { getUI } from "@/i18n/ui";
import { getPerfil, getProjects } from "@/lib/content";
import { isLang } from "@/lib/site";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const ui = getUI(lang);
  const perfil = getPerfil();
  const projects = getProjects();
  const { contacto } = perfil;

  return (
    <>
      {/* 1. Inicio */}
      <section aria-labelledby="inicio-titulo" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <Avatar foto={perfil.foto} name={perfil.nombreCorto} alt={`${ui.fotoDe} ${perfil.nombre}`} />
        <h1 id="inicio-titulo" className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {perfil.nombre}
        </h1>
        <p className="mt-3 text-lg font-medium text-accent sm:text-xl">{perfil.titular[lang]}</p>
        <p className="mt-4 max-w-2xl text-lg text-muted">{perfil.bajada[lang]}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink variant="primary" href="#proyectos">
            {ui.hero.proyectos}
          </ButtonLink>
          <ButtonLink href={contacto.cv} download>
            {ui.hero.cv}
          </ButtonLink>
          <ButtonLink href="#contacto">{ui.hero.contacto}</ButtonLink>
        </div>
      </section>

      {/* 2. Proyectos */}
      <Section id="proyectos" title={ui.proyectos.titulo} intro={ui.proyectos.bajada}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Reveal className="h-full">
                <ProjectCard project={project} lang={lang} ui={ui} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Sobre mí */}
      <Section id="sobre-mi" title={ui.sobreMi.titulo}>
        <Reveal className="grid gap-10 md:grid-cols-[1fr_16rem]">
          <div className="max-w-2xl space-y-4 leading-relaxed text-ink/90">
            {perfil.sobreMi[lang].map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </div>
          <dl className="space-y-6 text-sm">
            <div>
              <dt className="font-semibold text-accent">{ui.sobreMi.ubicacion}</dt>
              <dd className="mt-1 text-ink/90">{perfil.ubicacion[lang]}</dd>
            </div>
            <div>
              <dt className="font-semibold text-accent">{ui.sobreMi.idiomas}</dt>
              {perfil.idiomas.map((idioma) => (
                <dd key={idioma.es} className="mt-1 text-ink/90">
                  {idioma[lang]}
                </dd>
              ))}
            </div>
          </dl>
        </Reveal>
      </Section>

      {/* 4. Experiencia y educación */}
      <Section id="experiencia" title={ui.trayectoria.titulo}>
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <h3 className="mb-6 text-lg font-semibold">{ui.trayectoria.experiencia}</h3>
            <Timeline
              items={perfil.experiencia.map((e) => ({
                title: e.puesto[lang],
                subtitle: e.lugar,
                period: e.periodo[lang],
                detail: e.detalle?.[lang],
              }))}
            />
          </Reveal>
          <Reveal>
            <h3 className="mb-6 text-lg font-semibold">{ui.trayectoria.educacion}</h3>
            <Timeline
              items={perfil.educacion.map((e) => ({
                title: e.titulo[lang],
                subtitle: e.institucion,
                period: e.periodo[lang],
                detail: e.detalle?.[lang],
                extra: e.promedio ? `${ui.trayectoria.promedio}: ${e.promedio}` : null,
              }))}
            />
          </Reveal>
        </div>
      </Section>

      {/* 5. Skills */}
      <Section id="skills" title={ui.skills.titulo}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {perfil.skills.map((grupo) => (
            <Reveal key={grupo.area.es} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="mb-3 font-semibold">{grupo.area[lang]}</h3>
              <TagList items={grupo.items} label={grupo.area[lang]} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6. Contacto */}
      <Section id="contacto" title={ui.contacto.titulo} intro={ui.contacto.bajada}>
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a href={`mailto:${contacto.email}`} className="break-all text-lg font-semibold text-accent underline underline-offset-4">
              {contacto.email}
            </a>
            <CopyButton text={contacto.email} label={ui.contacto.copiar} doneLabel={ui.contacto.copiado} />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={contacto.linkedin} target="_blank" rel="noopener">
              LinkedIn ↗
            </ButtonLink>
            <ButtonLink href={contacto.github} target="_blank" rel="noopener">
              GitHub ↗
            </ButtonLink>
            <ButtonLink href={contacto.cv} download>
              {ui.contacto.cv}
            </ButtonLink>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
