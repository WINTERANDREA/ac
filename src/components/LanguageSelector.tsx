"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import FlagIcon from "./FlagIcon";
import { track } from "@/lib/track";

type Locale = "it" | "en";

export default function LanguageSelector() {
  const locale = useLocale() as Locale;
  const t = useTranslations("languageSelector");
  const router = useRouter();
  const pathname = usePathname();

  // Compute target path replacing/adding the locale segment robustly
  const buildPath = (next: Locale) => {
    if (!pathname) return `/${next}`;
    const url = new URL(window.location.href);
    const search = url.search; // keep querystring/hash
    const hash = url.hash;

    const segments = pathname.split("/"); // ["", "it", "..."]
    const known = new Set<Locale>(["it", "en"]);

    if (segments[1] && known.has(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    return segments.join("/") + search + hash;
  };

  // const switchLanguage = (next: Locale) => {
  //   if (next === locale) return;
  //   // remember choice (1y)
  //   document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
  //   router.replace(buildPath(next));
  // };
  const switchLanguage = (newLocale: "it" | "en") => {
    if (newLocale === locale) return;
    track("language_switch", { from: locale, to: newLocale });
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  // Sliding indicator position (0 -> IT, 1 -> EN)
  const toRight = useMemo(() => (locale === "en" ? 1 : 0), [locale]);

  return (
    <div
      className='langDock'
      aria-label={t("switchTo" + (locale === "it" ? "English" : "Italian"))}
    >
      <div className='langPill' role='radiogroup'>
        <span
          className='indicator'
          style={{ transform: `translateX(${toRight * 100}%)` }}
          aria-hidden
        />
        <button
          type='button'
          role='radio'
          aria-checked={locale === "it"}
          className={`langBtn ${locale === "it" ? "active" : ""}`}
          onClick={() => switchLanguage("it")}
          title={t("italian")}
        >
          <FlagIcon locale='it' size={18} />
          <span className='label'>IT</span>
        </button>
        <button
          type='button'
          role='radio'
          aria-checked={locale === "en"}
          className={`langBtn ${locale === "en" ? "active" : ""}`}
          onClick={() => switchLanguage("en")}
          title={t("english")}
        >
          <FlagIcon locale='en' size={18} />
          <span className='label'>EN</span>
        </button>
      </div>

      <style jsx>{`
        .langDock {
          display: grid;
          place-items: center;
        }
        .langPill {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          padding: 6px;
          border-radius: 999px;
          border: 1px solid #1a1d27;
          background: color-mix(in srgb, #0b0e14 86%, transparent);
          backdrop-filter: saturate(1.1) blur(6px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          overflow: hidden;
        }
        .indicator {
          position: absolute;
          inset: 4px 4px;
          width: calc(50% - 4px);
          border-radius: 999px;
          background: linear-gradient(180deg, var(--accent), #33d7a3);
          opacity: 0.18;
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
          pointer-events: none;
        }
        .langBtn {
          position: relative;
          z-index: 1;
          appearance: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          background: transparent;
          border: 0;
          color: var(--text);
          cursor: pointer;
          border-radius: 999px;
          transition: transform 120ms ease, color 200ms ease, background 200ms;
        }
        .langBtn:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.02);
        }
        .langBtn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(108, 243, 194, 0.25);
        }
        .langBtn.active .label {
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .label {
          font-size: 12px;
          text-transform: uppercase;
          color: var(--text);
          opacity: 0.9;
        }

        @media (prefers-reduced-motion: reduce) {
          .indicator,
          .langBtn {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
