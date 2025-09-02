"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { track } from "@/lib/track";

interface PageLayoutProps {
  children: ReactNode;
  locale: string;
  showHomeLink?: boolean;
  homeLinkText?: string;
}

export default function PageLayout({
  children,
  locale,
  showHomeLink = true,
  homeLinkText,
}: PageLayoutProps) {
  const handleActionClick = (type: "home") => {
    track("navigation_click", {
      action_type: type,
      url: `/${locale}`,
    });

    window.location.href = `/${locale}`;
  };

  return (
    <main className='container'>
      <div className='language-selector-wrapper'>
        <LanguageSelector />
      </div>

      {showHomeLink && (
        <nav className='breadcrumb' style={{ marginBottom: 20 }}>
          <a href={`/${locale}`} onClick={() => handleActionClick("home")}>
            {homeLinkText}
          </a>
        </nav>
      )}

      {children}

      <Footer />

      <style jsx>{`
        .breadcrumb a {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.9em;
          transition: color 0.2s ease;
        }

        .breadcrumb a:hover {
          color: var(--accent);
        }
      `}</style>
    </main>
  );
}
