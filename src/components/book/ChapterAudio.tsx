import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Chapter narration player — no provider / author labels. */
export function ChapterAudio({ src, title }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }, [src]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [src]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
      } catch {
        /* autoplay blocked — user can try again */
      }
    } else {
      el.pause();
    }
  };

  const onSeek = (value: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = value;
    setCurrent(value);
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-bg-elevated/90 p-3 shadow-lg shadow-black/20 backdrop-blur sm:p-4">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Пауза" : "Слушать главу"}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-opacity hover:opacity-90"
        >
          {playing ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
            аудио · {title}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              onChange={(e) => onSeek(Number(e.target.value))}
              aria-label="Позиция воспроизведения"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-[var(--color-accent)]"
              style={{
                background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-border) ${pct}%)`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[0.65rem] text-fg-subtle">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
