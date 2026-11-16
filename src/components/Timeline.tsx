export type TimelineItem = {
  title: string;
  subtitle: string;
  period: string;
  detail?: string | null;
  extra?: string | null;
};

/** Línea de tiempo vertical simple (experiencia, educación). */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-8 border-l border-line pl-6">
      {items.map((item) => (
        <li key={item.title + item.period} className="relative">
          <span aria-hidden className="absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full bg-accent ring-4 ring-bg" />
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{item.period}</p>
          <h4 className="mt-1 font-semibold leading-snug">{item.title}</h4>
          <p className="text-sm text-muted">{item.subtitle}</p>
          {item.detail && <p className="mt-2 text-sm leading-relaxed text-ink/85">{item.detail}</p>}
          {item.extra && <p className="mt-2 text-sm font-medium text-ink">{item.extra}</p>}
        </li>
      ))}
    </ol>
  );
}
