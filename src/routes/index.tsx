import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { FilmStage } from "@/components/film-stage";
import { SiteHeader } from "@/components/site-header";
import { ChapterAudio } from "@/components/chapter-audio";
import { BOOK, CHAPTERS, SONGS } from "@/data/book";

export const Route = createFileRoute("/")({ component: Edition });

function Edition() {
  return (
    <main className="min-h-dvh bg-bg pb-24 text-fg md:pb-0">
      <SiteHeader active="film" />

      <section id="film" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-4 md:scroll-mt-20 md:px-8 md:py-6">
        <p className="font-display text-xs tracking-[0.32em] text-accent uppercase">
          Короткий метр · Удар · 1:05
        </p>
        <h2 className="mt-1 font-display text-2xl font-medium text-balance md:mt-2 md:text-4xl">
          Сначала — удар
        </h2>
        <p className="mt-2 hidden max-w-2xl text-sm leading-relaxed text-pretty text-muted md:mt-3 md:block">
          Двенадцать ударов по пять секунд. Одно лицо. Русский. Потом — десять глав
          книги, фото и голос, который читает до конца.
        </p>
        <div className="mt-4 md:mt-6">
          <FilmStage />
        </div>
      </section>

      <section
        id="chapters"
        className="mx-auto max-w-6xl scroll-mt-16 border-t border-line px-4 py-8 md:scroll-mt-20 md:px-8 md:py-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.28em] text-muted uppercase">
              {BOOK.edition} · {BOOK.author}
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium md:text-4xl">Десять глав</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
              {BOOK.subtitle}
            </p>
          </div>
          <Link
            to="/ch/$id"
            params={{ id: "01" }}
            className="min-h-12 rounded-md border border-accent px-5 py-3 font-display text-sm tracking-[0.18em] text-accent uppercase transition-[transform,background-color] duration-150 hover:bg-raised active:scale-[0.96]"
          >
            Слушать с первой
          </Link>
        </div>

        <ol className="mt-6 grid gap-3 md:mt-8 md:grid-cols-2 md:gap-4">
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <Link
                to="/ch/$id"
                params={{ id: c.id }}
                className="group flex flex-col overflow-hidden rounded-md border border-line bg-surface transition-[border-color] duration-150 hover:border-accent sm:flex-row sm:items-stretch"
              >
                <img
                  src={c.image}
                  alt=""
                  className="aspect-video w-full object-cover object-top sm:h-40 sm:w-36 sm:shrink-0 sm:aspect-auto"
                />
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3 sm:p-4">
                  <span className="text-xs tabular-nums tracking-[0.2em] text-muted uppercase">
                    Глава {c.id} · {c.audioTime}
                  </span>
                  <span className="font-display text-xl leading-tight md:text-2xl">{c.title}</span>
                  <span className="text-sm text-pretty text-muted">{c.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="soundtrack"
        className="mx-auto max-w-6xl scroll-mt-16 border-t border-line px-4 py-8 md:scroll-mt-20 md:px-8 md:py-10"
      >
        <p className="font-display text-xs tracking-[0.28em] text-muted uppercase">Саундтрек</p>
        <h2 className="mt-2 font-display text-3xl font-medium">Две песни «Код Юля»</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SONGS.map((s) => (
            <ChapterAudio key={s.id} src={s.src} title={s.title} label={s.time + " · оригинал"} />
          ))}
        </div>
      </section>

      <footer className="border-t border-line px-4 py-10 text-center md:px-8">
        <p className="font-display text-2xl italic">Продолжение следует…</p>
        <p className="mt-3 text-sm text-muted">
          {BOOK.title} · {BOOK.author} · {BOOK.edition}
        </p>
      </footer>
      <BottomNav />
    </main>
  );
}
