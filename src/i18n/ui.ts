import type { Lang } from "@/lib/site";

/**
 * Único archivo con los textos de la interfaz (botones, títulos, etiquetas).
 * El contenido (perfil y proyectos) vive en /content.
 */
const es = {
  skip: "Saltar al contenido",
  langName: "Español",
  langSwitch: "Idioma",
  menu: "Menú",
  nav: {
    proyectos: "Proyectos",
    sobreMi: "Sobre mí",
    trayectoria: "Experiencia",
    skills: "Skills",
    contacto: "Contacto",
  },
  hero: { proyectos: "Ver proyectos", cv: "Descargar CV", contacto: "Contacto" },
  proyectos: {
    titulo: "Proyectos",
    bajada: "Qué hice, qué problema resolví y cuál fue mi parte en cada uno.",
    ver: "Ver proyecto",
  },
  detalle: {
    volver: "Proyectos",
    problema: "El problema que resolví",
    rol: "Mi rol",
    queHice: "Qué hice",
    decision: "Decisión clave",
    aclaracion: "Aclaración",
    clips: "Más videos",
    interactivo: "Versión interactiva",
    interactivoNota: "Se carga recién cuando lo abrís.",
    cerrar: "Cerrar",
    nuevaPestana: "Abrir en otra pestaña",
    stack: "Stack",
    estado: "Estado",
    enlaces: "Enlaces",
    demo: "Ver demo",
    otros: "Otros proyectos",
  },
  video: { play: "Reproducir video", pause: "Pausar video", de: "Video:" },
  sobreMi: { titulo: "Sobre mí", ubicacion: "Dónde estoy", idiomas: "Idiomas" },
  trayectoria: {
    titulo: "Experiencia y educación",
    experiencia: "Experiencia",
    educacion: "Educación",
    promedio: "Promedio",
  },
  skills: { titulo: "Skills" },
  contacto: {
    titulo: "Contacto",
    bajada: "¿Tenés una búsqueda abierta o querés saber más de algún proyecto? Escribime.",
    copiar: "Copiar email",
    copiado: "¡Copiado!",
    cv: "Descargar CV",
  },
  notFound: {
    titulo: "No encontré esta página",
    texto: "Puede que el enlace esté mal escrito o que la página ya no exista.",
    volver: "Volver al inicio",
  },
  logoDe: "Logo de",
  fotoDe: "Foto de",
};

const en: typeof es = {
  skip: "Skip to content",
  langName: "English",
  langSwitch: "Language",
  menu: "Menu",
  nav: {
    proyectos: "Projects",
    sobreMi: "About",
    trayectoria: "Experience",
    skills: "Skills",
    contacto: "Contact",
  },
  hero: { proyectos: "View projects", cv: "Download CV (Spanish)", contacto: "Contact" },
  proyectos: {
    titulo: "Projects",
    bajada: "What I built, the problem I solved and my part in each one.",
    ver: "View project",
  },
  detalle: {
    volver: "Projects",
    problema: "The problem I solved",
    rol: "My role",
    queHice: "What I did",
    decision: "Key decision",
    aclaracion: "Note",
    clips: "More videos",
    interactivo: "Interactive version",
    interactivoNota: "It only loads when you open it.",
    cerrar: "Close",
    nuevaPestana: "Open in a new tab",
    stack: "Stack",
    estado: "Status",
    enlaces: "Links",
    demo: "View demo",
    otros: "Other projects",
  },
  video: { play: "Play video", pause: "Pause video", de: "Video:" },
  sobreMi: { titulo: "About me", ubicacion: "Where I am", idiomas: "Languages" },
  trayectoria: {
    titulo: "Experience and education",
    experiencia: "Experience",
    educacion: "Education",
    promedio: "GPA",
  },
  skills: { titulo: "Skills" },
  contacto: {
    titulo: "Contact",
    bajada: "Hiring, or want to know more about one of my projects? Get in touch.",
    copiar: "Copy email",
    copiado: "Copied!",
    cv: "Download CV (Spanish)",
  },
  notFound: {
    titulo: "I couldn't find this page",
    texto: "The link may be mistyped, or the page may no longer exist.",
    volver: "Back to home",
  },
  logoDe: "Logo of",
  fotoDe: "Photo of",
};

export type UI = typeof es;
const ui: Record<Lang, UI> = { es, en };
export const getUI = (lang: Lang) => ui[lang];
