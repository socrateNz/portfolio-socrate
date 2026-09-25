import '../globals.css';
import './site.css';
import type { Metadata } from 'next';
import { DM_Mono, Mona_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';

const monaSans = Mona_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-mona' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-mono' });

export const metadata: Metadata = {
  title: "Etarcos-Dev - Développeur Web & Mobile",
  description: "Portfolio personnel de développeur web et mobile spécialisé en React, Next.js, et technologies modernes",
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