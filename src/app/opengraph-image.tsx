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
  const [fraunces, inter, interBold] = await Promise.all([
    loadGoogleFont('Fraunces', 500, profile.name),
    loadGoogleFont('Inter', 500, `${profile.location}${host}`),
    loadGoogleFont('Inter', 600, profile.title),
  ])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: BRAND.paper,
        color: BRAND.ink,
        fontFamily: 'Inter',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'Fraunces', fontSize: 132, lineHeight: 1, letterSpacing: -3 }}>
          {profile.name}
        </div>
        <div style={{ display: 'flex', marginTop: 40 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              background: BRAND.accent,
              color: BRAND.ink,
              padding: '6px 18px',
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
          borderTop: `2px solid ${BRAND.rule}`,
          paddingTop: 28,
          fontSize: 30,
          color: BRAND.muted,
        }}
      >
        <span>{profile.location}</span>
        <span style={{ color: BRAND.ink }}>{host}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 500, style: 'normal' },
        { name: 'Inter', data: inter, weight: 500, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 600, style: 'normal' },
      ],
    },
  )
}
