import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Clapperboard, ChevronRight } from "lucide-react";

export function BottomNav({ nextId }: { nextId?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onFilm = pathname === "/";
  const onBook = pathname.startsWith("/ch/");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Разделы"
    >
      <ul className="grid grid-cols-3">
        <li>
          <a
            href="/#film"
            className={
              "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs tracking-wide " +
              (onFilm ? "text-accent" : "text-muted")
            }
          >
            <Clapperboard className="h-5 w-5" />
            Фильм
          </a>
        </li>
        <li>
          <a
            href="/#chapters"
            className={
              "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs tracking-wide " +
              (onBook ? "text-accent" : "text-muted")
            }
          >
            <BookOpen className="h-5 w-5" />
            Главы
          </a>
        </li>
        <li>
          {nextId ? (
            <Link
              to="/ch/$id"
              params={{ id: nextId }}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs tracking-wide text-muted"
            >
              <ChevronRight className="h-5 w-5" />
              Дальше
            </Link>
          ) : (
            <Link
              to="/ch/$id"
              params={{ id: "01" }}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs tracking-wide text-muted"
            >
              <BookOpen className="h-5 w-5" />
              С первой
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
