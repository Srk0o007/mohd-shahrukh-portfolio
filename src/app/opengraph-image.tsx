import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/site'
import { profile } from '@/content'
import { BRAND, loadGoogleFont } from '@/lib/brand-images'

/**
 * Social preview image, 1200×630 (Phase 11, owner decision 2). Rendered once at build time
 * from existing content only: name, title, location and the site address. Used for Open Graph
 * and, via `summary_large_image`, for X/Twitter.
 */
export const alt = `${profile.name} — ${profile.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const host = new URL(siteConfig.url).host

export default async function OpenGraphImage() {
  const [andikaBold, andika] = await Promise.all([
    loadGoogleFont('Andika', 700, `${profile.name}${profile.title}`),
    loadGoogleFont('Andika', 400, `${profile.location}${host}`),
  ])
  const [firstName, ...rest] = profile.name.split(' ')

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: BRAND.frame,
        color: BRAND.heading,
        fontFamily: 'Andika',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 132, fontWeight: 700, lineHeight: 1 }}>
          <span>{firstName}</span>
          <span
            style={{
              marginLeft: 32,
              backgroundImage: `linear-gradient(110deg, ${BRAND.accent}, ${BRAND.accent2})`,
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {rest.join(' ')}
          </span>
        </div>
        <div style={{ display: 'flex', marginTop: 44 }}>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              background: BRAND.accent,
              color: BRAND.onAccent,
              padding: '8px 26px',
              borderRadius: 999,
            }}
          >
            {profile.title}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `2px solid ${BRAND.line}`,
          paddingTop: 28,
          fontSize: 30,
          color: BRAND.sub,
        }}
      >
        <span>{profile.location}</span>
        <span style={{ color: BRAND.accent }}>{host}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Andika', data: andikaBold, weight: 700, style: 'normal' },
        { name: 'Andika', data: andika, weight: 400, style: 'normal' },
      ],
    },
  )
}
