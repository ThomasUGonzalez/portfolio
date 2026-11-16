import fs from "node:fs";
import path from "node:path";
import type { ZodType } from "zod";
import { perfilSchema, projectSchema, type Perfil, type ProjectData, type Texto } from "./schema";
import { readMp4Size, type VideoSize } from "./videoMeta";

/**
 * Carga y valida el contenido de /content durante el build.
 * Si falta un campo o un archivo, el build corta con un mensaje claro.
 */

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const PUBLIC = path.join(ROOT, "public");

export type Media = VideoSize & { src: string; vertical: boolean };
export type Project = ProjectData & {
  videoMedia: Media;
  clipsMedia: (Media & { titulo: Texto })[];
  interactivoSrc: string | null;
};

function fail(file: string, problems: string[]): never {
  throw new Error(`\n\n✖ Error en ${file}:\n${problems.map((p) => `   - ${p}`).join("\n")}\n`);
}

function readJson<T>(file: string, schema: ZodType<T>): T {
  const rel = path.relative(ROOT, file);
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    fail(rel, [`el JSON no se puede leer: ${(e as Error).message}`]);
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    fail(
      rel,
      result.error.issues.map((i) => {
        const message = i.message.includes("received undefined") ? "falta este campo" : i.message;
        return `campo "${i.path.join(".") || "(raíz)"}": ${message}`;
      }),
    );
  }
  return result.data;
}

/** Devuelve un problema si el archivo público no existe. */
function missing(publicPath: string, field: string): string[] {
  return fs.existsSync(path.join(PUBLIC, publicPath))
    ? []
    : [`campo "${field}": no existe el archivo public/${publicPath.replace(/^\//, "")}`];
}

function media(file: string): Media {
  const size = readMp4Size(path.join(PUBLIC, "videos", file));
  return { src: `/videos/${file}`, ...size, vertical: size.height > size.width };
}

function loadProjects(): Project[] {
  const dir = path.join(CONTENT, "projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  const projects = files.map((file) => {
    const rel = `content/projects/${file}`;
    const data = readJson(path.join(dir, file), projectSchema);

    const problems = [
      ...(data.id === file.replace(/\.json$/, "")
        ? []
        : [`campo "id": tiene que coincidir con el nombre del archivo (${file})`]),
      ...missing(data.logo, "logo"),
      ...missing(data.portada, "portada"),
      ...missing(`videos/${data.video}`, "video"),
      ...data.clips.flatMap((c, i) => missing(`videos/${c.archivo}`, `clips.${i}.archivo`)),
      ...(data.interactivo ? missing(`interactivos/${data.interactivo.archivo}`, "interactivo.archivo") : []),
    ];
    if (problems.length) fail(rel, problems);

    return {
      ...data,
      videoMedia: media(data.video),
      clipsMedia: data.clips.map((c) => ({ ...media(c.archivo), titulo: c.titulo })),
      interactivoSrc: data.interactivo ? `/interactivos/${data.interactivo.archivo}` : null,
    };
  });

  return projects.sort((a, b) => a.orden - b.orden);
}

function loadPerfil(): Perfil {
  const perfil = readJson(path.join(CONTENT, "perfil.json"), perfilSchema);
  const problems = [...missing(perfil.contacto.cv, "contacto.cv"), ...(perfil.foto ? missing(perfil.foto, "foto") : [])];
  if (problems.length) fail("content/perfil.json", problems);
  return perfil;
}

let cache: { perfil: Perfil; projects: Project[] } | null = null;

function load() {
  // En desarrollo se relee siempre, así los cambios en los JSON se ven al recargar.
  if (!cache || process.env.NODE_ENV !== "production") {
    cache = { perfil: loadPerfil(), projects: loadProjects() };
  }
  return cache;
}

export const getPerfil = () => load().perfil;
export const getProjects = () => load().projects;
export const getProject = (id: string) => load().projects.find((p) => p.id === id);
