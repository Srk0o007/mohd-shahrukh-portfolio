import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button-styles'
import { Container } from '@/components/ui/Container'
import { uiCopy } from '@/content'

/**
 * FR-ERR-01 / NFR-SEO-09 — HTTP 404. Next.js adds `<meta name="robots" content="noindex">` to
 * not-found responses automatically; declaring robots here too would emit a duplicate tag.
 * Header and footer arrive with the layout in Phase 07.
 */
export const metadata: Metadata = {
  title: uiCopy.notFoundHeading,
}

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Container className="py-(--space-section)">
        <p aria-hidden="true" className="font-display text-display-2 text-text-muted font-medium">
          404
        </p>
        <h1 className="font-display mt-6 text-h2 font-medium">{uiCopy.notFoundHeading}</h1>
        <p className="mt-4 text-lead">{uiCopy.notFoundText}</p>
        <Link href="/" className={buttonClasses('primary', 'lg', 'mt-10')}>
          {uiCopy.notFoundLink}
        </Link>
      </Container>
    </main>
  )
}
