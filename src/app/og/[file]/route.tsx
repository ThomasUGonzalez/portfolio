import { ImageResponse } from "next/og";
import { initialsOf } from "@/components/Avatar";
import { getPerfil } from "@/lib/content";
import { isLang, langs } from "@/lib/site";

// Imagen para compartir (Open Graph / Twitter), generada en el build con nombre y titular:
// /og/es.png y /og/en.png
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => langs.map((lang) => ({ file: `${lang}.png` }));

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const lang = (await params).file.replace(".png", "");
  if (!isLang(lang)) return new Response("Not found", { status: 404 });
  const perfil = getPerfil();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0f14",
          color: "#e6edf3",
          borderBottom: "16px solid #22d3ee",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            border: "4px solid #22d3ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 52,
            fontWeight: 700,
            color: "#22d3ee",
          }}
        >
          {initialsOf(perfil.nombreCorto)}
        </div>
        <div style={{ marginTop: 40, fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{perfil.nombre}</div>
        <div style={{ marginTop: 20, fontSize: 36, color: "#22d3ee" }}>{perfil.titular[lang]}</div>
        <div style={{ marginTop: 20, fontSize: 30, color: "#a3b3c2" }}>{perfil.bajada[lang]}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
