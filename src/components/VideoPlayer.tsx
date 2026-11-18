"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  width: number;
  height: number;
  /** Logo y color que se muestran mientras el video carga. */
  logo: string;
  color: string;
  label: string;
  playLabel: string;
  pauseLabel: string;
  fullscreenLabel: string;
  exitFullscreenLabel: string;
};

/**
 * Video mudo en loop que no descarga nada hasta que hace falta:
 * se reproduce solo al entrar en pantalla y se pausa al salir.
 * Con "prefers-reduced-motion" no hay autoplay: arranca con el botón.
 */
export function VideoPlayer({
  src,
  width,
  height,
  logo,
  color,
  label,
  playLabel,
  pauseLabel,
  fullscreenLabel,
  exitFullscreenLabel,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const pausedByUser = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Pantalla completa: el botón solo aparece si el navegador la permite.
  useEffect(() => {
    const video = videoRef.current as FullscreenVideo | null;
    setCanFullscreen(Boolean(document.fullscreenEnabled || video?.webkitEnterFullscreen));
    const onChange = () => setFullscreen(document.fullscreenElement === boxRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reduceMotion && !pausedByUser.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      video.play().catch(() => {});
    } else {
      pausedByUser.current = true;
      video.pause();
    }
  }

  function toggleFullscreen() {
    const video = videoRef.current as FullscreenVideo | null;
    const box = boxRef.current;
    if (!video || !box) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    // Al pedir pantalla completa, el video arranca aunque todavía no se haya cargado.
    pausedByUser.current = false;
    video.play().catch(() => {});
    if (document.fullscreenEnabled) {
      box.requestFullscreen().catch(() => {});
    } else {
      // iPhone: solo permite pantalla completa con el reproductor propio del sistema.
      video.webkitEnterFullscreen?.();
    }
  }

  const vertical = height > width;

  return (
    <div
      ref={boxRef}
      className="relative mx-auto w-full overflow-hidden rounded-xl border border-line bg-black [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
      style={{
        aspectRatio: `${width} / ${height}`,
        // Los verticales no ocupan más del 72 % del alto de la pantalla.
        maxWidth: vertical ? `min(100%, calc(72svh * ${width} / ${height}))` : undefined,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        width={width}
        height={height}
        muted
        playsInline
        loop
        preload="none"
        aria-label={label}
        onPlaying={() => {
          setReady(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-contain"
      />

      {/* Mientras carga: logo del proyecto sobre su color de marca */}
      <div
        aria-hidden
        className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ${
          ready ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{ backgroundColor: color }}
      >
        <img src={logo} alt="" width={112} height={112} loading="lazy" decoding="async" className="size-28 rounded-2xl" />
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        // Antes de arrancar, el botón va grande y abajo al centro; después, chico en la esquina.
        className={`absolute grid place-items-center rounded-full bg-black/70 text-white backdrop-blur transition-colors hover:bg-black/90 ${
          ready ? "bottom-3 right-3 size-11" : "bottom-5 left-1/2 size-14 -translate-x-1/2"
        }`}
      >
        <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          {playing ? <path d="M4 3h3.5v12H4zM10.5 3H14v12h-3.5z" /> : <path d="M5 2.5v13l10.5-6.5z" />}
        </svg>
      </button>

      {canFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? exitFullscreenLabel : fullscreenLabel}
          title={fullscreen ? exitFullscreenLabel : fullscreenLabel}
          className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-black/70 text-white backdrop-blur transition-colors hover:bg-black/90"
        >
          <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {fullscreen ? (
              <path d="M7 2v5H2M11 2v5h5M7 16v-5H2M11 16v-5h5" />
            ) : (
              <path d="M2 7V2h5M16 7V2h-5M2 11v5h5M16 11v5h-5" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}

/** Safari en iPhone no tiene requestFullscreen; usa este método propio del video. */
type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
