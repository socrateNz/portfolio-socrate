import '../globals.css';
import './site.css';
import type { Metadata, Viewport } from 'next';
import { DM_Mono, Mona_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';
import { SITE_NAME, SITE_URL, SOCIAL_LINKS } from '@/lib/site';

const monaSans = Mona_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-mona' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-mono' });

export const viewport: Viewport = {
  themeColor: '#0e0e0e',
  colorScheme: 'light',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site.meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: `%s | ${SITE_NAME}` },
    description: t('description'),
    keywords: t('keywords').split(',').map((k) => k.trim()),
    applicationName: SITE_NAME,
    authors: [{ name: 'Nzogning Mbonda Socrate', url: SOCIAL_LINKS[0] }],
    creator: 'Nzogning Mbonda Socrate',
    publisher: SITE_NAME,
    category: 'technology',
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: '/fr', en: '/en', 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      siteName: SITE_NAME,
      title: t('title'),
      description: t('description'),
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? ['en_US'] : ['fr_FR'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      creator: '@NzogningS',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    formatDetection: { telephone: false },
  };
}

// Structured data so search engines know who the portfolio belongs to
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nzogning Mbonda Socrate',
  alternateName: 'Etarcos',
  jobTitle: 'Full Stack Web & Mobile Developer',
  url: SITE_URL,
  image: `${SITE_URL}/profil.webp`,
  email: 'mailto:snzogning0@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Douala', addressCountry: 'CM' },
  knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'React Native', 'MongoDB'],
  sameAs: SOCIAL_LINKS,
};

// Generate static params for known locales
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }]; 
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Destructure params after the async context is established
  const { locale } = await params;
  
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
            <div className={`${monaSans.variable} ${dmMono.variable}`}>{children}</div>
            <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}