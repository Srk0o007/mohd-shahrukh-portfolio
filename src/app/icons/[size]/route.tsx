import { ImageResponse } from 'next/og'
import { monogramElement } from '@/lib/brand-images'

/**
 * Web-manifest icons, 192 and 512 px PNG of the "MS" monogram (Phase 11, NFR-SEO-07).
 * Generated at build time for exactly these two sizes; any other size is a 404.
 */
const SIZES = ['192', '512'] as const

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }))
}

export async function GET(_: Request, { params }: { params: Promise<{ size: string }> }) {
  const px = Number((await params).size)
  return new ImageResponse(await monogramElement(px), { width: px, height: px })
}
