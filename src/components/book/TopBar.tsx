import { Link } from "@tanstack/react-router";
import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getProgressPercent } from "@/lib/progress";
import { BOOK } from "@/data/chapters";

type Props = {
  chapterLabel?: string;
  onOpenToc?: () => void;
  tocOpen?: boolean;
};

export function TopBar({ chapterLabel, onOpenToc, tocOpen }: Props) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    setPct(getProgressPercent());
    const onStorage = () => setPct(getProgressPercent());
    window.addEventListener("storage", onStorage);
    window.addEventListener("kod-yulia-progress", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("kod-yulia-progress", onStorage);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 text-fg no-underline transition-opacity hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg-elevated text-accent">
            <BookOpen className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-fg-muted">
              {BOOK.title}
            </span>
            {chapterLabel ? (
              <span className="block truncate font-mono text-[0.65rem] text-fg-subtle">
                {chapterLabel}
              </span>
            ) : null}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-fg-subtle">
              память
            </span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-[0.7rem] tabular-nums text-accent">
              {pct}%
            </span>
          </div>

          {onOpenToc ? (
            <button
              type="button"
              onClick={onOpenToc}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg transition-colors hover:border-border-strong hover:bg-bg-subtle"
              aria-label={tocOpen ? "Закрыть оглавление" : "Оглавление"}
            >
              {tocOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
