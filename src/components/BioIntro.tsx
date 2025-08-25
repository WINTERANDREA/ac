"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { track } from "@/lib/track";
import HeroTeaser from "./HeroTeaser";

type Props = { onCtaClick?: () => void };

export default function BioIntro({ onCtaClick }: Props) {
  const t = useTranslations("bioIntro");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const avatar =
    process.env.NEXT_PUBLIC_AVATAR_URL || "/branding/portrait3.png";

  // Animazione apertura/chiusura misurando l'altezza reale
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const h = el.scrollHeight;
    if (open) {
      el.style.maxHeight = h + "px";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    } else {
      el.style.maxHeight = h + "px";
      void el.offsetHeight; // force reflow
      el.style.maxHeight = "0px";
      el.style.opacity = "0";
      el.style.transform = "translateY(-4px)";
    }
  }, [open]);

  // Riallinea l'altezza se cambia il layout (resize/font)
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onResize = () => {
      if (open) el.style.maxHeight = el.scrollHeight + "px";
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  // URL corso/mentorship per locale corrente
  const courseHref =
    locale === "it"
      ? "/it/corso-programmazione-ai-mvp"
      : "/en/programming-ai-mvp-course";

  return (
    <section className='card bioIntro'>
      {/* Colonna testo */}
      <div>
        <span className='kicker'>{t("kicker")}</span>
        <h2 className='bioTitle'>{t("title")}</h2>

        <p className='bioLead'>
          {t.rich("lead", { strong: (chunks) => <strong>{chunks}</strong> })}
        </p>

        {/* Toggle bio */}
        <button
          className='disclosureBtn'
          type='button'
          onClick={() => {
            const newOpen = !open;
            setOpen(newOpen);
            track("bio_toggle", { action: newOpen ? "expand" : "collapse" });
          }}
          aria-expanded={open}
          aria-controls='bio-more'
        >
          <span>{open ? t("showLess") : t("showMore")}</span>
          <svg
            className={`chev ${open ? "rot" : ""}`}
            width='18'
            height='18'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              d='M6 9l6 6 6-6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        {/* Pannello collassabile */}
        <div
          id='bio-more'
          ref={panelRef}
          className='disclosure'
          aria-hidden={!open}
        >
          <p className='bioText'>
            {t.rich("bio1", { strong: (chunks) => <strong>{chunks}</strong> })}
          </p>
          <p className='bioText'>
            {t.rich("bio2", { strong: (chunks) => <strong>{chunks}</strong> })}
          </p>
          <p className='bioText'>
            {t.rich("bio3", { strong: (chunks) => <strong>{chunks}</strong> })}
          </p>
          <p className='bioText'>
            {t.rich("bio4", { strong: (chunks) => <strong>{chunks}</strong> })}
          </p>
          <p className='bioText'>
            {t.rich("bio5", {
              strong: (chunks) => <strong>{chunks}</strong>,
              em: (chunks) => <em>{chunks}</em>,
            })}
          </p>
        </div>
      </div>

      {/* Colonna foto */}
      <div className='bioPhoto' aria-hidden='true'>
        <Image
          src={avatar}
          alt={t("altText")}
          width={720}
          height={540}
          loading='lazy'
        />
      </div>

      {/* Tag */}
      <div className='chipset' style={{ marginTop: 10 }}>
        <span className='chip'>{t("tags.unisg")}</span>
        <span className='chip'>{t("tags.consensys")}</span>
        <span className='chip'>{t("tags.ai")}</span>
        <span className='chip'>{t("tags.tech")}</span>
        <span className='chip'>{t("tags.food")}</span>
      </div>

      {/* CSS scoped solo per il teaser */}
      <style jsx>{`
        .teaser {
          margin: 10px 0 14px;
          border: 1px solid #1a1d27;
          border-radius: 12px;
          background: radial-gradient(
              600px 220px at 0% -10%,
              rgba(108, 243, 194, 0.07),
              transparent 55%
            ),
            radial-gradient(
              500px 180px at 120% 120%,
              rgba(73, 164, 255, 0.07),
              transparent 55%
            ),
            #0b0e14;
          padding: 12px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            border-color 0.2s ease;
        }
        .teaser:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          border-color: #1f2635;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          border: 1px solid #2b3d32;
          background: rgba(108, 243, 194, 0.12);
          white-space: nowrap;
        }
        .spark {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 16px var(--accent);
        }
        .teaserTitle {
          margin: 0;
          font-weight: 800;
          line-height: 1.15;
          font-size: 15px;
        }
        .teaserDesc {
          margin: 2px 0 0;
          color: var(--muted);
          font-size: 13px;
        }
        .cta {
          appearance: none;
          border: 1px solid #1a1d27;
          background: #0b0e14;
          color: var(--text);
          border-radius: 10px;
          padding: 8px 10px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease, border-color 0.15s ease,
            transform 0.08s ease;
        }
        .cta:hover {
          border-color: #2a3347;
        }
        .cta:active {
          transform: translateY(1px);
        }

        @media (max-width: 640px) {
          .teaser {
            grid-template-columns: 1fr auto;
          }
          .badge {
            display: none;
          } /* compatta su mobile */
        }
      `}</style>
    </section>
  );
}
