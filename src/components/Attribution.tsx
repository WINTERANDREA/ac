// components/Attribution.tsx
"use client";
import { useEffect } from "react";

function parse(search: string) {
  const p = new URLSearchParams(search);
  const pick = (k: string) => p.get(k) || undefined;
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_term: pick("utm_term"),
    utm_content: pick("utm_content"),
    gclid: pick("gclid"),
    fbclid: pick("fbclid"),
  };
}

export default function Attribution() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const has = document.cookie.includes("ac_attrib=");
    if (has) return; // keep first-touch
    const data = {
      ...parse(window.location.search),
      referrer: document.referrer || undefined,
      landing_page: window.location.href,
      first_visit_at: new Date().toISOString(),
    };
    document.cookie = `ac_attrib=${encodeURIComponent(
      JSON.stringify(data)
    )}; path=/; max-age=7776000; SameSite=Lax`; // 90 days
  }, []);
  return null;
}
