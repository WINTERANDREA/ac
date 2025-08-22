import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['it', 'en'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'it'; // Default to Italian
  }

  try {
    return {
      locale,
      messages: (await import(`../locales/${locale}.json`)).default,
    };
  } catch (error) {
    notFound();
  }
});