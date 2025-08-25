// components/StructuredData.tsx
type FaqItem = { question: string; answer: string };
type BreadcrumbItem = { name: string; item: string };

type CourseData = {
  name: string;
  description: string;
  url: string;
  image?: string;
  inLanguage?: string;
  providerName?: string;
  providerUrl?: string;
  audience?: string[];
  teaches?: string[];
  keywords?: string[];
};

type ServiceData = {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  areaServed?: string[];
  priceRange?: string;
  offers?: Array<{
    url?: string;
    price?: number | string;
    priceCurrency?: string;
    availability?: "https://schema.org/InStock" | "https://schema.org/PreOrder";
  }>;
  keywords?: string[];
};

type Props = {
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  locale?: string; // "it" | "en" | "it-IT" | "en-US"
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
  course?: CourseData;
  service?: ServiceData;
  sameAs?: string[];
  contactEmail?: string;
  telephone?: string;
};

function normalizeLocale(l?: string) {
  if (!l) return "it-IT";
  const low = l.toLowerCase();
  if (low === "it" || low.startsWith("it-")) return "it-IT";
  return "en-US";
}

export default function StructuredData({
  pageUrl,
  pageTitle,
  pageDescription,
  locale = "it",
  breadcrumbs,
  faqs,
  course,
  service,
  sameAs = [],
  contactEmail = "andrecasero@gmail.com",
  telephone,
}: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  const inLanguage = normalizeLocale(locale);
  const personId = `${siteUrl}#person`;
  const websiteId = `${siteUrl}#website`;
  const webpageId = `${pageUrl}#webpage`;

  const graph: any[] = [];

  // Person
  graph.push({
    "@type": "Person",
    "@id": personId,
    name: "Andrea Casero",
    url: siteUrl,
    jobTitle: "Front-end Developer & Food Tech",
    sameAs,
    email: `mailto:${contactEmail}`,
    ...(telephone ? { telephone } : {}),
    knowsAbout: [
      "Next.js",
      "React Native",
      "Expo",
      "TypeScript",
      "Performance & Accessibility",
      "GA4",
      "AppsFlyer",
      "Automation (n8n)",
      "AI & RAG",
      "Food Tech",
    ],
  });

  // WebSite
  graph.push({
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: "Andrea Casero",
    inLanguage,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: { "@id": personId },
  });

  // WebPage
  graph.push({
    "@type": "WebPage",
    "@id": webpageId,
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    inLanguage,
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
  });

  // Breadcrumbs
  if (breadcrumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.item,
      })),
    });
  }

  // FAQPage
  if (faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  // Course
  if (course) {
    graph.push({
      "@type": "Course",
      name: course.name,
      description: course.description,
      url: course.url,
      ...(course.image ? { image: course.image } : {}),
      inLanguage: course.inLanguage || inLanguage,
      provider: {
        "@type": "Person",
        name: course.providerName || "Andrea Casero",
        url: course.providerUrl || siteUrl,
        "@id": personId,
      },
      ...(course.audience
        ? {
            audience: course.audience.map((a) => ({
              "@type": "Audience",
              audienceType: a,
            })),
          }
        : {}),
      ...(course.teaches ? { teaches: course.teaches } : {}),
      ...(course.keywords ? { keywords: course.keywords.join(", ") } : {}),
    });
  }

  // Service
  if (service) {
    graph.push({
      "@type": "Service",
      name: service.name,
      serviceType: service.serviceType || "Consulting",
      description: service.description,
      url: service.url,
      provider: { "@id": personId },
      areaServed: (service.areaServed || ["Remote", "Italy", "EU"]).map(
        (a) => ({
          "@type": "AdministrativeArea",
          name: a,
        })
      ),
      ...(service.priceRange ? { priceRange: service.priceRange } : {}),
      ...(service.offers?.length
        ? {
            offers: service.offers.map((o) => ({
              "@type": "Offer",
              ...(o.url ? { url: o.url } : {}),
              ...(o.price !== undefined ? { price: o.price } : {}),
              ...(o.priceCurrency ? { priceCurrency: o.priceCurrency } : {}),
              ...(o.availability ? { availability: o.availability } : {}),
            })),
          }
        : {}),
      ...(service.keywords ? { keywords: service.keywords.join(", ") } : {}),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      id='ld-graph'
      type='application/ld+json'
      // Inline SSR so crawlers see it immediately
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
