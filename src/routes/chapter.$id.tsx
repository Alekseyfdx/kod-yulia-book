import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BOOK, chapters, getChapter } from "@/data/chapters";
import { ChapterAudio } from "@/components/book/ChapterAudio";
import { ChapterMedia } from "@/components/book/ChapterMedia";
import { TopBar } from "@/components/book/TopBar";
import { TocDrawer } from "@/components/book/TocDrawer";
import { markRead } from "@/lib/progress";

export const Route = createFileRoute("/chapter/$id")({
  component: ChapterPage,
  loader: ({ params }) => {
    const id = Number(params.id);
    const chapter = getChapter(id);
    if (!chapter) throw notFound();
    return { chapter };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Глава ${loaderData.chapter.id}. ${loaderData.chapter.title} · ${BOOK.title}`
          : BOOK.title,
      },
    ],
  }),
});

function isSystemLine(line: string) {
  return (
    line.includes("Ограничение активной") ||
    line.includes("Обратная загрузка") ||
    line.includes("Связь с ядром") ||
    line.includes("Предупреждение:") ||
    line.includes("Идентификатор носителя") ||
    line.includes("Аномалия:") ||
    line.includes("КРИТИЧНО:") ||
    line.includes("Стабильность носителя") ||
    line.includes("Рекомендация:") ||
    line.includes("Протокол перезагрузки") ||
    line.startsWith("Статус:") ||
    line.startsWith("Модель:")
  );
}

function isDialog(line: string) {
  return line.startsWith("— ");
}

function ChapterPage() {
  const { chapter } = Route.useLoaderData();
  const [tocOpen, setTocOpen] = useState(false);
  const [marked, setMarked] = useState(false);

  const idx = chapters.findIndex((c) => c.id === chapter.id);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  useEffect(() => {
    markRead(chapter.id);
    setMarked(true);
    window.dispatchEvent(new Event("kod-yulia-progress"));
    window.scrollTo(0, 0);
  }, [chapter.id]);

  const label = useMemo(
    () => `гл. ${String(chapter.id).padStart(2, "0")}/10 · ${chapter.title}`,
    [chapter.id, chapter.title],
  );

  return (
    <div className="relative min-h-dvh">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-30" />
      <TopBar
        chapterLabel={label}
        onOpenToc={() => setTocOpen(true)}
        tocOpen={tocOpen}
      />
      <TocDrawer
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        currentId={chapter.id}
      />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fg-subtle">
          <Link to="/" className="text-accent no-underline hover:opacity-80">
            книга
          </Link>
          <span>/</span>
          <span>глава {String(chapter.id).padStart(2, "0")}</span>
          <span className="text-border-strong">·</span>
          <span>{chapter.phase}</span>
          {marked ? (
            <span className="ml-auto inline-flex items-center gap-1 normal-case tracking-normal text-accent">
              <CheckCircle2 className="h-3.5 w-3.5" />
              сохранено в память
            </span>
          ) : null}
        </div>

        <header className="mb-6 max-w-2xl">
          <p className="font-mono text-sm text-accent">
            {String(chapter.id).padStart(2, "0")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            {chapter.title}
          </h1>
          <p className="mt-3 text-lg text-fg-muted">{chapter.subtitle}</p>
        </header>

        <div className="mb-8 lg:sticky lg:top-16 lg:z-20">
          <ChapterAudio
            key={chapter.audio}
            src={chapter.audio}
            title={`глава ${String(chapter.id).padStart(2, "0")}`}
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="lg:sticky lg:top-36">
            <ChapterMedia
              image={chapter.image}
              video={chapter.video}
              alt={`Иллюстрация: ${chapter.title}`}
              caption={chapter.caption}
            />
          </div>

          <article className="book-prose max-w-prose">
            {chapter.body.map((para, i) => {
              if (isSystemLine(para)) {
                return (
                  <p key={i} className="system whitespace-pre-line">
                    {para}
                  </p>
                );
              }
              if (isDialog(para)) {
                return (
                  <p key={i} className="dialog">
                    {para}
                  </p>
                );
              }
              return <p key={i}>{para}</p>;
            })}

            <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">
              /// конец фрагмента {String(chapter.id).padStart(2, "0")}
            </p>
          </article>
        </div>

        <nav className="mt-14 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-stretch sm:justify-between">
          {prev ? (
            <Link
              to="/chapter/$id"
              params={{ id: String(prev.id) }}
              className="flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 no-underline transition-colors hover:border-border-strong hover:bg-bg-subtle"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-accent" />
              <span className="min-w-0">
                <span className="block font-mono text-[0.6rem] uppercase tracking-wider text-fg-subtle">
                  предыдущая
                </span>
                <span className="block truncate font-display text-sm font-medium text-fg">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next ? (
            <Link
              to="/chapter/$id"
              params={{ id: String(next.id) }}
              className="flex min-h-14 flex-1 items-center justify-end gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 no-underline transition-colors hover:bg-accent/15"
            >
              <span className="min-w-0 text-right">
                <span className="block font-mono text-[0.6rem] uppercase tracking-wider text-accent">
                  следующая
                </span>
                <span className="block truncate font-display text-sm font-medium text-fg">
                  {next.title}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
            </Link>
          ) : (
            <Link
              to="/"
              className="flex min-h-14 flex-1 items-center justify-end gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 no-underline transition-colors hover:bg-accent/15"
            >
              <span className="min-w-0 text-right">
                <span className="block font-mono text-[0.6rem] uppercase tracking-wider text-accent">
                  финал
                </span>
                <span className="block truncate font-display text-sm font-medium text-fg">
                  Вернуться на обложку
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}
