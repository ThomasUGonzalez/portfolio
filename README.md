# Portfolio de Thomas Ulises González

Sitio estático (Next.js + TypeScript + Tailwind) que se arma solo a partir de los JSON de `content/`.

**Sitio publicado:** https://portfolio-tan-seven-93zacy8oyr.vercel.app

Repositorio: https://github.com/ThomasUGonzalez/portfolio

## Correrlo en tu computadora

Necesitás Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. Para generar la versión final (carpeta `out/`):

```bash
npm run build
```

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Tus datos (nombre, sobre mí, experiencia, educación, skills) | `content/perfil.json` |
| Proyectos (un archivo por proyecto) | `content/projects/*.json` |
| Videos | `public/videos/` |
| Logos | `public/logos/` |
| Páginas interactivas (HTML) | `public/interactivos/` |
| CV | `public/CV-Thomas-Gonzalez.pdf` |
| Textos de botones, títulos y etiquetas (ES/EN) | `src/i18n/ui.ts` |
| Colores y tipografía | `src/app/globals.css` |

## Agregar un proyecto nuevo

No hay que tocar ningún componente.

1. Copiá el logo cuadrado (ideal 512×512 px) a `public/logos/mi-proyecto.png`.
2. Copiá los videos `.mp4` a `public/videos/`. Para que pesen poco y no tengan audio:

   ```bash
   ffmpeg -i original.mp4 -an -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart public/videos/mi-proyecto-demo.mp4
   ```

   El sitio detecta solo si cada video es vertical u horizontal.
3. Creá `content/projects/mi-proyecto.json` (el `id` tiene que ser igual al nombre del archivo):

   ```json
   {
     "id": "mi-proyecto",
     "orden": 4,
     "destacado": false,
     "titulo": { "es": "Título", "en": "Title" },
     "resumen": { "es": "Resumen de una línea.", "en": "One-line summary." },
     "problema": { "es": "Qué problema resolví.", "en": "The problem I solved." },
     "rol": { "es": "Cuál fue mi rol.", "en": "What my role was." },
     "queHice": {
       "es": ["Primera cosa.", "Segunda cosa."],
       "en": ["First thing.", "Second thing."]
     },
     "decision": { "es": "La decisión clave.", "en": "The key decision." },
     "stack": ["TypeScript", "PostgreSQL"],
     "estado": { "es": "En desarrollo", "en": "In development" },
     "aclaracion": null,
     "logo": "/logos/mi-proyecto.png",
     "portada": "/logos/mi-proyecto.png",
     "colorMarca": "#1e88e5",
     "video": "mi-proyecto-demo.mp4",
     "clips": [
       { "archivo": "mi-proyecto-clip.mp4", "titulo": { "es": "Un detalle", "en": "A detail" } }
     ],
     "repo": {
       "tipo": "publico",
       "url": "https://github.com/usuario/repo",
       "texto": { "es": "Ver código en GitHub", "en": "View code on GitHub" }
     },
     "demo": null
   }
   ```

4. Corré `npm run build`. Si falta un campo o un archivo, el build corta y dice cuál.

Notas sobre los campos:

- `orden`: posición en la grilla (de menor a mayor).
- `clips`: puede ser `[]`.
- `repo.tipo`: `"publico"` muestra el botón; `"privado"` muestra el texto con link a Contacto (`url: null`); `"ninguno"` no muestra nada (`url` y `texto` en `null`).
- `demo`: una URL muestra el botón "Ver demo"; `null` no muestra nada.
- `interactivo` (opcional): `{ "archivo": "pagina.html", "boton": { "es": "Probalo vos", "en": "Try it yourself" } }`, con el HTML en `public/interactivos/`.
- `colorMarca`: si casi no contrasta con el fondo oscuro, el borde usa un gris neutro.

Experiencia, educación y skills funcionan igual: agregá un elemento a la lista correspondiente en `content/perfil.json`.

## Cambiar textos, foto y CV

- **Textos**: editá `content/perfil.json` o el JSON del proyecto. Los textos de la interfaz están en `src/i18n/ui.ts`.
- **Foto**: copiala a `public/` (por ejemplo `public/foto.jpg`, cuadrada) y en `perfil.json` poné `"foto": "/foto.jpg"`. Con `null` se muestran las iniciales.
- **CV**: reemplazá `public/CV-Thomas-Gonzalez.pdf` con el mismo nombre. Si cambia el nombre, actualizá `contacto.cv` en `perfil.json`.
- **Promedio**: se muestra solo si `promedio` no es `null`.

## Subirlo a GitHub

1. Creá un repositorio vacío en https://github.com/new (sin README).
2. En esta carpeta:

   ```bash
   git remote add origin https://github.com/ThomasUGonzalez/NOMBRE-DEL-REPO.git
   git push -u origin main
   ```

## Desplegarlo gratis en Vercel

1. Entrá a https://vercel.com con tu cuenta de GitHub.
2. "Add New… → Project" y elegí el repositorio.
3. Dejá todo como viene (detecta Next.js) y tocá "Deploy".

Cada `git push` a `main` vuelve a desplegar el sitio (el archivo `vercel.json` desactiva las "URLs limpias" para que la página interactiva de Nissi, que es un `.html`, se sirva bien). La URL del sitio se usa sola para el sitemap y la imagen al compartir; si después usás un dominio propio, agregá en Vercel la variable de entorno `NEXT_PUBLIC_SITE_URL` (por ejemplo `https://midominio.com`).
