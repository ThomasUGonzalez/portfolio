import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { langs, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...getProjects().map((p) => `proyectos/${p.id}/`)];
  return langs.flatMap((lang) => paths.map((path) => ({ url: `${siteUrl}/${lang}/${path}` })));
}
