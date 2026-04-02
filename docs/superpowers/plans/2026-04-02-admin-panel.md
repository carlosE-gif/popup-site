# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a password-protected `/admin` panel that lets PopUp edit all site content (text, stats, events, testimonials, contact info) and persist changes to a JSON file that the public site reads from.

**Architecture:** All editable content moves from hardcoded component strings into `content/site.json`. A server-side `getContent()` reads the file and passes typed props to each section component. An `/api/content` route reads and writes the JSON. A cookie-based auth system protects `/admin` via middleware.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion (already installed), `fs` (Node built-in for file I/O), `next/cache` `revalidatePath` for cache busting after saves.

---

## File Map

| File | Status | Responsibility |
|------|--------|----------------|
| `content/site.json` | **Create** | Single source of truth for all editable site content |
| `lib/content.ts` | **Create** | TypeScript types + `getContent()` + `writeContent()` |
| `middleware.ts` | **Create** | Protect `/admin` routes, redirect unauthenticated users to `/admin/login` |
| `app/api/auth/route.ts` | **Create** | POST login (set cookie), DELETE logout (clear cookie) |
| `app/api/content/route.ts` | **Create** | GET (read JSON), PUT (write JSON + revalidate `/`) |
| `app/admin/login/page.tsx` | **Create** | Login form — email/password, posts to `/api/auth` |
| `app/admin/page.tsx` | **Create** | Dashboard — sidebar tabs, form fields per section, save button |
| `app/page.tsx` | **Modify** | Read content via `getContent()`, pass as props to each section |
| `components/sections/Hero.tsx` | **Modify** | Accept `HeroContent` prop instead of hardcoded strings |
| `components/sections/About.tsx` | **Modify** | Accept `AboutContent` prop |
| `components/sections/Services.tsx` | **Modify** | Accept `ServicesContent` prop |
| `components/sections/Portfolio.tsx` | **Modify** | Accept `PortfolioContent` prop |
| `components/sections/Testimonials.tsx` | **Modify** | Accept `TestimonialsContent` prop |
| `components/sections/Contact.tsx` | **Modify** | Accept `ContactContent` prop |
| `.env.local` | **Create** | `ADMIN_PASSWORD` and `ADMIN_SECRET` env vars |

---

## Task 1: Content schema — `content/site.json` + `lib/content.ts`

**Files:**
- Create: `content/site.json`
- Create: `lib/content.ts`

- [ ] **Step 1: Create `content/site.json`**

