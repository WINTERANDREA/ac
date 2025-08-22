import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const now = new Date().toISOString();
  return [
    {
      url: `${base}/it`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
