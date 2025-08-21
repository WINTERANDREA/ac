"use client";

import { useEffect, useRef, useState } from "react";

type Props = { onCtaClick?: () => void };

export default function BioIntro({ onCtaClick }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const avatar = process.env.NEXT_PUBLIC_AVATAR_URL || "/branding/portrait.jpg";

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
      // @ts-expect-error: force reflow
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
        <span className='kicker'>Chi sono</span>
        <h2 className='bioTitle'>
          Front-end &amp; Food Tech, con i piedi per terra
        </h2>

        <p className='bioLead'>
          Sviluppo web e app affidabili (<strong>Next.js</strong>,{" "}
          <strong>React Native</strong>) con un approccio pratico e misurabile.
        </p>

        {/* Toggle bio */}
        <button
          className='disclosureBtn'
          type='button'
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls='bio-more'
        >
          <span>{open ? "Mostra meno" : "Leggi la mia storia"}</span>
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
            Sono arrivato all’
            <strong>Università di Scienze Gastronomiche</strong> grazie a una
            borsa di studio. Lì è nata la mia passione per il cibo e, quasi in
            controcampo, per la <strong>tecnologia</strong> applicata al
            settore. Ho concluso con uno <strong>stage in Argotec</strong> e una{" "}
            <strong>tesi sulla produzione di pasti per astronauti</strong>:
            un’esperienza che mi ha insegnato metodo e attenzione ai dettagli.
          </p>

          <p className='bioText'>
            Dopo un periodo tra <strong>produzione casearia</strong> e{" "}
            <strong>consulenza in sicurezza alimentare</strong>, ho capito che
            cercavo un modo diverso per creare valore. Nel 2017 ho lasciato la
            comfort zone e sono partito per la <strong>Scozia</strong> per
            migliorare l’inglese e cambiare prospettiva. Lì ho incontrato
            persone che si erano formate da autodidatte: mi si è accesa una
            lampadina.
          </p>

          <p className='bioText'>
            Ho scelto <strong>Bangalore</strong> (India) per tre mesi intensivi:
            vita spartana, tante domande, e i primi passi seri nello{" "}
            <strong>sviluppo web e mobile</strong>. Da allora, tra corsi online,
            progetti reali e notti a provare, sbagliare e rifare, ho continuato
            a crescere con costanza.
          </p>

          <p className='bioText'>
            Oggi lavoro come <strong>freelance</strong>. Ho ancora molto da
            imparare e questo mi tiene sveglio: il mio obiettivo è aiutare
            persone e team a <strong>trasformare le idee in prodotti</strong>,
            con cura per performance, accessibilità e risultati. Nel tempo ho
            arricchito il mio profilo con esperienze in
            <strong> AI</strong> e una solida base in{" "}
            <strong>blockchain</strong> (ConsenSys Academy, 2021), oltre a
            certificazioni e riconoscimenti nel mio primo mondo, quello del
            food.
          </p>

          <p className='bioText'>
            Per questo ho creato un formato semplice: il mio tempo è{" "}
            <em>prenotabile a quota</em>. Scegli la percentuale della mia
            disponibilità annuale e vedi subito <strong>ore</strong> e{" "}
            <strong>investimento</strong>. È trasparente, pianificabile e ti
            permette di concentrarti sul prodotto.
          </p>
        </div>

        {/* === Blocco con stile iniziale, sopra i tag === */}
        <div className='featureCard' style={{ marginTop: 10 }}>
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
        </div>

        {/* Tag */}
        <div className='chipset' style={{ marginTop: 10 }}>
          <span className='chip'>UNISG Alumni</span>
          <span className='chip'>ConsenSys ’21</span>
          <span className='chip'>AI &amp; Data</span>
          <span className='chip'>Next.js / React Native</span>
          <span className='chip'>Food Tech</span>
        </div>

        {/* CTA */}
        <div className='cta'>
          <button className='btn' onClick={onCtaClick}>
            Blocca la tua quota 2026
          </button>
          <span className='help'>
            Breve call per allinearci su obiettivi e timing.
          </span>
        </div>
      </div>

      {/* Colonna foto */}
      <div className='bioPhoto' aria-hidden='true'>
        <img
          src={avatar}
          alt='Foto di Andrea Casero'
          width={720}
          height={540}
          loading='lazy'
        />
      </div>
    </section>
  );
}
