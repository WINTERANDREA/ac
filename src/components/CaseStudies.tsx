"use client";

import React from "react";

export type CaseStudy = {
  title: string;
  subtitle: string;
  bullets: string[];
  tags: string[];
};

export function CaseStudies({
  items,
  onCtaClick,
}: {
  items: CaseStudy[];
  onCtaClick?: () => void;
}) {
  return (
    <section className='card csSection'>
      <div className='sectionHead'>
        <div className='sectionKicker'>Portfolio</div>
        <h3 className='sectionTitle'>Case study selezionati</h3>
      </div>

      <div className='csGrid'>
        {items.map((cs) => (
          <article key={cs.title} className='csCard2'>
            <div className='csCard2__topline' />
            <h4 className='csCard2__title'>{cs.title}</h4>
            <p className='csCard2__subtitle'>{cs.subtitle}</p>
            <ul className='csCard2__list'>
              {cs.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className='chipset'>
              {cs.tags.map((t) => (
                <span key={t} className='chip tag'>
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className='cta'>
        <button className='btn' onClick={onCtaClick}>
          Parliamo del tuo progetto
        </button>
        <span className='help'>
          Indicami obiettivi, scadenze e team coinvolti.
        </span>
      </div>
    </section>
  );
}
