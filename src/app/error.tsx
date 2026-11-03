'use client'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { uiCopy } from '@/content/ui-copy'

/** Segment error boundary (ARCHITECTURE §12): accessible message, no stack traces. */
export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Container className="py-(--space-section)">
        <h1 className="font-display text-h2 font-medium">{uiCopy.errorHeading}</h1>
        <p className="mt-4 text-lead">{uiCopy.errorText}</p>
        <Button size="lg" className="mt-10" onClick={() => reset()}>
          {uiCopy.errorRetry}
        </Button>
      </Container>
    </main>
  )
}
