"use client";

import BioIntro from "@/components/BioIntro";
import LanguageSelector from "@/components/LanguageSelector";
import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import LeadModal from "@/components/LeadModal";
import Toast from "@/components/Toast";

// Currency formatter will be defined inside the component to use locale

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
  hoursPerDay: envNum(process.env.NEXT_PUBLIC_HOURS_PER_DAY, 8),
};

export default function Page() {
  const t = useTranslations("homePage");
  const tCaseStudies = useTranslations("");
  const locale = useLocale();
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "andrecasero@gmail.com";

  const cur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US", {
    style: "currency",
    currency: "EUR",
  });

  // Slider percentuale (manteniamo interazione)
  const [share, setShare] = useState(20);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastKind, setToastKind] = useState<"success" | "error">("success");
  const [toastMsg, setToastMsg] = useState("");

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

  function handleLeadResult(status: "ok" | "err") {
    if (status === "ok") {
      setToastKind("success");
      setToastMsg(t("modal.successMessage"));
    } else {
      setToastKind("error");
      // append email for clarity, keeping your existing copy
      setToastMsg(`${t("modal.errorMessage")} ${contactEmail}`);
    }
    setToastOpen(true);
  }

  return (
    <main className='container'>
      <div className='language-selector-wrapper'>
        <LanguageSelector />
      </div>
      <BioIntro onCtaClick={() => setOpen(true)} />
      <header className='header'>
        <h1 className='h1 mt-5'>
          {t.rich("mainTitle", {
            span: (chunks) => (
              <span style={{ color: "var(--accent)" }}>{chunks}</span>
            ),
          })}
        </h1>
        <p className='sub'>{t("mainSubtitle")}</p>
      </header>

      {/* HERO full viewport: torta + metriche */}
      <section className='card hero' aria-label={t("heroLabel")}>
        <div className='pieWrap'>
          <Donut percentage={share} t={t} />
          <div className='legend' aria-hidden>
            <span className='dot' style={{ background: "var(--accent)" }} />
            <span>{t("legend.yourQuota")}</span>
            <span
              className='dot'
              style={{ background: "var(--accent-2)", opacity: 0.4 }}
            />
            <span>{t("legend.remaining")}</span>
          </div>
        </div>

        <div className='controls' style={{ marginTop: 18 }}>
          <label className='label' htmlFor='range'>
            {t("controls.rangeLabel")}
          </label>
          <div className='rangeWrap'>
            <input
              id='range'
              className='range'
              type='range'
              min={1}
              max={80}
              step={1}
              value={share}
              onChange={(e) => setShare(parseInt(e.target.value, 10))}
              aria-describedby='rangeHelp'
              // aggiorna il riempimento del track in WebKit
              style={{ ["--fill" as string | number]: `${share}%` }}
            />
          </div>
          <div id='rangeHelp' className='help'>
            {t("controls.rangeHelp")}
          </div>
        </div>

        <div className='metrics' aria-live='polite'>
          <div className='metric'>
            <h4>{t("metrics.quotaSelected")}</h4>
            <strong>{share}%</strong>
            {/* <div className='help'>Regola con lo slider qui sotto.</div> */}
          </div>
          <div className='metric'>
            <h4>{t("metrics.estimatedHours")}</h4>
            <strong>{clientHours} h</strong>
            {/* <div className='help'>Su un totale di ~{totalHours} h/anno.</div> */}
          </div>
          <div className='metric'>
            <h4>{t("metrics.estimatedInvestment")}</h4>
            <strong>{cur.format(clientCost)}</strong>
            {/* <div className='help'>
              Quota di {share}% su {cur.format(ENV.target)}.
            </div> */}
          </div>
        </div>

        <div className='metrics1' style={{ marginTop: 10 }}>
          {/* <div className='metric'>
            <h4>Tariffa effettiva stimata</h4>
            <strong>
              {impliedRate > 0 ? cur.format(impliedRate) + "/h" : "-"}
            </strong>
            <div className='help'>
              Calcolata su {ENV.weeks} sett × {ENV.daysPerWeek} gg ×{" "}
              {ENV.hoursPerDay} h.
            </div>
          </div> */}
          {/* <div className='metric'>
            <h4>Obiettivo annuo</h4>
            <strong>{cur.format(ENV.target)}</strong>
            <div className='help'>Parametri definiti da configurazione.</div>
          </div> */}
          <div className='metric'>
            <h4>{t("metrics.contact")}</h4>
            <strong>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </strong>
            <div className='help'>{t("metrics.contactHelp")}</div>
          </div>
        </div>

        <div className='cta'>
          <button className='btn' onClick={() => setOpen(true)}>
            {t("cta.button")}
          </button>
          <span className='help'>{t("cta.help")}</span>
        </div>
      </section>

      {/* SERVIZI in evidenza */}
      <section className='card' style={{ marginTop: 18 }}>
        <div className='sectionHead'>
          <div className='sectionKicker'>{t("services.kicker")}</div>
          <h3 className='sectionTitle'>{t("services.title")}</h3>
        </div>

        <div className='servicesShowcase'>
          <article className='svcCard'>
            <div className='svcIcon'>🛠️</div>
            <h4 className='svcTitle'>{t("services.development.title")}</h4>
            <p className='svcDesc'>{t("services.development.description")}</p>
            <div className='chipset'>
              <span className='chip tag'>React Native / Expo</span>
              <span className='chip tag'>Next js</span>
              <span className='chip tag'>CI/CD</span>
              <span className='chip tag'>TypeScript</span>
              <span className='chip tag'>UI / UX</span>
            </div>
          </article>

          <article className='svcCard'>
            <div className='svcIcon'>🔧</div>
            <h4 className='svcTitle'>{t("services.maintenance.title")}</h4>
            <p className='svcDesc'>{t("services.maintenance.description")}</p>
            <div className='chipset'>
              <span className='chip tag'>SEO</span>
              <span className='chip tag'>Content</span>
              <span className='chip tag'>Analytics</span>
            </div>
          </article>

          <article className='svcCard'>
            <div className='svcIcon'>🧪</div>
            <h4 className='svcTitle'>{t("services.consulting.title")}</h4>
            <p className='svcDesc'>{t("services.consulting.description")}</p>
            <div className='chipset'>
              <span className='chip tag'>Data</span>
              <span className='chip tag'>Automation</span>
              <span className='chip tag'>RAG</span>
            </div>
          </article>

          <article className='svcCard'>
            <div className='svcIcon'>🚀</div>
            <h4 className='svcTitle'>{t("services.startup.title")}</h4>
            <p className='svcDesc'>{t("services.startup.description")}</p>
            <div className='chipset'>
              <span className='chip tag'>MVP</span>
              <span className='chip tag'>Roadmap</span>
              <span className='chip tag'>Growth</span>
              <span className='chip tag'>Study trip</span>
            </div>
          </article>
        </div>
      </section>

      {/* --- Case study --- */}
      {/* <CaseStudies items={CASE_STUDIES} onCtaClick={() => setOpen(true)} /> */}

      <section className='card' style={{ marginTop: 18 }}>
        <div className='sectionHead'>
          <div className='sectionKicker'>
            {tCaseStudies("caseStudies.kicker")}
          </div>
          <h3 className='sectionTitle'>{tCaseStudies("caseStudies.title")}</h3>
        </div>

        <div className='gridCards'>
          {tCaseStudies.raw("caseStudiesData").map((cs: any) => (
            <article key={cs.title} className='csCard'>
              <h4>{cs.title}</h4>
              <div className='subtle'>{cs.subtitle}</div>
              <ul>
                {cs.bullets.map((b: string) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className='chipset'>
                {cs.tags.map((tag: string) => (
                  <span key={tag} className='chip tag'>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className='cta'>
          <button className='btn' onClick={() => setOpen(true)}>
            {tCaseStudies("caseStudies.cta")}
          </button>
          <span className='help'>{tCaseStudies("caseStudies.ctaHelp")}</span>
        </div>
      </section>

      <section className='card' style={{ marginTop: 18 }}>
        <div className='sectionHead'>
          <div className='sectionKicker'>{t("clientsStack.kicker")}</div>
          <h3 className='sectionTitle'>{t("clientsStack.title")}</h3>
        </div>

        <div className='metrics'>
          <div className='metric'>
            <h4>{t("clientsStack.clientsTitle")}</h4>
            <div className='chipset'>
              {tCaseStudies.raw("stackClienti.clienti").map((c: string) => (
                <span className='chip' key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className='metric'>
            <h4>{t("clientsStack.stackTitle")}</h4>
            <div className='chipset'>
              {tCaseStudies.raw("stackClienti.stack").map((s: string) => (
                <span className='chip tag' key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className='metric'>
            <h4>{t("clientsStack.contactTitle")}</h4>
            <strong>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </strong>
            <div className='help'>{t("clientsStack.contactNote")}</div>
          </div>
        </div>
      </section>

      <section className='card' style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 6, marginBottom: 6 }}>{t("notes.title")}</h3>
        <p className='help'>
          {t.rich("notes.description", {
            weeks: ENV.weeks,
            daysPerWeek: ENV.daysPerWeek,
            hoursPerDay: ENV.hoursPerDay,
            em: (chunks) => <em>{chunks}</em>,
          })}
        </p>
        <div className='code'>
          <p>{t("notes.year")}</p>
        </div>
      </section>

      {/* MODAL lead */}
      <LeadModal
        open={open}
        onClose={() => setOpen(false)}
        onResult={handleLeadResult}
        share={share}
        clientHours={clientHours}
        clientCost={clientCost}
        contactEmail={contactEmail}
        env={ENV}
      />

      <Toast
        open={toastOpen}
        kind={toastKind}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
        duration={10000}
      />
    </main>
  );
}

/** Donut SVG - responsive */
function Donut({
  percentage,
  t,
}: {
  percentage: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const size = 360; // spazio di disegno (viewBox)
  const stroke = 28;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (c * Math.min(Math.max(percentage, 0), 100)) / 100;

  return (
    <div
      className='pie'
      role='img'
      aria-label={t("donut.ariaLabel", { percentage })}
    >
      {/* width/height 100% per far scalare l'SVG nel contenitore */}
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio='xMidYMid meet'
      >
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

      {/* valore centrale */}
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
          {t("donut.label")}
        </div>
        <div style={{ fontSize: 44, fontWeight: 900 }}>{percentage}%</div>
      </div>
    </div>
  );
}
