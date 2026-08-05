import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-lg font-semibold">Сбой в системе</h1>
      <p className="max-w-md break-words text-sm text-fg-muted">
        {error.message || "Непредвиденная ошибка. Обновите страницу."}
      </p>
      <Link
        to="/"
        className="mt-2 font-mono text-xs uppercase tracking-wider text-accent no-underline"
      >
        ← вернуться к книге
      </Link>
    </main>
  );
}
