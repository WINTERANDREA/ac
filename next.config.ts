import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  eslint: {
    // 👇 non eseguire/fermare il build per errori ESLint
    ignoreDuringBuilds: true,
  },
  // opzionale: lascia ON i type-error (meglio così)
  typescript: { ignoreBuildErrors: false },
};

export default withNextIntl(nextConfig);
