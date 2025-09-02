import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "computational-gastronomy",
  });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: t("meta.title"),
        description: t("meta.description"),
        url: "https://andreacasero.vercel.app/computational-gastronomy",
        mainEntity: {
          "@type": "Service",
          name: "Computational Gastronomy Studio",
          description: t("meta.description"),
          provider: {
            "@type": "Person",
            name: "Andrea Casero",
          },
        },
      }),
    },
  };
}

export default async function ComputationalGastronomyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "computational-gastronomy",
  });
  const tCommon = await getTranslations({
    locale,
    namespace: "common",
  });

  return (
    <PageLayout
      locale={locale}
      showHomeLink={true}
      homeLinkText={tCommon("backToHome")}
    >
      <div className='hero'>
        <div className='header'>
          <div className='kicker'>{t("hero.kicker")}</div>
          <h1 className='h1'>{t("hero.title")}</h1>
          <p className='sub'>{t("hero.description")}</p>
        </div>

        <div className='card' style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className='sectionHead'>
            <div className='sectionKicker'>{t("flow.kicker")}</div>
            <h2 className='sectionTitle'>{t("flow.title")}</h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "16px",
              padding: "20px 0",
            }}
          >
            {[
              "recipes",
              "ingredients",
              "molecules",
              "nutrition",
              "health",
              "footprint",
            ].map((step, index, array) => (
              <div
                key={step}
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  className='chip'
                  style={{
                    padding: "8px 16px",
                    background: "var(--accent-2)",
                    color: "var(--bg)",
                    fontWeight: 700,
                  }}
                >
                  {t(`flow.steps.${step}`)}
                </div>
                {index < array.length - 1 && (
                  <div style={{ color: "var(--accent)", fontSize: "18px" }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          <p
            style={{
              color: "var(--muted)",
              textAlign: "center",
              margin: "16px 0 0",
            }}
          >
            {t("flow.description")}
          </p>
        </div>
      </div>

      <div className='servicesShowcase'>
        <Link href={`/${locale}/services`} className='svcCard'>
          <div className='svcIcon'>🏢</div>
          <h3 className='svcTitle'>{t("cta.services.title")}</h3>
          <p className='svcDesc'>{t("cta.services.description")}</p>
          <div className='chip'>{t("cta.services.action")}</div>
        </Link>

        <div className='card'>
          <div className='sectionKicker'>{t("cta.tools.kicker")}</div>
          <h3 className='sectionTitle'>{t("cta.tools.title")}</h3>
          <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
            <Link
              href={`/${locale}/tools/pairing-graph`}
              className='footer-link'
            >
              🧀 {t("cta.tools.pairing")}
            </Link>
            <Link
              href={`/${locale}/tools/menu-optimizer`}
              className='footer-link'
            >
              🌱 {t("cta.tools.optimizer")}
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
