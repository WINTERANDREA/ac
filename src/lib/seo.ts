// lib/seo.ts
import type { Metadata } from "next";
import { Locale } from "@/i18n/request";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function buildMetadata(
  locale: Locale,
  title: string,
  description: string
): Metadata {
  const canonical = `${SITE}/${locale}`;
  const altIt = `${SITE}/it`;
  const altEn = `${SITE}/en`;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: { it: altIt, en: altEn, "x-default": altEn },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "Andrea Casero",
      locale: locale === "it" ? "it_IT" : "en_US",
      images: [
        {
          url: "/og/cover-1200x630.png",
          width: 1200,
          height: 630,
          alt: "Andrea Casero",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/cover-1200x630.png"],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}
