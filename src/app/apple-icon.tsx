import { ImageResponse } from 'next/og'
import { monogramElement } from '@/lib/brand-images'

/** Apple touch icon, 180×180 PNG of the "MS" monogram (Phase 11, NFR-SEO-07). Built statically. */
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  return new ImageResponse(await monogramElement(180), size)
}
