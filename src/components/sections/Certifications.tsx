import { certifications } from '@/content'
import { CredentialRow, CredentialSection } from './CredentialRow'

/** 05 — Certifications (FR-RES-04, D3): name and issuer; no invented dates or credential URLs. */
export function Certifications() {
  return (
    <CredentialSection id="certifications">
      {certifications.map((cert) => (
        <CredentialRow
          key={cert.name}
          title={<h3 className="font-display text-h3 font-medium">{cert.name}</h3>}
          detail={
            <p>
              {cert.issuer}
              {'credentialType' in cert ? (
                <span className="block md:mt-0.5">{cert.credentialType}</span>
              ) : null}
            </p>
          }
        />
      ))}
    </CredentialSection>
  )
}
