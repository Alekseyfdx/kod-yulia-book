/** Production media lives on GitHub so Vercel deploys stay small. */
export const MEDIA_BASE = import.meta.env.PROD
  ? "https://raw.githubusercontent.com/Alekseyfdx/kod-yulia-book/2b6c682/public"
  : "";

export function asset(path: string) {
  if (!path.startsWith("/")) return path;
  return `${MEDIA_BASE}${path}`;
}
