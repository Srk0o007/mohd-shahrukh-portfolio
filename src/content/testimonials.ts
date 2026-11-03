import diveshKumar from '@/assets/images/testimonials/divesh-kumar.jpg'
import sowmitNag from '@/assets/images/testimonials/sowmit-nag.png'
import type { Testimonial } from './types'

/**
 * CONTENT_SCHEMA §12 — [S] verbatim (enclosing quotation marks removed; the <blockquote>
 * provides them). D18: publication confirmed by the owner; no company names.
 */
export const testimonials = [
  {
    quote:
      'Always available to help, incredibly proficient, hits deadlines without fail, hard working and trustworthy. In my experience, no project is too much trouble, and with Mohd Shahrukh you really get a rare entity – someone that can simplify what can be a very complex industry at times.',
    name: 'Sowmit Nag',
    role: 'Sr. Web Designer | Co-Owner',
    photo: { src: sowmitNag, alt: 'Photo of Sowmit Nag' },
  },
  {
    quote:
      'I’m always impressed by how you treat everyone with the same respect and a positive attitude. You genuinely embody the company’s spirit and our core values in everything you do and you inspire us all to do the same!',
    name: 'Divesh Kumar',
    role: 'CTO | Technology Evangelist',
    photo: { src: diveshKumar, alt: 'Photo of Divesh Kumar' },
  },
] as const satisfies readonly Testimonial[]
