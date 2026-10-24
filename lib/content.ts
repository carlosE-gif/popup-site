import fs from 'fs'
import path from 'path'
import { del, list, put } from '@vercel/blob'
import { revalidateTag, unstable_cache } from 'next/cache'
import seed from '@/content/site.json'

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
  desc?: string
  link?: string
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
  phone: string
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
const BLOB_PREFIX = 'content/site'
const CONTENT_TAG = 'site-content'
const REQUIRED_KEYS: (keyof SiteContent)[] = ['hero', 'about', 'services', 'portfolio', 'testimonials', 'contact']

// Vercel injects one of these when a Blob store is connected; without them we use the local file (dev).
export function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

export function isSiteContent(data: unknown): data is SiteContent {
  return typeof data === 'object' && data !== null && REQUIRED_KEYS.every((key) => key in data)
}

// Each save is a new blob with a random suffix, so its URL is never stale in the CDN.
// The newest one wins; content/site.json is the seed until the first save.
const readBlobContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const { blobs } = await list({ prefix: BLOB_PREFIX })
    if (blobs.length === 0) return seed as SiteContent
    const latest = blobs.reduce((a, b) => (b.uploadedAt > a.uploadedAt ? b : a))
    const res = await fetch(latest.url)
    if (!res.ok) throw new Error(`Failed to fetch ${latest.url}: ${res.status}`)
    return (await res.json()) as SiteContent
  },
  [CONTENT_TAG],
  { tags: [CONTENT_TAG] }
)

function readLocalContent(): SiteContent {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8')) as SiteContent
}

export async function getContent(): Promise<SiteContent> {
  try {
    return blobEnabled() ? await readBlobContent() : readLocalContent()
  } catch (err) {
    throw new Error(`Failed to read site content: ${err instanceof Error ? err.message : String(err)}`)
  }
}

async function writeBlobContent(data: SiteContent): Promise<void> {
  const { blobs: previous } = await list({ prefix: BLOB_PREFIX })
  await put(`${BLOB_PREFIX}.json`, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'application/json',
  })
  revalidateTag(CONTENT_TAG)
  // ponytail: cleanup only, the newest blob is read regardless, so a failure here just leaves old copies
  if (previous.length > 0) {
    await del(previous.map((b) => b.url)).catch((err) => console.error('Failed to delete old content blobs:', err))
  }
}

export async function writeContent(data: SiteContent): Promise<void> {
  try {
    if (blobEnabled()) await writeBlobContent(data)
    else fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    throw new Error(`Failed to write site content: ${err instanceof Error ? err.message : String(err)}`)
  }
}
