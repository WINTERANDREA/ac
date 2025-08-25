"use client";

import { useTranslations } from "next-intl";
import { track } from "@/lib/track";

type Props = {
  onCtaClick?: () => void;
  anchorHref?: string; // es. "#mvp-sprint" (fallback se non passi onCtaClick)
};

export default function HeroTeaser({
  onCtaClick,
  anchorHref = "#mvp-sprint",
}: Props) {
  const t = useTranslations("homePage.teaser");

  const onClick = () => {
    track("teaser_cta_click", { location: "hero", plan: "mvp_sprint" });
    if (onCtaClick) onCtaClick();
    else if (anchorHref) {
      const el = document.querySelector(anchorHref);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className='heroTeaser' role='region' aria-labelledby='teaserTitle'>
      <div className='halo' aria-hidden />
      <div className='head'>
        <span className='badge'>{t("badge")}</span>
        <h3 id='teaserTitle' className='title'>
          {t("title")}
        </h3>
        <p className='subtitle'>{t("subtitle")}</p>
      </div>

      <ul className='bullets'>
        {t.raw("bullets").map((b: string) => (
          <li key={b}>
            <svg width='16' height='16' viewBox='0 0 24 24' aria-hidden>
              <path
                d='M20 6L9 17l-5-5'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className='chips'>
        {t.raw("chips").map((c: string) => (
          <span className='chip' key={c}>
            {c}
          </span>
        ))}
      </div>

      <div className='ctaRow'>
        <button className='ctaBtn' type='button' onClick={onClick}>
          {t("cta")}
        </button>
        <span className='help'>{t("help")}</span>
      </div>

      <style jsx>{`
        .heroTeaser {
          position: relative;
          isolation: isolate;
          border-radius: 16px;
          padding: 16px;
          background: linear-gradient(
              180deg,
              color-mix(in srgb, var(--panel) 92%, transparent),
              #0b0e14
            ),
            radial-gradient(
              1200px 400px at 100% 0%,
              color-mix(in srgb, var(--accent) 12%, transparent) 0%,
              transparent 60%
            );
          border: 1px solid #1a1d27;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          overflow: hidden;
        }
        .halo {
          position: absolute;
          inset: -1px;
          border-radius: 18px;
          padding: 1px;
          background: conic-gradient(
            from 120deg,
            transparent,
            color-mix(in srgb, var(--accent) 45%, transparent),
            transparent 40%
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0.25;
        }
        .head {
          display: grid;
          gap: 6px;
          margin-bottom: 8px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 999px;
          color: var(--text);
          background: linear-gradient(180deg, var(--accent), #33d7a3);
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
        }
        .title {
          margin: 0;
          font-size: clamp(18px, 2.2vw, 22px);
          font-weight: 900;
          line-height: 1.15;
        }
        .subtitle {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
        }
        .bullets {
          list-style: none;
          padding: 0;
          margin: 10px 0 10px;
          display: grid;
          gap: 8px;
        }
        .bullets li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text);
          font-size: 14px;
        }
        .bullets svg {
          flex: 0 0 auto;
          opacity: 0.9;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 6px 0 12px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid #1a1d27;
          background: #0b0e14;
          color: var(--muted);
        }
        .ctaRow {
          display: grid;
          gap: 6px;
        }
        .ctaBtn {
          appearance: none;
          border: 0;
          cursor: pointer;
          border-radius: 12px;
          padding: 10px 14px;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #08110e;
          background: linear-gradient(180deg, var(--accent), #33d7a3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          transition: transform 0.12s ease, filter 0.2s ease;
        }
        .ctaBtn:hover {
          transform: translateY(-1px);
          filter: saturate(1.05);
        }
        .ctaBtn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px
            color-mix(in srgb, var(--accent) 35%, transparent);
        }
        .help {
          color: var(--muted);
          font-size: 12px;
        }

        /* Posizionamento “migliore” nella hero su viewport larghi:
           lo ancoriamo in alto a destra ma rientra nello stacking del container */
        :global(.hero) {
          position: relative;
        }
        @media (min-width: 980px) {
          .heroTeaser {
            position: absolute;
            top: 16px;
            right: 16px;
            width: min(380px, 36vw);
          }
        }
        /* Su mobile/tablet rimane nel flow: usa un wrapper per lo spacing */
        @media (max-width: 979px) {
          .heroTeaser {
            margin-top: 12px;
          }
        }
      `}</style>
    </section>
  );
}
