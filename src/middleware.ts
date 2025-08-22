import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales } from './i18n/request';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'it',
  localeDetection: false, // We'll handle this manually
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userLocalePreference = request.cookies.get('NEXT_LOCALE')?.value;
  
  // If user has already set a preference, respect it
  if (userLocalePreference && locales.includes(userLocalePreference as any)) {
    // Only redirect if current path doesn't match preference
    const pathnameIsMissingLocale = locales.every(
      locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );
    
    if (pathnameIsMissingLocale) {
      return Response.redirect(
        new URL(`/${userLocalePreference}${pathname}`, request.url)
      );
    }
  }
  
  // For first-time visitors, detect browser language
  if (!userLocalePreference && pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const preferredLocale = acceptLanguage.toLowerCase().includes('it') ? 'it' : 'en';
    
    return Response.redirect(
      new URL(`/${preferredLocale}`, request.url)
    );
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(it|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};