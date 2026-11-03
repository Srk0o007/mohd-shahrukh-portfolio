import approvalSoftwareManagement from '@/assets/images/projects/approval-software-management.png'
import campaignManagement from '@/assets/images/projects/campaign-management.png'
import digitalAssetManagement from '@/assets/images/projects/digital-asset-management.png'
import frontierMiningSolutions from '@/assets/images/projects/frontier-mining-solutions.png'
import jobListingWebsite from '@/assets/images/projects/job-listing-website.png'
import nilesAcademy from '@/assets/images/projects/niles-academy.png'
import quickcashtx from '@/assets/images/projects/quickcashtx.png'
import sosudatech from '@/assets/images/projects/sosudatech.png'
import swissCosmetics from '@/assets/images/projects/swiss-cosmetics.png'
import virtualUniversity from '@/assets/images/projects/virtual-university.png'
import type { Project } from './types'

const INTERNAL_NOTE = 'Internal product — no public link'

/**
 * CONTENT_SCHEMA §10 — all ten verified projects in live-site order (D6, D10, D11, D16).
 * Images are the original live-site files (byte-identical); projects 6–8 are low-resolution
 * 375×393 captures and are presented as such (DS-08 `contain`), not upscaled.
 * `pending` projects get a URL only when the owner supplies a verified, live one (Q11).
 */
export const projects = [
  {
    id: 'digital-asset-management',
    title: 'Digital Asset Management',
    subtitle: 'Marketing Resource Management (MRM)',
    group: 'enterprise',
    image: {
      src: digitalAssetManagement,
      alt: 'Blurred screenshot of the Digital Asset Management platform',
      blurred: true,
    },
    linkStatus: 'none',
    note: INTERNAL_NOTE,
  },
  {
    id: 'approval-software-management',
    title: 'Approval Software Management',
    subtitle: 'Collaborate - Approval & Review Workflows',
    group: 'enterprise',
    image: {
      src: approvalSoftwareManagement,
      alt: 'Blurred screenshot of the Approval Software Management (Collaborate) application',
      blurred: true,
    },
    linkStatus: 'none',
    note: INTERNAL_NOTE,
  },
  {
    id: 'campaign-management',
    title: 'Campaign Management',
    subtitle: 'LAM - Campaign Management Software',
    group: 'enterprise',
    image: {
      src: campaignManagement,
      alt: 'Blurred screenshot of the LAM campaign management software',
      blurred: true,
    },
    linkStatus: 'none',
    note: INTERNAL_NOTE,
    relatedExperienceId: 'brandsystems',
  },
  {
    id: 'job-listing-website',
    title: 'Job Listing Website',
    subtitle: 'Latest Jobs, Results, & more...',
    group: 'website',
    image: { src: jobListingWebsite, alt: 'Screenshot of the SarkariJobKhoj job listing website' },
    linkStatus: 'pending',
  },
  {
    id: 'sosudatech',
    title: 'SOSUDATECH Pvt. Ltd.',
    subtitle: 'Education',
    group: 'website',
    image: { src: sosudatech, alt: 'Screenshot of the SOSUDATECH Pvt. Ltd. website' },
    linkStatus: 'live',
    url: 'https://www.sosudatech.com/',
    date: 'Nov 2020',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap 4.5', 'Photoshop'],
  },
  {
    id: 'virtual-university',
    title: 'Virtual University',
    subtitle: 'Education',
    group: 'website',
    image: { src: virtualUniversity, alt: 'Screenshot of the Virtual University website' },
    linkStatus: 'pending',
  },
  {
    id: 'quickcashtx',
    title: 'QuickCashTx',
    subtitle: 'Banking & Fund Transfer',
    group: 'website',
    image: { src: quickcashtx, alt: 'Screenshot of the QuickCashTx banking and fund transfer app' },
    linkStatus: 'pending',
  },
  {
    id: 'niles-academy',
    title: 'Niles Academy',
    subtitle: 'Education & Teaching',
    group: 'website',
    image: { src: nilesAcademy, alt: 'Screenshot of the Niles Academy website' },
    linkStatus: 'pending',
  },
  {
    id: 'swiss-cosmetics',
    title: 'Swiss Cosmetics',
    subtitle: 'Beauty & Fashion',
    group: 'website',
    image: { src: swissCosmetics, alt: 'Screenshot of the Swiss Cosmetics website' },
    linkStatus: 'pending',
  },
  {
    id: 'frontier-mining-solutions',
    title: 'Frontier Mining Solutions',
    subtitle: 'Mining Services',
    group: 'website',
    image: {
      src: frontierMiningSolutions,
      alt: 'Screenshot of the Frontier Mining Solutions website',
    },
    linkStatus: 'pending',
  },
] as const satisfies readonly Project[]
