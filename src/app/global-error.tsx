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
          <h1 className="text-h2">{uiCopy.errorHeading}</h1>
          <p className="mt-4 text-lead">{uiCopy.errorText}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-10 inline-flex min-h-13 cursor-pointer items-center rounded-pill border border-transparent bg-accent px-7 font-bold text-on-accent"
          >
            {uiCopy.errorRetry}
          </button>
        </main>
      </body>
    </html>
  )
}
