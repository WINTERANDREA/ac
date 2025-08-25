"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

type Item = {
  id: string;
  icon: string; // emoji/simple glyph per pulizia
  kicker: string; // micro label
  title: string; // big title
  desc: string; // breve paragrafo
  bullets: string[]; // 3–5 punti chiave
  tags: string[]; // chip
  cta?: string; // testo bottone
};

export default function ServicesPro({
  onCtaClick,
  initialId,
}: {
  onCtaClick?: () => void;
  initialId?: string;
}) {
  const t = useTranslations("servicesPro");
  const items: Item[] = t.raw("items");
  const [active, setActive] = useState<string>(
    initialId ?? items[0]?.id ?? "dev"
  );
  useEffect(() => {
    if (initialId) setActive(initialId);
  }, [initialId]);

  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <section className='svcPro card' aria-label={t("ariaLabel")}>
      <header className='svcHead'>
        <div className='svcKicker'>{t("kicker")}</div>
        <h3 className='svcTitle'>{t("title")}</h3>
      </header>

      <div className='svcLayout'>
        {/* Colonna sinistra: menu */}
        <nav className='svcMenu' aria-label={t("menuLabel")}>
          {items.map((it) => {
            const isActive = it.id === active;
            return (
              <button
                key={it.id}
                className={`svcTab ${isActive ? "active" : ""}`}
                onClick={() => setActive(it.id)}
                type='button'
                aria-current={isActive ? "page" : undefined}
              >
                <span className='ico' aria-hidden>
                  {it.icon}
                </span>
                <div className='tabText'>
                  <span className='kicker'>{it.kicker}</span>
                  <span className='label'>{it.title}</span>
                </div>
                <span className='chev' aria-hidden>
                  ›
                </span>
              </button>
            );
          })}
        </nav>

        {/* Colonna destra: dettaglio */}
        <article className='svcDetail' aria-live='polite'>
          <div className='detailHead'>
            <div className='badge'>{current.kicker}</div>
            <h4 className='detailTitle'>{current.title}</h4>
            <p className='detailDesc'>{current.desc}</p>
          </div>

          <ul className='detailList'>
            {current.bullets.map((b) => (
              <li key={b} className='detailItem'>
                <span className='dot' aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className='chipset' aria-label={t("stackLabel")}>
            {current.tags.map((tg) => (
              <span key={tg} className='chip tag'>
                {tg}
              </span>
            ))}
          </div>

          <div className='cta'>
            <button className='btn' onClick={onCtaClick}>
              {current.cta ?? t("defaultCta")}
            </button>
            <span className='help'>{t("ctaHelp")}</span>
          </div>
        </article>
      </div>

      <style jsx>{`
        .svcHead {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 10px;
        }
        .svcKicker {
          font-size: 12px;
          font-weight: 700;
          color: var(--muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .svcTitle {
          margin: 0;
          font-weight: 900;
          font-size: clamp(20px, 2.4vw, 28px);
        }

        .svcLayout {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 16px;
        }
        @media (max-width: 900px) {
          .svcLayout {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        /* Menu */
        .svcMenu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .svcTab {
          appearance: none;
          border: 1px solid #1a1d27;
          background: #0b0e14;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.06s ease, border-color 0.15s ease,
            box-shadow 0.15s ease;
          text-align: left;
          position: relative;
          isolation: isolate;
        }
        .svcTab:hover {
          transform: translateY(-1px);
        }
        .svcTab.active {
          border-color: var(--accent);
          box-shadow: 0 0 0 6px var(--ring);
        }
        .ico {
          font-size: 18px;
          opacity: 0.9;
        }
        .tabText {
          display: grid;
          line-height: 1.15;
        }
        .tabText .kicker {
          font-size: 11px;
          color: var(--muted);
        }
        .tabText .label {
          font-weight: 800;
        }
        .chev {
          margin-left: auto;
          opacity: 0.5;
          transition: transform 0.15s ease;
        }
        .svcTab.active .chev {
          transform: translateX(2px);
        }

        /* Dettaglio */
        .svcDetail {
          border: 1px solid #1a1d27;
          border-radius: 16px;
          padding: 16px;
          background: radial-gradient(
              900px 320px at -10% -10%,
              rgba(108, 243, 194, 0.06),
              transparent 55%
            ),
            radial-gradient(
              800px 300px at 120% 120%,
              rgba(73, 164, 255, 0.06),
              transparent 55%
            ),
            #0b0e14;
          display: grid;
          gap: 12px;
          overflow: hidden;
          position: relative;
        }
        .detailHead {
          display: grid;
          gap: 6px;
        }
        .badge {
          width: max-content;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(108, 243, 194, 0.14);
          border: 1px solid #163a2e;
          font-weight: 700;
          font-size: 12px;
        }
        .detailTitle {
          margin: 0;
          font-size: clamp(18px, 2.2vw, 24px);
          font-weight: 900;
        }
        .detailDesc {
          margin: 0;
          color: var(--muted);
        }
        .detailList {
          display: grid;
          gap: 8px;
          margin: 2px 0 6px;
          padding: 0;
          list-style: none;
        }
        .detailItem {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .detailItem .dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--accent-2);
          margin-top: 8px;
          opacity: 0.7;
        }

        .chipset {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .chip.tag {
          padding: 6px 10px;
          border-radius: 999px;
          background: #0b0e14;
          border: 1px solid #1a1d27;
          font-size: 12px;
        }

        .cta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .help {
          color: var(--muted);
        }
      `}</style>
    </section>
  );
}
