/**
 * Prefixes a public asset path with the site's base path.
 *
 * Hosting at a domain root needs nothing. Hosting under a subpath — a GitHub
 * Pages project site, say — serves everything from /repo-name/, and raw string
 * paths like "/images/arm/upper.png" would 404. Next rewrites its own links
 * and imports, but not strings inside our markup, so those go through here.
 *
 * Set NEXT_PUBLIC_BASE_PATH at build time to match.
 */
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function asset(path: string): string {
  if (!BASE || !path.startsWith("/")) return path;
  return `${BASE}${path}`;
}
