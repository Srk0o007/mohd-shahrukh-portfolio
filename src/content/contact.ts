import type { ContactDetails, CtaBand, Footer, SocialLink } from './types'

/** CONTENT_SCHEMA §12 — [S] + [R]; D4 (one phone, no Twitter), D14 (Bangalore). */
export const contactDetails = {
  heading: "Let's get in touch",
  intro:
    'I enjoy discussing new projects and design challenges. Please share as much info as possible so we can get the most out of our first catch-up.',
  location: 'Bangalore, Karnataka, India',
  phone: { display: '(+91) 9760787661', tel: 'tel:+919760787661' },
  email: 'khan.shahrukh156@gmail.com',
  form: {
    heading: 'Send Me a Message',
    fields: {
      name: 'What is Your Name',
      email: 'Your Email Address',
      message: 'How can I Help you?',
    },
    submitLabel: 'Send',
  },
} as const satisfies ContactDetails

export const socialLinks = [
  {
    id: 'linkedin',
    label: 'LinkedIn profile',
    href: 'https://www.linkedin.com/in/mohd-shah-rukh-703aa3153/',
  },
  { id: 'github', label: 'GitHub profile', href: 'https://github.com/Srk0o007' },
  { id: 'email', label: 'Email Mohd Shahrukh', href: 'mailto:khan.shahrukh156@gmail.com' },
] as const satisfies readonly SocialLink[]

/** [S] heading and labels; D19 (Call Me! → tel:). */
export const ctaBand = {
  heading: 'Interested in working with me?',
  call: { label: 'Call Me!', href: 'tel:+919760787661' },
  hire: { label: 'Hire Me!', href: '#contact' },
} as const satisfies CtaBand

export const footer = {
  copyrightTemplate: 'Copyright © {year} Mohd Shahrukh. All Rights Reserved.',
  credit: 'Designed by Mohd Shahrukh',
} as const satisfies Footer
