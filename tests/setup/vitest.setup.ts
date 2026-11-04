import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

/**
 * next/image needs Next's image loader and StaticImageData; in Vitest, static image imports
 * resolve to URL strings. Render a plain <img> with the accessibility-relevant props instead.
 */
type MockImageProps = { src: string | { src: string }; alt: string; className?: string }
const srcOf = (src: MockImageProps['src']) => (typeof src === 'string' ? src : src.src)

vi.mock('next/image', () => ({
  default: (props: MockImageProps) =>
    createElement('img', { src: srcOf(props.src), alt: props.alt, className: props.className }),
  getImageProps: (props: MockImageProps & Record<string, unknown>) => ({
    props: { ...props, src: srcOf(props.src) },
  }),
}))
