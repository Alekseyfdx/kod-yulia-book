import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookMarked, Clock, Layers, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { BOOK, chapters, SONGS } from "@/data/chapters";
import { ChapterAudio } from "@/components/book/ChapterAudio";
import { TopBar } from "@/components/book/TopBar";
import { TocDrawer } from "@/components/book/TocDrawer";
import { getLastChapter, getProgressPercent, getReadIds } from "@/lib/progress";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [{ title: `${BOOK.title} · электронное издание` }],
  }),
});

function HomePage() {
  const [tocOpen, setTocOpen] = useState(false);
  const [pct, setPct] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const [read, setRead] = useState<number[]>([]);
  const [activeSong, setActiveSong] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setPct(getProgressPercent());
      setLast(getLastChapter());
      setRead(getReadIds());
    };
    refresh();
    window.addEventListener("kod-yulia-progress", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("kod-yulia-progress", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const continueId = last ?? 1;
  const totalAudioMin = chapters.reduce((s, c) => s + c.minutes, 0);

  return (
    <div className="relative min-h-dvh">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-40" />
      <TopBar onOpenToc={() => setTocOpen(true)} tocOpen={tocOpen} />
      <TocDrawer open={tocOpen} onClose={() => setTocOpen(false)} />

      <main className="relative z-10">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0">
            <img
              src="/media/images/cover-kod-yulia.jpg"
              alt=""
              className="h-full w-full object-cover object-[center_20%] opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/70 to-bg" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/50 to-bg/20" />
          </div>

          <div className="relative mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-accent">
                {BOOK.tagline}
              </p>
              <p className="mt-3 text-sm text-fg-muted">
                роман · {BOOK.genre} · {BOOK.year}
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">
                {BOOK.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted text-balance">
                {BOOK.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/chapter/$id"
                  params={{ id: String(continueId) }}
                  className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-5 font-display text-sm font-semibold text-accent-fg no-underline transition-opacity hover:opacity-90"
                >
                  {last ? "Продолжить чтение" : "Начать книгу"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setTocOpen(true)}
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-border-strong bg-bg-elevated/80 px-5 font-display text-sm font-medium text-fg backdrop-blur transition-colors hover:bg-bg-subtle"
                >
                  <BookMarked className="h-4 w-4 text-accent" />
                  Оглавление
                </button>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "глав", value: String(chapters.length) },
                  { label: "аудио", value: `~${totalAudioMin} мин` },
                  { label: "редакция", value: "4.0" },
                  { label: "память", value: `${pct}%` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border bg-bg-elevated/70 px-3 py-3 backdrop-blur"
                  >
                    <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-fg-subtle">
                      {item.label}
                    </dt>
                    <dd className="mt-1 font-display text-lg font-semibold text-fg">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
              <div className="overflow-hidden rounded-xl border border-border-strong shadow-2xl shadow-black/50">
                <img
                  src="/media/images/cover-kod-yulia.jpg"
                  alt="Обложка: Код Юлия"
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
              <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fg-subtle">
                электронное издание · {BOOK.edition}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-bg-elevated/40">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
            <div className="mb-5 flex items-center gap-2">
              <Music className="h-4 w-4 text-accent" />
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
                саундтрек
              </p>
            </div>
            <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              Две песни «Код Юля»
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {SONGS.map((song, i) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => setActiveSong(i)}
                  className={[
                    "rounded-full border px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wide transition-colors",
                    activeSong === i
                      ? "border-accent/40 bg-accent/15 text-accent"
                      : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
                  ].join(" ")}
                >
                  {song.title}
                </button>
              ))}
            </div>
            <div className="mt-4 max-w-xl">
              <ChapterAudio
                key={SONGS[activeSong].src}
                src={SONGS[activeSong].src}
                title={SONGS[activeSong].title}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-accent">
                10 фрагментов
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Оглавление
              </h2>
            </div>
            <div className="hidden items-center gap-2 text-fg-subtle sm:flex">
              <Layers className="h-4 w-4" />
              <span className="font-mono text-xs">карта памяти</span>
            </div>
          </div>

          <ol className="grid gap-3 sm:grid-cols-2">
            {chapters.map((ch) => {
              const done = read.includes(ch.id);
              return (
                <li key={ch.id}>
                  <Link
                    to="/chapter/$id"
                    params={{ id: String(ch.id) }}
                    className="group flex gap-4 rounded-xl border border-border bg-surface/80 p-3 no-underline transition-colors hover:border-border-strong hover:bg-bg-subtle"
                  >
                    <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-bg-subtle sm:h-28 sm:w-20">
                      <img
                        src={ch.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[0.65rem] text-accent">
                          {String(ch.id).padStart(2, "0")}
                        </span>
                        {done ? (
                          <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-accent">
                            прочитано
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-1 truncate font-display text-base font-semibold text-fg sm:text-lg">
                        {ch.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-sm text-fg-muted">
                        {ch.caption}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 font-mono text-[0.65rem] text-fg-subtle">
                        <Clock className="h-3 w-3" />~{ch.minutes} мин · {ch.phase}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <footer className="border-t border-border px-4 py-10 text-center sm:px-6">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-fg-subtle">
            HELIOS Heavy · YU-7 · {BOOK.year}
          </p>
          <p className="mt-2 text-sm text-fg-muted">
            {BOOK.title} — {BOOK.edition}
          </p>
        </footer>
      </main>
    </div>
  );
}
