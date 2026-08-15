import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fmtTime } from "@/data/book";

export const audioBus = new EventTarget();

export function ChapterAudio({
  src,
  title,
  label,
  dock,
}: {
  src: string;
  title: string;
  label: string;
  dock?: boolean;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const idRef = useRef(`a-${src}`);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
    setTime(0);
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setDur(el.duration || 0);
    const onPlay = () => {
      setPlaying(true);
      audioBus.dispatchEvent(new CustomEvent("play", { detail: idRef.current }));
    };
    const onPause = () => setPlaying(false);
    const onStop = () => setPlaying(false);
    const onForeign = (e: Event) => {
      const other = (e as CustomEvent<string>).detail;
      if (other !== idRef.current) el.pause();
    };
    const onAsk = () => {
      if (el.paused) void el.play();
      else el.pause();
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onStop);
    audioBus.addEventListener("play", onForeign);
    audioBus.addEventListener("toggle", onAsk);
    if (Number.isFinite(el.duration) && el.duration > 0) setDur(el.duration);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onStop);
      audioBus.removeEventListener("play", onForeign);
      audioBus.removeEventListener("toggle", onAsk);
    };
  }, [src]);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = rate;
  }, [rate]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const seek = (t: number) => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = t;
    if (el.paused) void el.play();
  };

  const progress = dur > 0 ? Math.min(1, time / dur) : 0;

  return (
    <>
      {dock ? (
        <div
          className="h-20 md:hidden"
          aria-hidden
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        />
      ) : null}
      <div
        className={
          dock
            ? "fixed inset-x-0 bottom-16 z-40 border-t border-line bg-bg/95 px-3 py-2 backdrop-blur-md md:static md:z-20 md:mt-4 md:rounded-md md:border md:bg-surface md:p-4 md:backdrop-blur-none"
            : "rounded-md border border-line bg-surface p-3 md:p-4"
        }
      >
        <audio ref={ref} src={src} preload="metadata" playsInline />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-md border border-line bg-raised text-fg transition-[border-color,transform] duration-150 ease-out hover:border-accent active:scale-[0.96]"
            aria-label={playing ? "Пауза" : "Слушать главу"}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5 fill-fg" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base leading-tight text-fg md:text-lg">{title}</p>
            <p className="mt-0.5 text-xs tabular-nums tracking-wide text-muted">
              {fmtTime(time)} · {dur ? fmtTime(dur) : label}
            </p>
          </div>
          <div className="flex shrink-0 gap-0.5" role="group" aria-label="Темп">
            {[0.9, 1, 1.1].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRate(r)}
                className={
                  "min-h-11 min-w-11 rounded-sm font-sans text-xs tabular-nums " +
                  (rate === r ? "bg-raised text-accent" : "text-muted")
                }
              >
                {r === 1 ? "1×" : `${r}×`}
              </button>
            ))}
          </div>
        </div>
        <div className="relative mt-2">
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
            className="relative z-10 h-8 w-full accent-accent"
            style={{ caretColor: "transparent" }}
            aria-label="Таймлайн главы"
          />
        </div>
      </div>
    </>
  );
}
