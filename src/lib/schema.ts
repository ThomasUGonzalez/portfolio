import { z } from "zod";

/** Texto en los dos idiomas. */
const texto = z.object({ es: z.string().min(1), en: z.string().min(1) }).strict();
/** Lista de textos en los dos idiomas. */
const lista = z
  .object({ es: z.array(z.string().min(1)).min(1), en: z.array(z.string().min(1)).min(1) })
  .strict();

export const projectSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones"),
    orden: z.number(),
    destacado: z.boolean(),
    titulo: texto,
    resumen: texto,
    problema: texto,
    rol: texto,
    queHice: lista,
    decision: texto,
    stack: z.array(z.string().min(1)).min(1),
    estado: texto,
    aclaracion: texto.nullable(),
    logo: z.string().startsWith("/"),
    portada: z.string().startsWith("/"),
    colorMarca: z.string().regex(/^#[0-9a-fA-F]{6}$/, "color en formato #rrggbb"),
    video: z.string().endsWith(".mp4"),
    clips: z.array(z.object({ archivo: z.string().endsWith(".mp4"), titulo: texto }).strict()),
    repo: z
      .object({
        tipo: z.enum(["publico", "privado", "ninguno"]),
        url: z.url().nullable(),
        texto: texto.nullable(),
      })
      .strict()
      .refine((r) => r.tipo !== "publico" || (r.url && r.texto), {
        message: 'un repo "publico" necesita "url" y "texto"',
      })
      .refine((r) => r.tipo !== "privado" || r.texto, {
        message: 'un repo "privado" necesita "texto"',
      }),
    demo: z.url().nullable(),
    interactivo: z
      .object({ archivo: z.string().endsWith(".html"), boton: texto })
      .strict()
      .nullable()
      .optional(),
  })
  .strict();

export const perfilSchema = z
  .object({
    nombre: z.string().min(1),
    nombreCorto: z.string().min(1),
    foto: z.string().startsWith("/").nullable(),
    ubicacion: texto,
    titular: texto,
    bajada: texto,
    sobreMi: lista,
    contacto: z
      .object({
        email: z.email(),
        github: z.url(),
        linkedin: z.url(),
        cv: z.string().startsWith("/"),
      })
      .strict(),
    educacion: z.array(
      z
        .object({
          institucion: z.string().min(1),
          titulo: texto,
          periodo: texto,
          detalle: texto.nullable(),
          promedio: z.string().nullable(),
        })
        .strict(),
    ),
    experiencia: z.array(
      z
        .object({
          puesto: texto,
          lugar: z.string().min(1),
          periodo: texto,
          detalle: texto.nullable(),
        })
        .strict(),
    ),
    skills: z.array(z.object({ area: texto, items: z.array(z.string().min(1)).min(1) }).strict()),
    idiomas: z.array(texto),
  })
  .strict();

export type Texto = z.infer<typeof texto>;
export type ProjectData = z.infer<typeof projectSchema>;
export type Perfil = z.infer<typeof perfilSchema>;
