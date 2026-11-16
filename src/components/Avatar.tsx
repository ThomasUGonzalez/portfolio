/** Iniciales de un nombre: "Thomas González" → "TG". */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Foto de perfil. Si perfil.foto es null, muestra las iniciales. */
export function Avatar({ foto, name, alt }: { foto: string | null; name: string; alt: string }) {
  const base = "size-24 rounded-full border-2 border-accent sm:size-28";
  if (foto) {
    return <img src={foto} alt={alt} width={112} height={112} className={`${base} object-cover`} />;
  }
  return (
    <div aria-hidden className={`${base} grid place-items-center bg-surface-2 text-3xl font-bold tracking-tight text-accent sm:text-4xl`}>
      {initialsOf(name)}
    </div>
  );
}
