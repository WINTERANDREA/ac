"use client";

import { useMemo, useState } from "react";

const cur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

// Helper per leggere numerici da env (client)
const envNum = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// Valori fissi da ENV (non modificabili da UI)
const ENV = {
  target: envNum(process.env.NEXT_PUBLIC_TARGET, 80000),
  weeks: envNum(process.env.NEXT_PUBLIC_WEEKS, 46),
  daysPerWeek: envNum(process.env.NEXT_PUBLIC_DAYS_PER_WEEK, 5),
  hoursPerDay: envNum(process.env.NEXT_PUBLIC_HOURS_PER_DAY, 6),
};

const CASE_STUDIES = [
  {
    title: "Cortilia — App mobile refactor",
    subtitle:
      "React Native + Expo • GA4 + AppsFlyer • CMP (DMA) • Push (OneSignal) • integrazione Salesforce Marketing Cloud",
    bullets: [
      "Refactor su nuova architettura Expo, fixing di build e dipendenze",
      "Tracciamenti eventi e schermi (GA4/AppsFlyer) con consenso CMP",
      "Stabilizzazione push iOS/Android (OneSignal) e bridge MC SDK",
    ],
    tags: ["React Native", "Expo", "AppsFlyer", "GA4", "OneSignal", "SFMC"],
  },
  {
    title: "Tosi Gorgonzola — Go-to-market & digitale",
    subtitle:
      "Ricerca mercato 🇰🇷 • e-commerce feasibility • CRM • sito Next.js • contenuti",
    bullets: [
      "Modello di ricerca e validazione per espansione in Corea del Sud",
      "Sito/landing in Next.js e struttura CRM per B2B/retail",
      "Supporto branding e contenuti di prodotto",
    ],
    tags: ["Next.js", "CRM", "Content", "FoodTech"],
  },
  {
    title: "Elevage Nursing — MVP & workflow",
    subtitle:
      "Prototipo matching pazienti-infermiere • workflow Slack • dominio elevagenursing.com",
    bullets: [
      "Architettura MVP per canali patologici e triage richieste",
      "Base dati contatti e mappature territoriali per copertura",
      "Roadmap piattaforma e landing informativa",
    ],
    tags: ["Product", "Workflow", "Ops", "Health"],
  },
  {
    title: "Taste Tribe — Viaggi gastronomici",
    subtitle: "Brand • landing prenotazioni • itinerari produttori • marketing",
    bullets: [
      "Definizione proposta valore e format esperienze",
      "Landing con call-to-action e gestione richieste",
    ],
    tags: ["Branding", "Next.js", "TravelOps", "Food"],
  },
  {
    title: "DogVeda — Piattaforma veterinaria consapevole",
    subtitle:
      "Informazione & community • IA leggera per contenuti • flussi editoriali",
    bullets: [
      "Information architecture e tassonomia contenuti",
      "Piano editoriale e flussi di pubblicazione",
      "Sperimentazione Q&A assistito",
    ],
    tags: ["Content", "IA", "Community"],
  },
  {
    title: "Agentic outreach — ristoranti Michelin",
    subtitle:
      "Pipeline scraping (Google Places + Overpass) • arricchimento contatti • outreach",
    bullets: [
      "Raccolta e normalizzazione dati contatti (dataset export)",
      "Automazioni outreach e tracking risposte",
      "Struttura riuso per altri verticali",
    ],
    tags: ["Python/Node", "n8n", "Data", "Automation"],
  },
];

const STACK_CLIENTI = {
  clienti: [
    "Tosi Gorgonzola",
    "Cortilia",
    "Elevage Nursing",
    "Taste Tribe",
    "DogVeda",
    "Spore Bio (collaborazioni R&D)",
  ],
  stack: [
    "Next.js",
    "React Native",
    "Expo",
    "TypeScript",
    "Node.js",
    "Strapi",
    "Supabase/Postgres",
    "Vercel",
    "Cloudflare",
    "GA4",
    "AppsFlyer",
    "OneSignal",
    "Salesforce MC",
    "Stripe",
    "n8n",
    "OpenAI • RAG",
    "GitHub Actions",
  ],
};

