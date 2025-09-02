"use client";

import BioIntro from "@/components/BioIntro";
import LanguageSelector from "@/components/LanguageSelector";
import { useMemo, useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import LeadModal from "@/components/LeadModal";
import Toast from "@/components/Toast";
import { track, pageview } from "@/lib/track";
import ServicesPro from "@/components/ServicesPro";
import Faq, { FaqItem } from "@/components/Faq";
import StructuredData from "@/components/StructuredData";
import HighlightedProjects from "@/components/HighlightedProjects";
import Footer from "@/components/Footer";

const envNum = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const ENV = {
  target: envNum(process.env.NEXT_PUBLIC_TARGET, 80000),
  weeks: envNum(process.env.NEXT_PUBLIC_WEEKS, 46),
  daysPerWeek: envNum(process.env.NEXT_PUBLIC_DAYS_PER_WEEK, 5),
  hoursPerDay: envNum(process.env.NEXT_PUBLIC_HOURS_PER_DAY, 8),
};

export default function Page() {
  const t = useTranslations("homePage");
  const tCaseStudies = useTranslations("");
  const tFaq = useTranslations("faq");
  const locale = useLocale();

  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${site}/${locale}`;
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "andrecasero@gmail.com";

  const cur = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US", {
    style: "currency",
    currency: "EUR",
  });

  // FAQ items from i18n
  const faqItems = (tFaq.raw("items") as FaqItem[]) || [];

  // Slider percentuale
  const [share, setShare] = useState(0);

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

  // Track page view on mount
  useEffect(() => {
    pageview();
    track("page_view", { locale, page: "homepage" });
  }, [locale]);

  function handleLeadResult(status: "ok" | "err") {
    if (status === "ok") {
      setToastKind("success");
      setToastMsg(t("modal.successMessage"));
      track("lead_form_success", {
        share_percentage: share,
        estimated_hours: clientHours,
        estimated_cost: clientCost,
      });
    } else {
      setToastKind("error");
      setToastMsg(`${t("modal.errorMessage")} ${contactEmail}`);
      track("lead_form_error");
    }
    setToastOpen(true);
  }

  return (
    <main className='container'>
      <div className='language-selector-wrapper'>
        <LanguageSelector />
      </div>

      <BioIntro onCtaClick={() => setOpen(true)} />

      {/* Servizi */}
      <section className='card' style={{ marginTop: 18 }}>
        <ServicesPro initialId='fastlab' onCtaClick={() => setOpen(true)} />
      </section>

      {/* Highlighted Projects */}
      <HighlightedProjects />

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

      {/* HERO */}
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
              onChange={(e) => {
                const newShare = parseInt(e.target.value, 10);
                setShare(newShare);
                track("quota_change", {
                  new_percentage: newShare,
                  estimated_hours: Math.round((totalHours * newShare) / 100),
                  estimated_cost: (ENV.target * newShare) / 100,
                });
              }}
              aria-describedby='rangeHelp'
              style={{ "--fill": `${share}%` } as React.CSSProperties}
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
          </div>
          <div className='metric'>
            <h4>{t("metrics.estimatedHours")}</h4>
            <strong>{clientHours} h</strong>
          </div>
          <div className='metric'>
            <h4>{t("metrics.estimatedInvestment")}</h4>
            <strong>{cur.format(clientCost)}</strong>
          </div>
        </div>

        <div className='metrics1' style={{ marginTop: 10 }}>
          <div className='metric'>
            <h4>{t("metrics.contact")}</h4>
            <strong>
              <a
                href={`mailto:${contactEmail}`}
                onClick={() =>
                  track("contact_click", {
                    method: "email",
                    location: "hero_metrics",
                  })
                }
              >
                {contactEmail}
              </a>
            </strong>
            <div className='help'>{t("metrics.contactHelp")}</div>
          </div>
        </div>

        <div className='cta'>
          <button
            className='btn'
            onClick={() => {
              track("cta_click", {
                location: "hero",
                share_percentage: share,
                estimated_hours: clientHours,
                estimated_cost: clientCost,
              });
              setOpen(true);
            }}
          >
            {t("cta.button")}
          </button>
          <span className='help'>{t("cta.help")}</span>
        </div>
      </section>

      {/* Case studies */}
      <section className='card' style={{ marginTop: 18 }}>
        <div className='sectionHead'>
          <div className='sectionKicker'>
            {tCaseStudies("caseStudies.kicker")}
          </div>
          <h3 className='sectionTitle'>{tCaseStudies("caseStudies.title")}</h3>
        </div>

        <div className='gridCards'>
          {tCaseStudies.raw("caseStudiesData").map((cs: {title: string; subtitle: string; bullets: string[]; tags: string[]}) => (
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
          <button
            className='btn'
            onClick={() => {
              track("cta_click", {
                location: "case_studies",
                share_percentage: share,
              });
              setOpen(true);
            }}
          >
            {tCaseStudies("caseStudies.cta")}
          </button>
          <span className='help'>{tCaseStudies("caseStudies.ctaHelp")}</span>
        </div>
      </section>

      {/* Clients & stack */}
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
              <a
                href={`mailto:${contactEmail}`}
                onClick={() =>
                  track("contact_click", {
                    method: "email",
                    location: "clients_stack",
                  })
                }
              >
                {contactEmail}
              </a>
            </strong>
            <div className='help'>{t("clientsStack.contactNote")}</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='card' style={{ marginTop: 18 }}>
        <Faq items={faqItems} />
      </section>

      {/* Note */}
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
        <p className='help'>
          {t.rich("notes.iva_info", {
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

      {/* <HeroTeaser
        onCtaClick={() => {
          track("cta_click", {
            location: "hero_teaser",
            share_percentage: share,
            estimated_hours: clientHours,
            estimated_cost: clientCost,
          });
          setOpen(true);
        }}
      /> */}

      <Toast
        open={toastOpen}
        kind={toastKind}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
        duration={10000}
      />

      {/* Structured Data (unico graph) */}
      <StructuredData
        pageUrl={pageUrl}
        pageTitle='Andrea Casero — Food Tech & Innovation'
        pageDescription='Consulente e sviluppatore freelance (Next.js, React Native). Calcola la tua quota 2026 e scopri case study e stack di lavoro.'
        locale={locale} // "it" | "en"
        breadcrumbs={[{ name: "Home", item: `${site}/${locale}` }]}
        faqs={faqItems}
        project={{
          name: "NFT Luxury Wine Marketplace",
          description: "A blockchain-powered marketplace for trading physically-redeemable luxury wine NFTs, bridging digital ownership with real-world assets.",
          demoUrl: "https://nft-luxury-wine.netlify.app/",
          sourceUrl: "https://github.com/WINTERANDREA/blockchain-developer-bootcamp-final-project",
          image: `${site}/project/nft-luxury-wine.png`,
          techStack: ["Ethereum", "Solidity", "OpenZeppelin", "Truffle", "Ganache", "IPFS", "JavaScript"],
          category: "Blockchain & DeFi",
          status: "Live Demo",
          highlights: [
            "Ethereum-based smart contracts with OpenZeppelin ERC721",
            "Physical wine bottle redemption system",
            "Winery-controlled NFT minting process",
            "IPFS integration for decentralized storage"
          ]
        }}
        service={{
          name: "MVP Sprint (online/on-site)",
          description:
            "Percorso intensivo per validare idee con programmazione base e AI tool.",
          url: `${site}/${locale}#mvp-sprint`,
          serviceType: "Product Discovery & Prototyping",
          areaServed: ["Remote", "Italy", "EU"],
          priceRange: "€€",
          keywords: [
            "MVP",
            "prototipazione veloce",
            "AI",
            "programmazione base",
          ],
        }}
        course={{
          name: "MVP Sprint — Learn & Build",
          description:
            "Impara le basi + tool AI per portare un'idea a prototipo testabile in pochi giorni.",
          url: `${site}/${locale}#mvp-sprint`,
          teaches: ["JavaScript", "Next.js", "Git", "AI tools"],
          audience: ["Students", "Career changers"],
          keywords: ["career switch", "learn to build", "rapid validation"],
        }}
        sameAs={[]}
        contactEmail='andrecasero@gmail.com'
      />

      <Footer />
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
  const size = 360;
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
