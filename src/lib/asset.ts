/**
 * Public assets are bundled with the deployment and served from the site origin.
 * Keeping this helper preserves the existing call sites while avoiding external media
 * dependencies in both development and production.
 */
export function asset(path: string) {
  return path;
}
