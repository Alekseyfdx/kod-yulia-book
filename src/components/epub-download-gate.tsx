import { useState } from "react";
import { BookOpen, Send, X } from "lucide-react";

type EpubDownloadGateProps = {
  className?: string;
  label?: string;
};

const EPUB_PATH = "/book/kod-yulia.epub";
const EMAIL_STORAGE_KEY = "kod-yulia:epub-email";

function triggerDownload() {
  const link = document.createElement("a");
  link.href = EPUB_PATH;
  link.download = "kod-yulia.epub";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function EpubDownloadGate({
  className = "",
  label = "Скачать EPUB",
}: EpubDownloadGateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  function openGate() {
    setIsComplete(false);
    setIsOpen(true);
  }

  function closeGate() {
    setIsOpen(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    try {
      window.localStorage.setItem(EMAIL_STORAGE_KEY, normalizedEmail);
    } catch {
      // The EPUB remains available when local storage is unavailable or blocked.
    }

    triggerDownload();
    setIsComplete(true);
  }

  return (
    <>
      <button type="button" className={className} onClick={openGate}>
        <BookOpen aria-hidden="true" className="h-4 w-4" />
        {label}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGate();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="epub-gate-title"
            className="w-full max-w-md overflow-hidden rounded-md border border-accent/70 bg-[#0a0a0a] shadow-[0_0_70px_rgba(196,165,116,0.14)]"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-xs tracking-[0.3em] text-accent uppercase">Издание 4.0</span>
              <button
                type="button"
                onClick={closeGate}
                className="rounded-sm p-1 text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Закрыть окно скачивания"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <h2 id="epub-gate-title" className="font-display text-3xl font-medium text-fg">
                Скачать полную книгу
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Оставьте email, чтобы получить файл и узнать о продолжении.
              </p>

              {isComplete ? (
                <div className="mt-6 rounded-sm border border-accent/40 bg-accent/10 px-4 py-4 text-sm leading-relaxed text-fg" role="status">
                  Книга скачивается. Приятного чтения!
                </div>
              ) : (
                <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
                  <label className="block text-xs tracking-[0.18em] text-muted uppercase" htmlFor="epub-email">
                    Ваш email
                  </label>
                  <input
                    id="epub-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="min-h-12 w-full rounded-sm border border-line bg-bg px-3 text-fg placeholder:text-muted/70 focus:border-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-accent bg-accent px-4 font-display text-sm tracking-[0.16em] text-black uppercase transition-transform hover:brightness-110 active:scale-[0.98]"
                  >
                    <Send aria-hidden="true" className="h-4 w-4" />
                    Получить EPUB
                  </button>
                </form>
              )}

              <a
                href="https://t.me/neuralbookk"
                className="mt-4 flex min-h-11 items-center justify-center rounded-sm border border-line px-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Читать в Telegram
              </a>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
