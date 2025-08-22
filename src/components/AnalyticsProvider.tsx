"use client";

import Script from "next/script";

type Props = {
  gaId?: string;
  gtmId?: string;
};

export default function AnalyticsProvider({ gaId, gtmId }: Props) {
  const hasAny = !!gaId || !!gtmId;

  return (
    <>
      {hasAny && (
        <>
          {/* dataLayer + analytics consent granted */}
          <Script id='ga-init-datalayer' strategy='afterInteractive'>
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = function(){ dataLayer.push(arguments); }
              window.gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'granted',
                functionality_storage: 'denied',
                personalization_storage: 'denied',
                security_storage: 'granted'
              });
            `}
          </Script>

          {/* GA4 (optional) */}
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy='afterInteractive'
              />
              <Script id='ga4-config' strategy='afterInteractive'>
                {`
                  window.gtag('js', new Date());
                  window.gtag('config', '${gaId}', {
                    anonymize_ip: true,
                    send_page_view: false
                  });
                `}
              </Script>
            </>
          )}

          {/* GTM (optional) */}
          {gtmId && (
            <Script
              id='gtm-loader'
              strategy='afterInteractive'
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
                `,
              }}
            />
          )}
        </>
      )}

      {/* Cloudflare (optional simple page analytics) */}
      {process.env.NEXT_PUBLIC_CLOUDFLARE_TOKEN && (
        <Script
          defer
          strategy='afterInteractive'
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CLOUDFLARE_TOKEN}","spa":"auto"}`}
        />
      )}

      {/* GTM noscript */}
      {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height='0'
            width='0'
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
    </>
  );
}
