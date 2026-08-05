import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import appCss from "../styles.css?url";
import { BOOK } from "@/data/chapters";

const APP_NAME = BOOK.title;
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host
  ? `https://og.grok.me/v1/card.png?host=${encodeURIComponent(host)}&title=${encodeURIComponent(APP_NAME)}`
  : undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        name: "description",
        content: BOOK.subtitle,
      },
      { title: `${BOOK.title} · ${BOOK.edition}` },
      { name: "theme-color", content: "#07080c" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:title", content: APP_NAME },
            { property: "og:description", content: BOOK.subtitle },
          ]
        : []),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;0,7..72,700;1,7..72,400&family=Unbounded:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/media/images/cover-kod-yulia.jpg", type: "image/jpeg" },
    ],
  }),
  component: RootShell,
});

function RootShell() {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
