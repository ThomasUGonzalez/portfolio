"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { VideoPlayer } from "./VideoPlayer";

type Clip = { src: string; width: number; height: number; titulo: string };

/** Clips secundarios como pestañas: solo se monta (y descarga) el clip activo. */
export function ClipTabs({
  clips,
  logo,
  color,
  labels,
}: {
  clips: Clip[];
  logo: string;
  color: string;
  labels: {
    tabs: string;
    play: string;
    pause: string;
    video: string;
    fullscreen: string;
    exitFullscreen: string;
  };
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const clip = clips[active];

  function onKeyDown(e: KeyboardEvent) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + clips.length) % clips.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={labels.tabs} onKeyDown={onKeyDown} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
        {clips.map((c, i) => (
          <button
            key={c.src}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`clip-tab-${i}`}
            aria-selected={i === active}
            aria-controls="clip-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`min-h-11 shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              i === active
                ? "border-accent bg-accent/10 text-accent"
                : "border-line bg-surface text-muted hover:text-ink"
            }`}
          >
            {c.titulo}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="clip-panel" aria-labelledby={`clip-tab-${active}`}>
        <VideoPlayer
          key={clip.src}
          src={clip.src}
          width={clip.width}
          height={clip.height}
          logo={logo}
          color={color}
          label={`${labels.video} ${clip.titulo}`}
          playLabel={labels.play}
          pauseLabel={labels.pause}
          fullscreenLabel={labels.fullscreen}
          exitFullscreenLabel={labels.exitFullscreen}
        />
      </div>
    </div>
  );
}
