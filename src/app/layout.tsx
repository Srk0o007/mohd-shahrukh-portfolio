import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SkipLink } from '@/components/layout/SkipLink'
import { ThemeScript } from '@/components/layout/ThemeScript'
import { siteConfig } from '@/config/site'
import { profile, siteMeta, uiCopy } from '@/content'
import './globals.css'

/*
 * Fonts (TYPOGRAPHY §2, ARCHITECTURE §10): next/font/google fetches the files at build time and
 * serves them from this origin — the browser never requests Google Fonts. Two variable files.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/*
 * Metadata (ARCHITECTURE §11). The social image comes from app/opengraph-image.tsx (Phase 11);
 * Next adds og:image (and X/Twitter falls back to it) with its width, height and alt.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteMeta.title,
  description: siteMeta.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: profile.name,
    title: siteMeta.title,
    description: siteMeta.description,
    locale: siteMeta.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMeta.title,
    description: siteMeta.description,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2ea' },
    { media: '(prefers-color-scheme: dark)', color: '#121211' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={siteMeta.locale}
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <SkipLink label={uiCopy.skipLink} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
