"use client";

import React from "react";

export function ClientsStack({
  clients,
  stack,
  contactEmail,
  onCtaClick,
}: {
  clients: string[];
  stack: string[];
  contactEmail: string;
  onCtaClick?: () => void;
}) {
  return (
    <section className='card clSection'>
      <div className='sectionHead'>
        <div className='sectionKicker'>Collaborazioni & tecnologia</div>
        <h3 className='sectionTitle'>Clienti & stack</h3>
      </div>

      <div className='clGrid'>
        <div className='clPanel'>
          <h4 className='clH4'>Clienti / progetti</h4>
          <div className='chipset clChips'>
            {clients.map((c) => (
              <span key={c} className='chip'>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className='clPanel'>
          <h4 className='clH4'>Stack principale</h4>
          <div className='chipset clChips'>
            {stack.map((s) => (
              <span key={s} className='chip tag'>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className='clPanel clCTA'>
          <h4 className='clH4'>Contatto</h4>
          <p className='clNote'>
            Disponibilità 2026 su prenotazione a quote. Rispondo entro 24h
            lavorative.
          </p>
          <div className='cta'>
            <a className='btn' href={`mailto:${contactEmail}`}>
              Scrivimi
            </a>
            <button className='btn btnGhost' onClick={onCtaClick}>
              Richiedi una call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
