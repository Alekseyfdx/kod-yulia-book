import { useState } from "react";
import { Film, ImageIcon } from "lucide-react";

type Props = {
  image: string;
  video?: string;
  alt: string;
  caption: string;
};

export function ChapterMedia({ image, video, alt, caption }: Props) {
  const [mode, setMode] = useState<"image" | "video">(video ? "image" : "image");

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-bg-elevated">
      <div className="relative aspect-[2/3] w-full bg-bg-subtle sm:aspect-[3/4] md:aspect-[4/5]">
        {mode === "video" && video ? (
          <video
            key={video}
            className="absolute inset-0 h-full w-full object-cover"
            src={video}
            controls
            playsInline
            poster={image}
            preload="metadata"
          />
        ) : (
          <img
            src={image}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-70" />
      </div>
      <figcaption className="flex items-start justify-between gap-3 border-t border-border px-4 py-3">
        <p className="text-sm leading-snug text-fg-muted">{caption}</p>
        {video ? (
          <div className="flex shrink-0 gap-1 rounded-md border border-border bg-bg p-0.5">
            <button
              type="button"
              onClick={() => setMode("image")}
              className={[
                "inline-flex h-8 items-center gap-1.5 rounded px-2.5 font-mono text-[0.65rem] uppercase tracking-wide transition-colors",
                mode === "image"
                  ? "bg-bg-subtle text-accent"
                  : "text-fg-subtle hover:text-fg",
              ].join(" ")}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              кадр
            </button>
            <button
              type="button"
              onClick={() => setMode("video")}
              className={[
                "inline-flex h-8 items-center gap-1.5 rounded px-2.5 font-mono text-[0.65rem] uppercase tracking-wide transition-colors",
                mode === "video"
                  ? "bg-bg-subtle text-accent"
                  : "text-fg-subtle hover:text-fg",
              ].join(" ")}
            >
              <Film className="h-3.5 w-3.5" />
              сцена
            </button>
          </div>
        ) : null}
      </figcaption>
    </figure>
  );
}
