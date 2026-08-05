import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { chapters } from "@/data/chapters";
import { getReadIds } from "@/lib/progress";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  currentId?: number;
};

export function TocDrawer({ open, onClose, currentId }: Props) {
  const [read, setRead] = useState<number[]>([]);

  useEffect(() => {
    if (!open) return;
    setRead(getReadIds());
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-bg-elevated shadow-2xl">
        <div className="border-b border-border px-5 py-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
            карта памяти
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-fg">
            Оглавление
          </h2>
          <p className="mt-1 text-sm text-fg-muted">10 глав · антиутопия</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-1">
            {chapters.map((ch) => {
              const done = read.includes(ch.id);
              const active = currentId === ch.id;
              return (
                <li key={ch.id}>
                  <Link
                    to="/chapter/$id"
                    params={{ id: String(ch.id) }}
                    onClick={onClose}
                    className={[
                      "flex items-center gap-3 rounded-lg px-3 py-3 no-underline transition-colors",
                      active
                        ? "bg-bg-subtle text-fg ring-1 ring-accent/30"
                        : "text-fg-muted hover:bg-bg-subtle hover:text-fg",
                    ].join(" ")}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-bg font-mono text-xs tabular-nums text-accent">
                      {String(ch.id).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-sm font-medium text-fg">
                        {ch.title}
                      </span>
                      <span className="block truncate text-xs text-fg-subtle">
                        {ch.phase} · ~{ch.minutes} мин
                      </span>
                    </span>
                    {done ? (
                      <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
