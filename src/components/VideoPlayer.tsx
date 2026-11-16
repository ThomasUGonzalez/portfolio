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
};

/**
 * Video mudo en loop que no descarga nada hasta que hace falta:
 * se reproduce solo al entrar en pantalla y se pausa al salir.
 * Con "prefers-reduced-motion" no hay autoplay: arranca con el botón.
 */
export function VideoPlayer({ src, width, height, logo, color, label, playLabel, pauseLabel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

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

  const vertical = height > width;

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-xl border border-line bg-black"
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
    </div>
  );
}
