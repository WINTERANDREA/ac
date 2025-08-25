"use client";

import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";

type FaqItem = { q: string; a: string };

const mapLang = (l: string) => (l === "it" ? "it-IT" : "en-US");

export default function FaqStructuredData() {
  const locale = useLocale();
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const pageUrl = site ? `${site}/${locale}` : undefined;
  const inLanguage = mapLang(locale);

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage,
    url: pageUrl,
    name: t("title"),
    isPartOf: site
      ? {
          "@type": "WebSite",
          url: site,
          name: "Andrea Casero",
          inLanguage,
        }
      : undefined,
  };

  return (
    <>
      <Script
        id='ld-faq'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />
      {pageUrl && (
        <Script
          id='ld-webpage'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
        />
      )}
    </>
  );
}
