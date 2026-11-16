import type { ReactNode } from "react";
import "../globals.css";

// Layout mínimo para "/", que solo redirige al idioma elegido.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
