import { CircleAlertIcon, CircleCheckIcon } from '@/components/ui/icons'

export interface FormStatusProps {
  status: 'idle' | 'sending' | 'success' | 'error'
  successText: string
  /** The error text; occurrences of `email` become a mailto link. */
  errorText: string
  email: string
}

const panel = 'mt-6 flex items-start gap-3 rounded-sm bg-surface-2 p-4'

/**
 * Submission feedback (COMPONENT_VISUAL_SPEC §22, FR-CON-04). Both live regions exist from the
 * first render, so their content changes are announced: success in `role="status"` (polite),
 * failure in `role="alert"` with the email address as a fallback link.
 */
export function FormStatus({ status, successText, errorText, email }: FormStatusProps) {
  const [before, after] = splitOnce(errorText, email)
  return (
    <>
      <div role="status">
        {status === 'success' ? (
          <p className={panel}>
            <CircleCheckIcon size={20} className="mt-0.5 shrink-0 text-success" />
            {successText}
          </p>
        ) : null}
      </div>
      <div role="alert">
        {status === 'error' ? (
          <p className={panel}>
            <CircleAlertIcon size={20} className="mt-0.5 shrink-0 text-error" />
            <span>
              {before}
              {after === null ? null : (
                <>
                  <a href={`mailto:${email}`} className="font-medium underline underline-offset-4">
                    {email}
                  </a>
                  {after}
                </>
              )}
            </span>
          </p>
        ) : null}
      </div>
    </>
  )
}

function splitOnce(text: string, token: string): [string, string | null] {
  const index = text.indexOf(token)
  if (index === -1 || token === '') return [text, null]
  return [text.slice(0, index), text.slice(index + token.length)]
}
