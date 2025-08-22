// app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Andrea Casero — Food Tech & Innovation",
  description:
    "Consulente e sviluppatore freelance (Next.js, React Native). Calcola la tua quota 2026 e scopri case study e stack di lavoro.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // ✅ await the promise
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value ?? "it";

  return (
    <html lang={cookieLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsProvider 
          gaId={process.env.NEXT_PUBLIC_GA4_ID}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
        />
        {children}
      </body>
    </html>
  );
}
