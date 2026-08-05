import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BOOK } from "@/data/chapters";

export function BookNotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-30" />
      <div className="relative z-10 max-w-md">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent">
          <BookOpen className="h-5 w-5" />
        </span>
        <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
          404 · фрагмент не найден
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fg">
          Нет такой главы
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          В {BOOK.title} десять фрагментов. Этот путь не ведёт ни к одному из
          них — или файл ещё не загружен в память.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-4 font-display text-sm font-semibold text-accent-fg no-underline"
          >
            <ArrowLeft className="h-4 w-4" />
            На обложку
          </Link>
          <Link
            to="/chapter/$id"
            params={{ id: "1" }}
            className="inline-flex h-11 items-center rounded-lg border border-border-strong bg-bg-elevated px-4 font-display text-sm font-medium text-fg no-underline"
          >
            Глава 01
          </Link>
        </div>
      </div>
    </main>
  );
}
