import { getImageProps, type StaticImageData } from 'next/image'

export interface ResponsiveImageProps {
  src: StaticImageData
  alt: string
  /** Layout-specific `sizes` (COMPONENT_ARCHITECTURE §6). */
  sizes: string
  /** LCP image: fetched eagerly with high priority (ADR 0010; `priority` is deprecated in Next 16). */
  priority?: boolean
  className?: string
}

/**
 * Optimised image without client JavaScript (ADR 0010 addendum, NFR-PERF-05).
 * `getImageProps()` produces the same optimised `src`/`srcSet`/`sizes` as <Image>, but renders a
 * plain server-side <img>, so the next/image client component is not shipped to the browser.
 */
export function ResponsiveImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: ResponsiveImageProps) {
  const { props } = getImageProps({
    src,
    alt,
    sizes,
    ...(priority ? { fetchPriority: 'high', loading: 'eager' } : { loading: 'lazy' }),
  })
  // eslint-disable-next-line @next/next/no-img-element -- getImageProps supplies the optimised srcSet; avoids next/image client JS
  return <img {...props} alt={alt} className={className} />
}
