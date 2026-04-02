import fs from 'fs'
import path from 'path'

export interface StatItem {
  to: number
  suffix: string
  label: string
  desc: string
}

export interface ServiceItem {
  num: string
  title: string
  desc: string
}

export interface EventItem {
  id: number
  name: string
  city: string
  year: string
  type: string
  img: string
  tall: boolean
}

export interface TestimonialItem {
  quote: string
  name: string
  role: string
}

export interface SocialItem {
  label: string
  full: string
  href: string
}

export interface HeroContent {
  lines: string[]
  descriptor: string
  ctaWork: string
  ctaBook: string
}

export interface AboutContent {
  headlineLines: string[]
  body1: string
  body2: string
  tagline: string
  founded: string
  stats: StatItem[]
}

export interface ContactContent {
  headline: string
  email: string
  tagline: string
  socials: SocialItem[]
}

export interface SiteContent {
  hero: HeroContent
  about: AboutContent
  services: ServiceItem[]
  portfolio: EventItem[]
  testimonials: TestimonialItem[]
  contact: ContactContent
}

const CONTENT_PATH = path.join(process.cwd(), 'content', 'site.json')

export function getContent(): SiteContent {
  const raw = fs.readFileSync(CONTENT_PATH, 'utf-8')
  return JSON.parse(raw) as SiteContent
}

export function writeContent(data: SiteContent): void {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf-8')
}
