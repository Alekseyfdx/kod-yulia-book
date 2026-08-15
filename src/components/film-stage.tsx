import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BOOK, FILM_BEATS, fmtTime } from "@/data/book";

export function FilmStage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState<number>(BOOK.filmDur);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => setDur(v.duration || BOOK.filmDur);
    const onPlay = () => {
      setPlaying(true);
      setStarted(true);
      setEnded(false);
    };
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      setEnded(true);
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const seek = (t: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = t;
    void v.play();
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const active = [...FILM_BEATS].reverse().find((c) => time >= c.t - 0.12) ?? FILM_BEATS[0];
  const progress = dur > 0 ? Math.min(1, time / dur) : 0;

  return (
    <div>
      <div className="relative overflow-hidden rounded-md border border-line bg-bg">
        <video
          ref={videoRef}
          className="aspect-video w-full bg-bg"
          src={BOOK.filmSrc}
          poster={BOOK.poster}
          playsInline
          preload="metadata"
          controls={false}
          onClick={toggle}
        />

        {!started && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg/55 text-fg transition-opacity duration-300 hover:bg-bg/40"
            aria-label="Смотреть"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent bg-surface/80 text-accent transition-transform duration-150 ease-out active:scale-[0.96]">
              <Play className="ml-1 h-7 w-7 fill-accent" />
            </span>
            <span className="font-display text-sm tracking-[0.28em] text-accent uppercase">
              Смотреть
            </span>
          </button>
        )}

        {started && !ended && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-bg to-transparent p-4 pt-20">
            <p className="font-display text-lg italic text-fg/90 md:text-xl">{active.line}</p>
            <p className="mt-1 text-xs tracking-wider text-muted uppercase">
              Сцена {active.id}. {active.title}
            </p>
          </div>
        )}

        {ended && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg/70 px-6 text-center">
            <p className="font-display text-2xl italic text-fg md:text-3xl">Продолжение следует…</p>
            <a
              href="/ch/01"
              className="min-h-11 rounded-md border border-accent bg-surface px-5 py-2.5 font-display text-sm tracking-[0.2em] text-accent uppercase transition-[transform,background-color] duration-150 ease-out hover:bg-raised active:scale-[0.96]"
            >
              Глава 1. Пробуждение
            </a>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line bg-surface px-3 text-fg transition-[border-color,transform] duration-150 ease-out hover:border-accent active:scale-[0.96]"
          aria-label={playing ? "Пауза" : "Смотреть"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-fg" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
            <div
              className={
                "pointer-events-none absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-accent " +
                (playing ? "pulse-bar" : "")
              }
              style={{ width: `${progress * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={dur || 1}
              step={0.1}
              value={Math.min(time, dur || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              className="relative z-10 w-full accent-accent"
              aria-label="Таймлайн"
            />
          </div>
          <div className="mt-1 flex justify-between font-sans text-xs tabular-nums text-muted">
            <span>{fmtTime(time)}</span>
            <span className="tracking-[0.18em] uppercase">{playing ? "удар" : "1:05"}</span>
            <span>{fmtTime(dur)}</span>
          </div>
        </div>
      </div>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {FILM_BEATS.map((c) => {
          const on = started && active.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => seek(c.t)}
              className={
                "flex min-h-11 w-36 shrink-0 items-stretch gap-2 overflow-hidden rounded-md border text-left transition-[border-color,background-color] duration-150 " +
                (on ? "border-accent bg-raised" : "border-line bg-surface hover:border-muted")
              }
            >
              <img
                src={`/film/stills/${c.id}.jpg`}
                alt=""
                className="h-14 w-20 shrink-0 object-cover"
              />
              <span className="flex min-w-0 flex-col justify-center py-1.5 pr-2">
                <span className="text-xs tabular-nums text-muted">{fmtTime(c.t)}</span>
                <span className="truncate font-display text-sm">
                  {c.id}. {c.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
