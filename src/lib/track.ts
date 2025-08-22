// Minimal, privacy-friendly tracker. Works with Plausible and/or GA4 if present.
// No-ops in dev or when envs are missing.

export type TrackProps = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: TrackProps }) => void;
    gtag?: (...args: any[]) => void;
  }
}

/** Fire a custom event */
export function track(event: string, props?: TrackProps) {
  try {
    // Plausible custom events
    if (typeof window !== "undefined" && window.plausible) {
      // Plausible expects {props} wrapper
      window.plausible(event, props ? { props } : undefined);
    }
    // GA4 custom events (optional)
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event, sanitize(props));
    }
  } catch {
    /* swallow */
  }
}

/** Pageview (for SPA navigations) */
export function pageview(url?: string) {
  try {
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("pageview");
    }
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", url ? { page_location: url } : {});
    }
  } catch {
    /* noop */
  }
}

function sanitize(p?: TrackProps) {
  if (!p) return undefined;
  // GA dislikes complex values; stringify booleans and numbers are fine.
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" || typeof v === "number") out[k] = v;
    else if (typeof v === "boolean") out[k] = Number(v);
    else out[k] = String(v);
  }
  return out;
}
