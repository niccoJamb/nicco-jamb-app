/**
 * Central, single source of truth for the app's PUBLIC base URL.
 *
 * WHY THIS EXISTS
 * ----------------
 * Email verification (and password-reset / magic-link) emails embed a redirect
 * URL that Supabase sends the user back to. Historically the app computed this
 * from `window.location.origin`, which meant that whenever the app was served
 * from the temporary `*.deploypad.app` preview domain, the verification links
 * pointed there too. After clicking the link the session never refreshed on the
 * REAL custom domain, leaving verified users stuck in the
 * "We still don't see your email as verified" loop.
 *
 * The fix is to ALWAYS build redirect links against the canonical custom domain
 * so that no matter where the app is currently being served, the verification
 * link returns the user to the production origin where their session lives.
 *
 * Override order:
 *   1. VITE_APP_URL build-time env var (set this in deployment if the domain
 *      ever changes — no code edit needed).
 *   2. The canonical custom domain below.
 *
 * IMPORTANT (manual, infrastructure-side steps that CANNOT be done in code):
 *   - The app must actually be deployed/connected to this custom domain (DNS).
 *   - This exact origin (and its /verified, /reset-password paths) must be added
 *     to Supabase → Authentication → URL Configuration → "Site URL" and the
 *     "Redirect URLs" allow-list, otherwise Supabase will refuse to redirect to it.
 */

// The canonical production origin for this app.
export const CANONICAL_APP_URL = 'https://niccojamb.centerkross.com';

/** Returns the public base URL used for all outbound auth redirect links. */
export function getAppUrl(): string {
  const envUrl = (import.meta as any)?.env?.VITE_APP_URL as string | undefined;
  const base = (envUrl && envUrl.trim()) || CANONICAL_APP_URL;
  // Normalise: no trailing slash.
  return base.replace(/\/+$/, '');
}

/** Build an absolute URL on the canonical app origin, e.g. appUrl('/verified'). */
export function appUrl(path = ''): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${getAppUrl()}${p}`;
}
