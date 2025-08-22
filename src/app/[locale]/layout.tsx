// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { locales } from "@/i18n/request";

export const dynamicParams = false;

type Params = { locale: (typeof locales)[number] };
type Props = { children: React.ReactNode; params: Promise<Params> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params; // ✅ await params
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params; // ✅ await params
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
