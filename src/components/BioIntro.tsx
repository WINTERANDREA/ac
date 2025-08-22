"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { track } from "@/lib/track";

type Props = { onCtaClick?: () => void };

export default function BioIntro({ onCtaClick }: Props) {
  const t = useTranslations('bioIntro');
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
      void el.offsetHeight;
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

  return (
    <section className='card bioIntro'>
      {/* Colonna testo */}
      <div>
        <span className='kicker'>{t('kicker')}</span>
        <h2 className='bioTitle'>{t('title')}</h2>

        <p className='bioLead'>{t.rich('lead', { strong: (chunks) => <strong>{chunks}</strong> })}</p>

        {/* Toggle bio */}
        <button
          className='disclosureBtn'
          type='button'
          onClick={() => {
            const newOpen = !open;
            setOpen(newOpen);
            track("bio_toggle", { 
              action: newOpen ? "expand" : "collapse" 
            });
          }}
          aria-expanded={open}
          aria-controls='bio-more'
        >
          <span>{open ? t('showLess') : t('showMore')}</span>
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
          <p className='bioText'>{t.rich('bio1', { strong: (chunks) => <strong>{chunks}</strong> })}</p>

          <p className='bioText'>{t.rich('bio2', { strong: (chunks) => <strong>{chunks}</strong> })}</p>

          <p className='bioText'>{t.rich('bio3', { strong: (chunks) => <strong>{chunks}</strong> })}</p>

          <p className='bioText'>{t.rich('bio4', { strong: (chunks) => <strong>{chunks}</strong> })}</p>

          <p className='bioText'>{t.rich('bio5', { strong: (chunks) => <strong>{chunks}</strong>, em: (chunks) => <em>{chunks}</em> })}</p>
        </div>

        {/* === Blocco con stile iniziale, sopra i tag === */}
        {/* <div className='featureCard' style={{ marginTop: 10 }}>
          <div className='bioBadge'>Disponibilità 2026</div>
          <div className='bioRow'>
            <span>Quota %</span>
            <span className='bioDot' />
            <span>Ore stimate</span>
            <span className='bioDot' />
            <span>Costo chiaro</span>
          </div>
          <div className='bioRow subtle'>
            Priorità concordata · Report mensili · Focus prodotto
          </div>
        </div> */}

        {/* CTA */}
        {/* <div className='cta'>
          <button className='btn' onClick={onCtaClick}>
            Blocca la tua quota 2026
          </button>
          <span className='help'>
            Breve call per allinearci su obiettivi e timing.
          </span>
        </div> */}
      </div>

      {/* Colonna foto */}
      <div className='bioPhoto' aria-hidden='true'>
        <Image
          src={avatar}
          alt={t('altText')}
          width={720}
          height={540}
          loading='lazy'
        />
      </div>
      {/* Tag */}
      <div className='chipset' style={{ marginTop: 10 }}>
        <span className='chip'>{t('tags.unisg')}</span>
        <span className='chip'>{t('tags.consensys')}</span>
        <span className='chip'>{t('tags.ai')}</span>
        <span className='chip'>{t('tags.tech')}</span>
        <span className='chip'>{t('tags.food')}</span>
      </div>
    </section>
  );
}
