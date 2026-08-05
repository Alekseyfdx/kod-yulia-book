import { Pause, Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

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

/** Stop every other book audio element so only one track plays. */
function pauseOtherAudio(except: HTMLAudioElement) {
  if (typeof document === "undefined") return;
  for (const node of document.querySelectorAll("audio[data-kod-yulia-audio]")) {
    if (node instanceof HTMLAudioElement && node !== except && !node.paused) {
      node.pause();
    }
  }
}

/** Chapter narration player — no provider / author labels. */
export function ChapterAudio({ src, title }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reactId = useId();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setFailed(false);
    // Force reload when src changes (same element reused without remount).
    el.load();
  }, [src]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => {
      const d = el.duration;
      setDuration(Number.isFinite(d) && d > 0 ? d : 0);
    };
    const onEnded = () => setPlaying(false);
    const onPlay = () => {
      pauseOtherAudio(el);
      setPlaying(true);
      setFailed(false);
    };
    const onPause = () => setPlaying(false);
    const onError = () => {
      setFailed(true);
      setPlaying(false);
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("error", onError);
    };
  }, [src]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el || failed) return;
    if (el.paused) {
      pauseOtherAudio(el);
      try {
        await el.play();
      } catch {
        setFailed(true);
        setPlaying(false);
      }
    } else {
      el.pause();
    }
  };

  const onSeek = (value: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(value)) return;
    const max = Number.isFinite(el.duration) ? el.duration : duration;
    const next = Math.min(Math.max(0, value), max > 0 ? max : 0);
    el.currentTime = next;
    setCurrent(next);
  };

  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrent = Math.min(
    Number.isFinite(current) ? current : 0,
    safeDuration || Number.MAX_SAFE_INTEGER,
  );
  const pct = safeDuration > 0 ? (safeCurrent / safeDuration) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-bg-elevated/90 p-3 shadow-lg shadow-black/20 backdrop-blur sm:p-4">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        data-kod-yulia-audio={reactId}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={failed}
          aria-label={playing ? "Пауза" : "Слушать главу"}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {playing ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
            {failed ? "аудио недоступно" : `аудио · ${title}`}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={safeDuration || 0}
              step={0.1}
              value={safeDuration > 0 ? safeCurrent : 0}
              disabled={failed || safeDuration <= 0}
              onChange={(e) => onSeek(Number(e.target.value))}
              aria-label="Позиция воспроизведения"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-border) ${pct}%)`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[0.65rem] text-fg-subtle">
            <span>{formatTime(safeCurrent)}</span>
            <span>{formatTime(safeDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