export default function Page() {
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@andreacasero.dev";

  // Slider percentuale (manteniamo interazione)
  const [share, setShare] = useState(20);

  // Derivate dai parametri fissi ENV
  const totalHours = useMemo(
    () =>
      Math.max(0, ENV.weeks) *
      Math.max(0, ENV.daysPerWeek) *
      Math.max(0, ENV.hoursPerDay),
    []
  );
  const impliedRate = useMemo(
    () => (totalHours > 0 ? ENV.target / totalHours : 0),
    [totalHours]
  );
  const clientHoursRaw = (totalHours * share) / 100;
  const clientHours = Math.round(clientHoursRaw);
  const clientCost = (ENV.target * share) / 100;

  // Modal
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  async function submitLead() {
    try {
      setSending(true);
      setSent(null);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
          share,
          clientHours,
          clientCost,
          target: ENV.target,
          weeks: ENV.weeks,
          daysPerWeek: ENV.daysPerWeek,
          hoursPerDay: ENV.hoursPerDay,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent("ok");
    } catch (e) {
      console.error(e);
      setSent("err");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className='container'>
      <header className='header'>
        <span className='kicker'>Consulenza · Food Tech & Innovazione</span>
        <h1 className='h1'>
          Prenota la tua “fetta” di{" "}
          <span style={{ color: "var(--accent)" }}>disponibilità 2026</span>
        </h1>
        <p className='sub'>
          Scegli la percentuale della mia capacità annuale da dedicare al tuo
          progetto. La stima dei costi è proporzionale all’obiettivo annuo di
          fatturato {cur.format(ENV.target)}.
        </p>
      </header>

      {/* HERO full viewport: torta + metriche */}
      <section className='card hero' aria-label='Selettore quota e stima'>
        <div className='pieWrap'>
          <Donut percentage={share} />
          <div className='legend' aria-hidden>
            <span className='dot' style={{ background: "var(--accent)" }} />
            <span>La tua quota</span>
            <span className='dot' style={{ background: "var(--accent-2)" }} />
            <span>Disponibilità residua</span>
          </div>
        </div>

        <div className='metrics' aria-live='polite'>
          <div className='metric'>
            <h4>Quota selezionata</h4>
            <strong>{share}%</strong>
            <div className='help'>Regola con lo slider qui sotto.</div>
          </div>
          <div className='metric'>
            <h4>Ore stimate incluse</h4>
            <strong>{clientHours} h</strong>
            <div className='help'>Su un totale di ~{totalHours} h/anno.</div>
          </div>
          <div className='metric'>
            <h4>Investimento stimato</h4>
            <strong>{cur.format(clientCost)}</strong>
            <div className='help'>
              Quota di {share}% su {cur.format(ENV.target)}.
            </div>
          </div>
        </div>

        <div className='controls' style={{ marginTop: 18 }}>
          <label className='label' htmlFor='range'>
            Regola la tua fetta (%)
          </label>
          <input
            id='range'
            className='range'
            type='range'
            min={5}
            max={80}
            step={5}
            value={share}
            onChange={(e) => setShare(parseInt(e.target.value, 10))}
            aria-describedby='rangeHelp'
          />
          <div id='rangeHelp' className='help'>
            Valori consigliati 5%–60%. Per impegni superiori contattami per un
            retainer dedicato.
          </div>
        </div>

        <div className='metrics' style={{ marginTop: 10 }}>
          <div className='metric'>
            <h4>Tariffa effettiva stimata</h4>
            <strong>
              {impliedRate > 0 ? cur.format(impliedRate) + "/h" : "-"}
            </strong>
            <div className='help'>
              Calcolata su {ENV.weeks} sett × {ENV.daysPerWeek} gg ×{" "}
              {ENV.hoursPerDay} h.
            </div>
          </div>
          <div className='metric'>
            <h4>Obiettivo annuo</h4>
            <strong>{cur.format(ENV.target)}</strong>
            <div className='help'>Parametri definiti da configurazione.</div>
          </div>
          <div className='metric'>
            <h4>Contatto</h4>
            <strong>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </strong>
            <div className='help'>
              Disponibilità 2026 su prenotazione a quote.
            </div>
          </div>
        </div>

        <div className='cta'>
          <button className='btn' onClick={() => setOpen(true)}>
            Blocca la tua quota 2026
          </button>
          <span className='help'>
            Compila i dettagli progetto e invia la richiesta.
          </span>
        </div>
      </section>

      {/* SERVIZI in evidenza */}
      <section className='card' style={{ marginTop: 18 }}>
        <div className='sectionHead'>
          <div className='sectionKicker'>Cosa posso fare per te</div>
          <h3 className='sectionTitle'>Servizi</h3>
        </div>

        <div className='servicesShowcase'>
          <article className='svcCard'>
            <div className='svcIcon'>🛠️</div>
            <h4 className='svcTitle'>
              Sviluppo & manutenzione — Next.js / React Native
            </h4>
            <p className='svcDesc'>
              Feature, refactor, performance, accessibilità, build mobile (Expo)
              e integrazioni (GA4, AppsFlyer, OneSignal, SFMC).
            </p>
            <div className='chipset'>
              <span className='chip tag'>TypeScript</span>
              <span className='chip tag'>Expo</span>
              <span className='chip tag'>CI/CD</span>
            </div>
          </article>

          <article className='svcCard'>
            <div className='svcIcon'>🔧</div>
            <h4 className='svcTitle'>Manutenzione web e social</h4>
            <p className='svcDesc'>
              Ottimizzazioni tecniche, performance, SEO on-page e contenuti per
              presidiare brand e canali digital.
            </p>
            <div className='chipset'>
              <span className='chip tag'>SEO</span>
              <span className='chip tag'>Content</span>
              <span className='chip tag'>Analytics</span>
            </div>
          </article>

          <article className='svcCard'>
            <div className='svcIcon'>🧪</div>
            <h4 className='svcTitle'>Consulenza R&S in ambito food / tech</h4>
            <p className='svcDesc'>
              Ricerca applicata, sperimentazione IA leggera, prototipi
              data-driven e validazione tecnica.
            </p>
            <div className='chipset'>
              <span className='chip tag'>Data</span>
              <span className='chip tag'>Automation</span>
              <span className='chip tag'>RAG</span>
            </div>
          </article>

          <article className='svcCard'>
            <div className='svcIcon'>🚀</div>
            <h4 className='svcTitle'>
              Supporto a startup / progetti personali
            </h4>
            <p className='svcDesc'>
              Architettura MVP, roadmap, scalabilità e go-to-market per
              iniziative early-stage.
            </p>
            <div className='chipset'>
              <span className='chip tag'>MVP</span>
              <span className='chip tag'>Roadmap</span>
              <span className='chip tag'>Growth</span>
            </div>
          </article>
        </div>
      </section>

      {/* --- Case study --- */}
      <section className='card' style={{ marginTop: 18 }}>
        <div className='sectionHead'>
          <div className='sectionKicker'>Portfolio</div>
          <h3 className='sectionTitle'>Case study selezionati</h3>
        </div>

        <div className='gridCards'>
          {CASE_STUDIES.map((cs) => (
            <article key={cs.title} className='csCard'>
              <h4>{cs.title}</h4>
              <div className='subtle'>{cs.subtitle}</div>
              <ul>
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
          <button className='btn' onClick={() => setOpen(true)}>
            Parliamo del tuo progetto
          </button>
          <span className='help'>
            Indicami obiettivi, scadenze e team coinvolti.
          </span>
        </div>
      </section>

      {/* --- Clienti & stack --- */}
      <section className='card' style={{ marginTop: 18 }}>
        <div className='sectionHead'>
          <div className='sectionKicker'>Collaborazioni & tecnologia</div>
          <h3 className='sectionTitle'>Clienti & stack</h3>
        </div>

        <div className='metrics'>
          <div className='metric'>
            <h4>Clienti / progetti</h4>
            <div className='chipset'>
              {STACK_CLIENTI.clienti.map((c) => (
                <span className='chip' key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className='metric'>
            <h4>Stack principale</h4>
            <div className='chipset'>
              {STACK_CLIENTI.stack.map((s) => (
                <span className='chip tag' key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className='metric'>
            <h4>Contatto</h4>
            <strong>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </strong>
            <div className='help'>
              Disponibilità 2026 su prenotazione a quote.
            </div>
          </div>
        </div>
      </section>

      <section className='card' style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 6, marginBottom: 6 }}>Note e condizioni</h3>
        <p className='help'>
          La selezione rappresenta una stima indicativa. Per percentuali oltre
          il 60% o esigenze di reperibilità, proponiamo un <em>retainer</em>{" "}
          dedicato. Le ore sono calcolate su base {ENV.weeks} settimanale ×{" "}
          {ENV.daysPerWeek} giorni × {ENV.hoursPerDay} ore/giorno. Tariffe
          soggette a IVA e condizioni contrattuali.
        </p>
        <div className='code'>Anno di riferimento: 2026</div>
      </section>

      {/* MODAL lead */}
      {open && (
        <div
          className='modalOverlay'
          role='dialog'
          aria-modal='true'
          aria-labelledby='leadTitle'
        >
          <div className='modalCard'>
            <div className='modalHead'>
              <h3 id='leadTitle'>Richiesta quota {share}% — 2026</h3>
              <button
                className='xbtn'
                onClick={() => setOpen(false)}
                aria-label='Chiudi'
              >
                ×
              </button>
            </div>
            <p className='help' style={{ marginTop: 0 }}>
              Ore incluse ~ <strong>{clientHours}h</strong> · Investimento ~{" "}
              <strong>{cur.format(clientCost)}</strong>
            </p>

            <div className='controls'>
              <div className='row'>
                <label className='label' htmlFor='name'>
                  Nome e cognome
                </label>
                <div className='input'>
                  <input
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Mario Rossi'
                  />
                </div>
              </div>
              <div className='row'>
                <label className='label' htmlFor='email'>
                  Email
                </label>
                <div className='input'>
                  <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='mario@azienda.it'
                  />
                </div>
              </div>
              <div className='row'>
                <label className='label' htmlFor='company'>
                  Azienda (opzionale)
                </label>
                <div className='input'>
                  <input
                    id='company'
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder='Azienda S.p.A.'
                  />
                </div>
              </div>
              <div className='row'>
                <label className='label' htmlFor='message'>
                  Messaggio
                </label>
                <div className='input'>
                  <textarea
                    id='message'
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Ambito, obiettivi, scadenze, team coinvolto...'
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: "var(--text)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='cta'>
              <button className='btn' disabled={sending} onClick={submitLead}>
                {sending ? "Invio in corso..." : "Invia richiesta"}
              </button>
              {sent === "ok" && (
                <span className='help' role='status'>
                  Ricevuto! Ti rispondo a breve.
                </span>
              )}
              {sent === "err" && (
                <span
                  className='help'
                  role='alert'
                  style={{ color: "#ff9b9b" }}
                >
                  Errore invio. Riprova o scrivi a{" "}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/** Donut SVG */
function Donut({ percentage }: { percentage: number }) {
  const size = 360;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (c * Math.min(Math.max(percentage, 0), 100)) / 100;

  return (
    <div
      className='pie'
      role='img'
      aria-label={`Quota selezionata: ${percentage}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke='var(--accent-2)'
            strokeOpacity='0.25'
            strokeWidth={stroke}
            fill='none'
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke='var(--accent)'
            strokeWidth={stroke}
            strokeLinecap='round'
            strokeDasharray={`${filled} ${c - filled}`}
            fill='none'
            style={{ transition: "stroke-dasharray .35s ease" }}
          />
        </g>
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div
          style={{
            fontSize: 14,
            color: "var(--muted)",
            fontWeight: 600,
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          La tua fetta
        </div>
        <div style={{ fontSize: 44, fontWeight: 900 }}>{percentage}%</div>
      </div>
    </div>
  );
}