```json
{
  "hero": {
    "lines": ["THE ART", "BEHIND", "THE NIGHT"],
    "descriptor": "PopUp is the intervener group behind the region's most precise, unforgettable club nights, private parties, and brand events.",
    "ctaWork": "View Our Work",
    "ctaBook": "Book PopUp"
  },
  "about": {
    "headlineLines": ["Precision.", "Craft.", "Execution."],
    "body1": "PopUp isn't an agency. We're the interveners — the team that steps in and transforms a space into an experience. We begin with intention and end with something unforgettable.",
    "body2": "From intimate private parties to large-scale brand activations, we bring precision to every detail: concept, crowd, culture, and craft. Our network spans the region's most exclusive venues, artists, and brands.",
    "tagline": "Sharp nights. Perfect execution.",
    "founded": "Est. 2020",
    "stats": [
      { "to": 150, "suffix": "+", "label": "Events Produced", "desc": "Club nights, private gatherings, and brand activations across the region." },
      { "to": 60, "suffix": "+", "label": "Venues Partnered", "desc": "From underground rooms to rooftop terraces — every space, precisely chosen." },
      { "to": 20, "suffix": "K+", "label": "Guests", "desc": "Thousands of nights, one consistent promise: you will remember this." }
    ]
  },
  "services": [
    { "num": "01", "title": "Event Concept & Planning", "desc": "From initial spark to final execution — we architect the entire experience." },
    { "num": "02", "title": "DJ & Artist Booking", "desc": "Direct access to the region's best selectors, headliners, and rising acts." },
    { "num": "03", "title": "Venue Sourcing & Partnerships", "desc": "We know every room worth owning. Rooftops, basements, warehouses, terraces." },
    { "num": "04", "title": "Lighting & Production", "desc": "Sound systems, staging, and lighting that transforms any space into atmosphere." },
    { "num": "05", "title": "Brand Activations & Sponsorships", "desc": "We integrate brands into the night — not on top of it. Seamless, credible." },
    { "num": "06", "title": "Private & Corporate Parties", "desc": "The same precision applied to intimate gatherings and exclusive corporate events." }
  ],
  "portfolio": [
    { "id": 1, "name": "Void", "city": "Beirut", "year": "2024", "type": "Club Nights", "img": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", "tall": true },
    { "id": 2, "name": "Edition XII", "city": "Dubai", "year": "2024", "type": "Brand Events", "img": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80", "tall": false },
    { "id": 3, "name": "After Hours", "city": "Beirut", "year": "2023", "type": "Club Nights", "img": "https://images.unsplash.com/photo-1571266752820-89a5571c0b43?w=600&q=80", "tall": false },
    { "id": 4, "name": "Casa Blanche", "city": "Mykonos", "year": "2023", "type": "Private", "img": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80", "tall": true },
    { "id": 5, "name": "Neon Chapter", "city": "Riyadh", "year": "2024", "type": "Brand Events", "img": "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80", "tall": false },
    { "id": 6, "name": "Private Shore", "city": "Cyprus", "year": "2023", "type": "Private", "img": "https://images.unsplash.com/photo-1519671282429-b44b41c2a973?w=800&q=80", "tall": false }
  ],
  "testimonials": [
    { "quote": "PopUp approached our brand event with a level of craft I've never seen from an event group before. Every single detail was intentional.", "name": "Nour Khalil", "role": "Marketing Director, Maison Blanc" },
    { "quote": "From venue to lineup to the energy in the room — they executed everything without a single misstep. The night sold out in 48 hours.", "name": "Tarek Saad", "role": "Co-Founder, Frequency Club" },
    { "quote": "Sharp nights. That's the only way to put it. PopUp doesn't do average — they do memorable.", "name": "Lara Moussa", "role": "Private Client" },
    { "quote": "The way they integrated our product into the night felt completely organic. The audience didn't feel sold to — they felt invited.", "name": "Sami Haddad", "role": "Brand Manager, Arak & Co." }
  ],
  "contact": {
    "headline": "Let's Draw Something Together",
    "email": "hello@popup.events",
    "tagline": "Sharp Nights. Perfect Execution.",
    "socials": [
      { "label": "IG", "full": "Instagram", "href": "#" },
      { "label": "TK", "full": "TikTok", "href": "#" },
      { "label": "WA", "full": "WhatsApp", "href": "#" }
    ]
  }
}
```

- [ ] **Step 2: Create `lib/content.ts`**

```ts
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
```

- [ ] **Step 3: Verify the file parses correctly**

```bash
cd popup-site && node -e "const c = require('./content/site.json'); console.log(Object.keys(c))"
```

Expected output: `[ 'hero', 'about', 'services', 'portfolio', 'testimonials', 'contact' ]`

- [ ] **Step 4: Commit**

```bash
git add content/site.json lib/content.ts
git commit -m "feat: add content schema and read/write utilities"
```

---

## Task 2: Environment variables + auth API route

**Files:**
- Create: `.env.local`
- Create: `app/api/auth/route.ts`

- [ ] **Step 1: Create `.env.local`**

```bash
ADMIN_PASSWORD=popup2024
ADMIN_SECRET=popup-admin-secret-change-me
```

(These are defaults — tell the client to change them before going live.)

- [ ] **Step 2: Create `app/api/auth/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  cookies().set('popup_admin', process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  cookies().delete('popup_admin')
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Test login manually**

Start dev server, then:
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"popup2024"}'
```

Expected: `{"ok":true}` with a `Set-Cookie` header containing `popup_admin`.

