import { useState } from "react";
import { BookOpen, Send, X } from "lucide-react";

type TelegramBookGateProps = {
  className?: string;
  label?: string;
};

const TELEGRAM_URL = "https://t.me/neuralbookk";

export function TelegramBookGate({
  className = "",
  label = "Получить книгу",
}: TelegramBookGateProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setIsOpen(true)}>
        <BookOpen aria-hidden="true" className="h-4 w-4" />
        {label}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 flex h-[100dvh] min-h-[100svh] items-end justify-center overflow-y-auto bg-black/80 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:inset-0 sm:items-center sm:p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="telegram-book-gate-title"
            className="w-full max-w-md overflow-hidden rounded-md border border-accent/70 bg-[#0a0a0a] shadow-[0_0_70px_rgba(139,184,176,0.16)]"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-xs tracking-[0.3em] text-accent uppercase">Полная книга</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-sm p-1 text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Закрыть окно"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <h2 id="telegram-book-gate-title" className="font-display text-3xl font-medium text-fg">
                Забрать полную книгу
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Подпишитесь на Telegram-канал: там вас ждёт полная книга и новости о продолжении.
              </p>
              <a
                href={TELEGRAM_URL}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-accent bg-accent px-4 font-display text-sm tracking-[0.12em] text-black uppercase transition-transform hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Send aria-hidden="true" className="h-4 w-4" />
                Подписаться и забрать книгу
              </a>
              <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                Книга выдаётся в Telegram после подписки на канал.
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
