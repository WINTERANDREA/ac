"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@/lib/track";

export type FaqItem = { question: string; answer: string };

type Props = {
  /** Se non passi items, il componente leggerà da i18n (namespace "faq"). */
  items?: FaqItem[];
  id?: string;
  singleOpen?: boolean; // se true, ne apre solo una per volta
};

export default function Faq({ items, id = "faq", singleOpen = true }: Props) {
  const t = useTranslations("faq");
  const list = (items ?? (t.raw("items") as FaqItem[])) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});

  if (!list.length) return null;

  const toggle = (idx: number) => {
    if (singleOpen) {
      const isOpen = openIndex === idx;
      setOpenIndex(isOpen ? null : idx);
      track("faq_toggle", {
        index: idx,
        state: isOpen ? "close" : "open",
        question: list[idx].question,
      });
    } else {
      const next = { ...openMap, [idx]: !openMap[idx] };
      setOpenMap(next);
      track("faq_toggle", {
        index: idx,
        state: next[idx] ? "open" : "close",
        question: list[idx].question,
      });
    }
  };

  const isItemOpen = (idx: number) =>
    singleOpen ? openIndex === idx : !!openMap[idx];

  return (
    <section id={id} aria-labelledby='faq-title' className='faq'>
      <h3 id='faq-title' className='sectionTitle'>
        {t("title")}
      </h3>

      <div className='accordion' role='list'>
        {list.map((it, idx) => {
          const isOpen = isItemOpen(idx);
          const contentId = `faq-panel-${idx}`;
          const btnId = `faq-button-${idx}`;

          return (
            <div
              key={idx}
              className={`item ${isOpen ? "open" : ""}`}
              role='listitem'
            >
              <button
                id={btnId}
                type='button'
                className='trigger'
                aria-controls={contentId}
                aria-expanded={isOpen}
                onClick={() => toggle(idx)}
              >
                <span className='q'>{it.question}</span>
                <svg
                  className={`chev ${isOpen ? "rot" : ""}`}
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

              <div
                id={contentId}
                role='region'
                aria-labelledby={btnId}
                className='panel'
                style={{ maxHeight: isOpen ? "400px" : "0px" }}
              >
                <div className='answer'>{it.answer}</div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .faq {
          display: grid;
          gap: 12px;
        }
        .sectionTitle {
          margin: 0 0 8px;
        }
        .accordion {
          display: grid;
          gap: 8px;
        }
        .item {
          border: 1px solid #1a1d27;
          background: #0b0e14;
          border-radius: 12px;
          overflow: hidden;
        }
        .trigger {
          width: 100%;
          appearance: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: transparent;
          color: var(--text);
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .trigger:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .q {
          font-weight: 600;
        }
        .chev {
          transition: transform 220ms ease;
        }
        .chev.rot {
          transform: rotate(180deg);
        }
        .panel {
          overflow: hidden;
          transition: max-height 260ms ease;
          will-change: max-height;
        }
        .answer {
          padding: 0 14px 12px 14px;
          color: var(--muted);
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
}
