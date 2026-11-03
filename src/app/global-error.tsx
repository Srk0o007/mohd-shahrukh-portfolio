'use client'

import { uiCopy } from '@/content/ui-copy'
import './globals.css'

/** Root error boundary (ARCHITECTURE §12): replaces the root layout, so it renders <html>/<body>. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <main id="main" className="mx-auto max-w-180 px-5 py-24">
          <h1 className="text-h2 font-semibold">{uiCopy.errorHeading}</h1>
          <p className="mt-4 text-lead">{uiCopy.errorText}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-10 inline-flex min-h-13 items-center rounded-pill bg-primary px-7 text-ui font-semibold text-on-primary"
          >
            {uiCopy.errorRetry}
          </button>
        </main>
      </body>
    </html>
  )
}
