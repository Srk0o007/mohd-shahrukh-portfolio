import { education, formatCopy, uiCopy } from '@/content'
import { CredentialRow, CredentialSection } from './CredentialRow'

/** 06 — Education (FR-RES-05, D2): the B.Tech only; "Graduated 2019" wording from the resume. */
export function Education() {
  return (
    <CredentialSection id="education">
      {education.map((entry) => (
        <CredentialRow
          key={entry.degree}
          title={
            <>
              <h3 className="font-display text-h3 font-medium">{entry.degree}</h3>
              <p className="mt-1.5">{entry.institution}</p>
            </>
          }
          detail={
            <p className="tabular-nums">
              {formatCopy(uiCopy.graduated, { year: entry.graduated })}
            </p>
          }
        />
      ))}
    </CredentialSection>
  )
}
