import type { Metadata, Viewport } from 'next'
import { Andika } from 'next/font/google'
import type { ReactNode } from 'react'
import { ParticleWaveLayer } from '@/components/layout/ParticleWaveLayer'
import { JsFlagScript } from '@/components/layout/JsFlagScript'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SkipLink } from '@/components/layout/SkipLink'
import { siteConfig } from '@/config/site'
import { profile, siteMeta, uiCopy } from '@/content'
import './globals.css'

/*
 * Font (TYPOGRAPHY.md, ADR 0014): Andika 400/700. next/font/google fetches the files at build
 * time and serves them from this origin — the browser never requests Google Fonts.
 */
const andika = Andika({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-andika',
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
  // Dark only (ADR 0014): the page colour behind the content column.
  themeColor: '#10100d',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteMeta.locale} className={andika.variable} suppressHydrationWarning>
      <head>
        <JsFlagScript />
      </head>
      <body>
        <ParticleWaveLayer />
        <SkipLink label={uiCopy.skipLink} />
        {/*
          Content column (1240 px): solid black from 1024 px so the wave shows only in the side
          areas; translucent below so it still reads faintly on phones and tablets.
        */}
        <div className="relative mx-auto min-h-screen max-w-310 bg-frame/72 lg:border-x lg:border-[rgb(255_255_255/0.05)] lg:bg-frame lg:shadow-[0_0_120px_rgb(0_0_0/0.6)]">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
