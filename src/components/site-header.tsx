import { Link } from "@tanstack/react-router";
import { EpubDownloadGate } from "@/components/epub-download-gate";

export function SiteHeader({ active }: { active?: "film" | "book" }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 py-2.5 backdrop-blur-md md:px-8 md:py-3">
      <Link to="/" className="min-w-0">
        <p className="font-display text-xs tracking-[0.32em] text-accent uppercase">Издание · 4.0</p>
        <h1 className="font-display text-lg font-medium leading-tight md:text-2xl">Код Юлия</h1>
      </Link>

      <div className="flex items-center gap-3 md:gap-6">
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a
            href="/#film"
            className={active === "film" ? "text-fg" : "transition-colors duration-150 hover:text-fg"}
          >
            Фильм
          </a>
          <a
            href="/#chapters"
            className={active === "book" ? "text-fg" : "transition-colors duration-150 hover:text-fg"}
          >
            Главы
          </a>
          <a href="/#soundtrack" className="transition-colors duration-150 hover:text-fg">
            Саундтрек
          </a>
        </nav>
        <EpubDownloadGate
          label="EPUB"
          className="flex min-h-10 items-center justify-center gap-1.5 rounded-sm border border-accent px-3 font-display text-xs tracking-[0.16em] text-accent uppercase transition-colors hover:bg-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>
    </header>
  );
}