```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"wrong"}'
```

Expected: `{"error":"Invalid password"}` with status 401.

- [ ] **Step 4: Commit**

```bash
git add app/api/auth/route.ts
git commit -m "feat: add cookie-based admin auth API"
# Do NOT commit .env.local — it is in .gitignore
```

---

## Task 3: Content API route

**Files:**
- Create: `app/api/content/route.ts`

- [ ] **Step 1: Create `app/api/content/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getContent, writeContent, SiteContent } from '@/lib/content'

function isAuthed(): boolean {
  const session = cookies().get('popup_admin')?.value
  return session === process.env.ADMIN_SECRET
}

export async function GET() {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const content = getContent()
  return NextResponse.json(content)
}

export async function PUT(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: SiteContent = await req.json()
  writeContent(body)
  revalidatePath('/')

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Verify GET returns content (requires being logged in first)**

```bash
# First login to get cookie
curl -c /tmp/cookies.txt -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"popup2024"}'

# Then fetch content
curl -b /tmp/cookies.txt http://localhost:3000/api/content | head -c 200
```

Expected: First 200 chars of the site.json content.

- [ ] **Step 3: Commit**

```bash
git add app/api/content/route.ts
git commit -m "feat: add content GET/PUT API with auth guard"
```

---

## Task 4: Middleware — protect `/admin`

**Files:**
- Create: `middleware.ts` (project root, next to `app/`)

- [ ] **Step 1: Create `middleware.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and auth API through
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('popup_admin')?.value
    if (!session || session !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Verify redirect works**

Visit `http://localhost:3000/admin` without being logged in.
Expected: Browser redirects to `http://localhost:3000/admin/login`.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: protect /admin routes with session middleware"
```

---

## Task 5: Admin login page

**Files:**
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Create `app/admin/login/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p
          className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-8"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          PopUp Admin
        </p>
        <h1
          className="font-playfair font-bold italic text-4xl text-white mb-12"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[10px] tracking-[0.2em] text-white/30 uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="bg-transparent border-b border-white/15 py-3 text-white text-sm font-sans placeholder:text-white/20 focus:border-white focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <p
              className="text-[11px] text-white/50 tracking-wider"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-mono text-[11px] tracking-[0.2em] uppercase px-8 py-4 bg-white text-[#0A0A0A] hover:bg-white/85 transition-colors disabled:opacity-40"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {loading ? "Signing in..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify login flow**

1. Visit `http://localhost:3000/admin` → should redirect to `/admin/login`
2. Enter wrong password → should show "Wrong password."
3. Enter `popup2024` → should redirect to `/admin` (will 404 until Task 6)

- [ ] **Step 3: Commit**

```bash
git add app/admin/login/page.tsx
git commit -m "feat: add admin login page"
```

---

## Task 6: Admin dashboard page

**Files:**
- Create: `app/admin/page.tsx`

This is the main editing UI. It fetches current content from `/api/content`, lets the user edit fields in tabbed sections, and saves with a PUT to `/api/content`.

- [ ] **Step 1: Create `app/admin/page.tsx`**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent, ServiceItem, EventItem, TestimonialItem, SocialItem } from "@/lib/content";

const TABS = ["Hero", "About", "Services", "Portfolio", "Testimonials", "Contact"] as const;
type Tab = typeof TABS[number];

const FIELD = "bg-transparent border-b border-white/10 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:border-white/50 focus:outline-none transition-colors w-full";
const LABEL = "text-[9px] tracking-[0.2em] text-white/30 uppercase mb-1 block";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => {
        if (r.status === 401) router.push("/admin/login");
        return r.json();
      })
      .then(setContent);
  }, [router]);

  const save = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [content]);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const set = (path: string, value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev) as Record<string, unknown>;
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return next as SiteContent;
    });
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-widest font-mono">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/08 px-8 py-4 flex items-center justify-between">
        <span className="font-playfair font-bold italic text-xl text-white">PopUp</span>
        <div className="flex items-center gap-6">
          <a
            href="/"
            target="_blank"
            className="text-[10px] tracking-[0.15em] text-white/30 hover:text-white/60 uppercase transition-colors"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            View Site ↗
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="text-[10px] tracking-[0.2em] uppercase px-6 py-2.5 bg-white text-[#0A0A0A] hover:bg-white/85 transition-colors disabled:opacity-50"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
          <button
            onClick={logout}
            className="text-[10px] tracking-[0.15em] text-white/20 hover:text-white/50 uppercase transition-colors"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 border-r border-white/08 py-8 px-4 flex-shrink-0">
          <nav className="flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-left text-[11px] tracking-[0.15em] uppercase px-3 py-2.5 transition-colors ${
                  tab === t
                    ? "bg-white/08 text-white"
                    : "text-white/30 hover:text-white/60"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {t}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-10">

          {/* ── HERO ── */}
          {tab === "Hero" && (
            <Section title="Hero">
              <Field label="Headline Line 1">
                <input className={FIELD} value={content.hero.lines[0]} onChange={(e) => set("hero.lines", [e.target.value, content.hero.lines[1], content.hero.lines[2]])} />
              </Field>
              <Field label="Headline Line 2">
                <input className={FIELD} value={content.hero.lines[1]} onChange={(e) => set("hero.lines", [content.hero.lines[0], e.target.value, content.hero.lines[2]])} />
              </Field>
              <Field label="Headline Line 3">
                <input className={FIELD} value={content.hero.lines[2]} onChange={(e) => set("hero.lines", [content.hero.lines[0], content.hero.lines[1], e.target.value])} />
              </Field>
              <Field label="Descriptor">
                <textarea className={FIELD} rows={3} value={content.hero.descriptor} onChange={(e) => set("hero.descriptor", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-6">
                <Field label="CTA — View Work">
                  <input className={FIELD} value={content.hero.ctaWork} onChange={(e) => set("hero.ctaWork", e.target.value)} />
                </Field>
                <Field label="CTA — Book">
                  <input className={FIELD} value={content.hero.ctaBook} onChange={(e) => set("hero.ctaBook", e.target.value)} />
                </Field>
              </div>
            </Section>
          )}

          {/* ── ABOUT ── */}
          {tab === "About" && (
            <Section title="About">
              {content.about.headlineLines.map((line, i) => (
                <Field key={i} label={`Headline Line ${i + 1}`}>
                  <input className={FIELD} value={line} onChange={(e) => {
                    const next = [...content.about.headlineLines];
                    next[i] = e.target.value;
                    set("about.headlineLines", next);
                  }} />
                </Field>
              ))}
              <Field label="Paragraph 1">
                <textarea className={FIELD} rows={4} value={content.about.body1} onChange={(e) => set("about.body1", e.target.value)} />
              </Field>
              <Field label="Paragraph 2">
                <textarea className={FIELD} rows={4} value={content.about.body2} onChange={(e) => set("about.body2", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-6">
                <Field label="Tagline">
                  <input className={FIELD} value={content.about.tagline} onChange={(e) => set("about.tagline", e.target.value)} />
                </Field>
                <Field label="Founded">
                  <input className={FIELD} value={content.about.founded} onChange={(e) => set("about.founded", e.target.value)} />
                </Field>
              </div>
              <Divider label="Stats" />
              {content.about.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 mb-4">
                  <Field label="Number">
                    <input className={FIELD} type="number" value={stat.to} onChange={(e) => {
                      const next = content.about.stats.map((s, j) => j === i ? { ...s, to: Number(e.target.value) } : s);
                      set("about.stats", next);
                    }} />
                  </Field>
                  <Field label="Suffix">
                    <input className={FIELD} value={stat.suffix} onChange={(e) => {
                      const next = content.about.stats.map((s, j) => j === i ? { ...s, suffix: e.target.value } : s);
                      set("about.stats", next);
                    }} />
                  </Field>
                  <Field label="Label">
                    <input className={FIELD} value={stat.label} onChange={(e) => {
                      const next = content.about.stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s);
                      set("about.stats", next);
                    }} />
                  </Field>
                  <Field label="Description">
                    <input className={FIELD} value={stat.desc} onChange={(e) => {
                      const next = content.about.stats.map((s, j) => j === i ? { ...s, desc: e.target.value } : s);
                      set("about.stats", next);
                    }} />
                  </Field>
                </div>
              ))}
            </Section>
          )}

          {/* ── SERVICES ── */}
          {tab === "Services" && (
            <Section title="Services">
              {content.services.map((svc, i) => (
                <div key={i} className="mb-8 pb-8 border-b border-white/06 last:border-0">
                  <p className="text-[9px] tracking-widest text-white/20 uppercase mb-4" style={{ fontFamily: "var(--font-space-mono)" }}>{svc.num}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Title">
                      <input className={FIELD} value={svc.title} onChange={(e) => {
                        const next = content.services.map((s, j) => j === i ? { ...s, title: e.target.value } : s);
                        set("services", next);
                      }} />
                    </Field>
                    <Field label="Description">
                      <input className={FIELD} value={svc.desc} onChange={(e) => {
                        const next = content.services.map((s, j) => j === i ? { ...s, desc: e.target.value } : s);
                        set("services", next);
                      }} />
                    </Field>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ── PORTFOLIO ── */}
          {tab === "Portfolio" && (
            <Section title="Portfolio">
              {content.portfolio.map((event, i) => (
                <div key={event.id} className="mb-8 pb-8 border-b border-white/06 last:border-0">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <Field label="Event Name">
                      <input className={FIELD} value={event.name} onChange={(e) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, name: e.target.value } : ev);
                        set("portfolio", next);
                      }} />
                    </Field>
                    <Field label="City">
                      <input className={FIELD} value={event.city} onChange={(e) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, city: e.target.value } : ev);
                        set("portfolio", next);
                      }} />
                    </Field>
                    <Field label="Year">
                      <input className={FIELD} value={event.year} onChange={(e) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, year: e.target.value } : ev);
                        set("portfolio", next);
                      }} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Type (Club Nights / Private / Brand Events)">
                      <input className={FIELD} value={event.type} onChange={(e) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, type: e.target.value } : ev);
                        set("portfolio", next);
                      }} />
                    </Field>
                    <Field label="Image URL">
                      <input className={FIELD} value={event.img} onChange={(e) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, img: e.target.value } : ev);
                        set("portfolio", next);
                      }} />
                    </Field>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ── TESTIMONIALS ── */}
          {tab === "Testimonials" && (
            <Section title="Testimonials">
              {content.testimonials.map((t, i) => (
                <div key={i} className="mb-8 pb-8 border-b border-white/06 last:border-0">
                  <Field label={`Quote ${i + 1}`}>
                    <textarea className={FIELD} rows={3} value={t.quote} onChange={(e) => {
                      const next = content.testimonials.map((q, j) => j === i ? { ...q, quote: e.target.value } : q);
                      set("testimonials", next);
                    }} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Field label="Name">
                      <input className={FIELD} value={t.name} onChange={(e) => {
                        const next = content.testimonials.map((q, j) => j === i ? { ...q, name: e.target.value } : q);
                        set("testimonials", next);
                      }} />
                    </Field>
                    <Field label="Role">
                      <input className={FIELD} value={t.role} onChange={(e) => {
                        const next = content.testimonials.map((q, j) => j === i ? { ...q, role: e.target.value } : q);
                        set("testimonials", next);
                      }} />
                    </Field>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ── CONTACT ── */}
          {tab === "Contact" && (
            <Section title="Contact">
              <Field label="Headline">
                <input className={FIELD} value={content.contact.headline} onChange={(e) => set("contact.headline", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-6">
                <Field label="Email">
                  <input className={FIELD} value={content.contact.email} onChange={(e) => set("contact.email", e.target.value)} />
                </Field>
                <Field label="Tagline">
                  <input className={FIELD} value={content.contact.tagline} onChange={(e) => set("contact.tagline", e.target.value)} />
                </Field>
              </div>
              <Divider label="Social Links" />
              {content.contact.socials.map((s, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 mb-4">
                  <Field label="Label (IG / TK / WA)">
                    <input className={FIELD} value={s.label} onChange={(e) => {
                      const next = content.contact.socials.map((sl, j) => j === i ? { ...sl, label: e.target.value } : sl);
                      set("contact.socials", next);
                    }} />
                  </Field>
                  <Field label="Full Name">
                    <input className={FIELD} value={s.full} onChange={(e) => {
                      const next = content.contact.socials.map((sl, j) => j === i ? { ...sl, full: e.target.value } : sl);
                      set("contact.socials", next);
                    }} />
                  </Field>
                  <Field label="URL">
                    <input className={FIELD} value={s.href} onChange={(e) => {
                      const next = content.contact.socials.map((sl, j) => j === i ? { ...sl, href: e.target.value } : sl);
                      set("contact.socials", next);
                    }} />
                  </Field>
                </div>
              ))}
            </Section>
          )}

        </main>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="font-playfair font-bold italic text-3xl text-white mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-6 max-w-3xl">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="text-[9px] tracking-[0.2em] text-white/30 uppercase"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <span className="h-px flex-1 bg-white/08" />
      <span
        className="text-[9px] tracking-[0.2em] text-white/20 uppercase"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {label}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Verify dashboard loads**

Log in at `/admin/login` with `popup2024`. Expected: dashboard with sidebar tabs, Hero tab active, editable fields populated with current content.

- [ ] **Step 3: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat: add admin dashboard with per-section editing UI"
```

---

## Task 7: Wire content props into all section components

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/sections/Hero.tsx`
- Modify: `components/sections/About.tsx`
- Modify: `components/sections/Services.tsx`
- Modify: `components/sections/Portfolio.tsx`
- Modify: `components/sections/Testimonials.tsx`
- Modify: `components/sections/Contact.tsx`

- [ ] **Step 1: Update `app/page.tsx` to read content and pass props**

```tsx
import { unstable_noStore as noStore } from 'next/cache'
import { getContent } from '@/lib/content'
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  noStore()
  const content = getContent()

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero content={content.hero} />
        <About content={content.about} />
        <Services services={content.services} />
        <Portfolio events={content.portfolio} />
        <Testimonials testimonials={content.testimonials} />
        <Contact content={content.contact} />
      </main>
      <footer className="bg-[#0A0A0A] border-t border-white/[0.06] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-playfair font-bold italic text-2xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            PopUp
          </span>
          <p className="text-[10px] tracking-[0.2em] text-white/25 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
            © {new Date().getFullYear()} PopUp Events. All rights reserved.
          </p>
          <p className="text-[10px] tracking-[0.15em] text-white/20 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
            The Art Behind The Night
          </p>
        </div>
      </footer>
    </>
  );
}
```

- [ ] **Step 2: Update `Hero.tsx` — replace hardcoded strings with `content` prop**

At the top of the file, add the import and change the function signature:
```tsx
import type { HeroContent } from "@/lib/content";

export default function Hero({ content }: { content: HeroContent }) {
```

Replace `headlineLines` array mapping:
```tsx
// was: const headlineLines = ["THE ART", "BEHIND", "THE NIGHT"]
// now: use content.lines directly in the JSX map
{content.lines.map((line, i) => ( ... ))}
```

Replace descriptor text:
```tsx
// was: PopUp is the intervener group behind the region&apos;s most precise...
{content.descriptor}
```

Replace CTA button labels:
```tsx
// ctaWork button
{content.ctaWork}
// ctaBook button
{content.ctaBook}
```

- [ ] **Step 3: Update `About.tsx` — replace hardcoded strings with `content` prop**

```tsx
import type { AboutContent } from "@/lib/content";

export default function About({ content }: { content: AboutContent }) {
```

Replace headline:
```tsx
// was: "Precision.", "Craft.", "Execution." on separate lines
{content.headlineLines.map((line, i) => (
  <span key={i}>{line}{i < content.headlineLines.length - 1 && <br />}</span>
))}
```

Replace paragraphs:
```tsx
<p>{content.body1}</p>
<p>{content.body2}</p>
<p className="text-white font-medium">{content.tagline}</p>
```

Replace founded label:
```tsx
{content.founded}
```

Replace stats array:
```tsx
// was: const stats = [...]
// now: use content.stats directly
{content.stats.map((stat, i) => ( ... ))}
```

- [ ] **Step 4: Update `Services.tsx` — replace hardcoded array with prop**

```tsx
import type { ServiceItem } from "@/lib/content";

export default function Services({ services }: { services: ServiceItem[] }) {
  // Remove the hardcoded `const services = [...]`
  // Use `services` prop directly in the grid map
}
```

- [ ] **Step 5: Update `Portfolio.tsx` — replace hardcoded events with prop**

```tsx
import type { EventItem } from "@/lib/content";

export default function Portfolio({ events }: { events: EventItem[] }) {
  // Remove the hardcoded `const events = [...]`
  // Use `events` prop directly
  // Update filter logic: filtered = activeFilter === "All" ? events : events.filter(...)
}
```

- [ ] **Step 6: Update `Testimonials.tsx` — replace hardcoded array with prop**

```tsx
import type { TestimonialItem } from "@/lib/content";

export default function Testimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  // Remove hardcoded const testimonials = [...]
  // Use prop directly
}
```

- [ ] **Step 7: Update `Contact.tsx` — replace hardcoded strings with content prop**

```tsx
import type { ContactContent } from "@/lib/content";

export default function Contact({ content }: { content: ContactContent }) {
  // Replace headline, email, tagline, socials with content.*
}
```

- [ ] **Step 8: Build to verify no type errors**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no type errors.

- [ ] **Step 9: Commit**

```bash
git add app/page.tsx components/sections/
git commit -m "feat: wire content.json props into all section components"
```

---

## Task 8: End-to-end test — edit and see changes live

No automated test here — this is a manual integration check.

- [ ] **Step 1: Start dev server**
```bash
npm run dev
```

- [ ] **Step 2: Change Hero headline via admin**

1. Go to `http://localhost:3000/admin/login` → log in
2. Go to Hero tab → change Line 1 from `THE ART` to `THE CRAFT`
3. Click **Save Changes** → see "Saved ✓"
4. Open `http://localhost:3000` in a new tab → headline should now read `THE CRAFT`

- [ ] **Step 3: Verify content.json was updated**

```bash
cat content/site.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['hero']['lines'][0])"
```

Expected: `THE CRAFT`

- [ ] **Step 4: Restore original value**

Change Line 1 back to `THE ART` in admin and save.

- [ ] **Step 5: Commit and push**

```bash
git add content/site.json  # if changed during testing
git push
```

---

## Self-Review

**Spec coverage:**
- ✅ Password-protected `/admin` route — Task 2 + 4
- ✅ Edit hero headlines, descriptor, CTAs — Task 6 + 7
- ✅ Edit about copy, stats — Task 6 + 7
- ✅ Edit all 6 services — Task 6 + 7
- ✅ Edit portfolio events (name, city, year, type, image URL) — Task 6 + 7
- ✅ Edit testimonials (quote, name, role) — Task 6 + 7
- ✅ Edit contact (headline, email, tagline, socials) — Task 6 + 7
- ✅ Changes persist to JSON and reflect on site — Task 3 (`revalidatePath`) + Task 8
- ✅ Logout — Task 6 (logout button → DELETE /api/auth)

**Placeholder scan:** No TBDs, no "implement later", all code blocks present.

**Type consistency:** `HeroContent`, `AboutContent`, `ServiceItem`, `EventItem`, `TestimonialItem`, `ContactContent`, `SocialItem`, `StatItem` — all defined in Task 1 `lib/content.ts` and used consistently in Tasks 6 and 7.
