// components/StructuredData.tsx
import Script from "next/script";

export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Andrea Casero",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    jobTitle: "Frontend Developer & Food Tech",
    sameAs: [
      // add socials if you want
    ],
  };
  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Andrea Casero",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <>
      <Script
        id='ld-person'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <Script
        id='ld-website'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }}
      />
    </>
  );
}
