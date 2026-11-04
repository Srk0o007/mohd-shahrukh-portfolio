import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button-styles'
import { Container } from '@/components/ui/Container'
import { uiCopy } from '@/content'

/**
 * FR-ERR-01 / NFR-SEO-09 — HTTP 404. Next.js adds `<meta name="robots" content="noindex">` to
 * not-found responses automatically; declaring robots here too would emit a duplicate tag.
 */
export const metadata: Metadata = {
  title: uiCopy.notFoundHeading,
}

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Container className="py-(--space-section)">
        <p
          aria-hidden="true"
          className="sec-num text-[clamp(110px,14vw,190px)] leading-none font-bold"
        >
          404
        </p>
        <h1 className="mt-6 text-h2">{uiCopy.notFoundHeading}</h1>
        <p className="mt-4 text-lead">{uiCopy.notFoundText}</p>
        <Link href="/" className={buttonClasses('primary', 'lg', 'mt-10')}>
          {uiCopy.notFoundLink}
        </Link>
      </Container>
    </main>
  )
}
