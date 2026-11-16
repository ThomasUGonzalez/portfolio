import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // sitio 100 % estático: genera la carpeta /out
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { globalNotFound: true }, // habilita src/app/global-not-found.tsx (página 404)
};

export default nextConfig;
