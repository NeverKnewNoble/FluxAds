// Re-exported so existing imports (`import { type Work } from './content'`) keep working.
export type { Work, HeroTile } from '../../lib/gallery-curation'

/* ----------------------------------------------------------------------------
   Flux Ads — site content
   Edit copy here, or swap the showcase placeholders for real media `src`s.
---------------------------------------------------------------------------- */

/* WhatsApp — "Text us" buttons open a chat to this number with a prefilled note.
   Number: +233 53 265 1684 (digits only, no + or spaces, for the wa.me link). */
const WHATSAPP_NUMBER = '233532651684'
const WHATSAPP_MESSAGE =
  "Hi Flux Ads! 👋 I'd like to create some AI ad content. Here's what I have in mind:"

export const WHATSAPP_DISPLAY = '+233 53 265 1684'
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`
export const TIKTOK_LINK =
  'https://www.tiktok.com/@fluxads.fx?_r=1&_t=ZS-97ESxNxiXI4'

export type Service = {
  no: string
  title: string
  blurb: string
}

export const services: Service[] = [
  {
    no: '01',
    title: 'AI Product Imagery',
    blurb:
      'Studio-grade product shots generated from a single reference — every angle, surface and light setup, no studio booking required.',
  },
  {
    no: '02',
    title: 'AI Video & Motion Ads',
    blurb:
      'Scroll-stopping motion spots for social and web. Hero loops, product reveals and lifestyle scenes rendered in any aspect ratio.',
  },
  {
    no: '03',
    title: 'Image Restoration',
    blurb:
      'Old, low-res or damaged shots rebuilt to crisp, modern, campaign-ready quality — colour, detail and resolution restored.',
  },
  {
    no: '04',
    title: 'Creative Direction',
    blurb:
      'Concept, styling and art direction tuned to your brand so every frame feels intentional — not generic AI output.',
  },
]

export type Category = {
  label: string
  copy: string
}

export const categories: Category[] = [
  {
    label: 'Product Photography',
    copy: 'Clean, dramatic or editorial — packshots and hero stills that sell.',
  },
  {
    label: 'Food & Beverage',
    copy: 'Mouth-watering, true-to-life food and drink visuals for menus and ads.',
  },
  {
    label: 'E-Commerce',
    copy: 'On-model, on-white and lifestyle sets built for catalogue scale.',
  },
  {
    label: 'Beauty & Fashion',
    copy: 'Skin, fabric and texture rendered with luxury-campaign polish.',
  },
  {
    label: 'Advertising',
    copy: 'Full creative concepts — stills and motion — built to convert.',
  },
]
