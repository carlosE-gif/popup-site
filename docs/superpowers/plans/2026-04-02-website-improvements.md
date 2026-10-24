# Website Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all broken/missing features on the PopUp website: contact form submission, cloud image storage, SEO metadata, mobile cursor, and page loading state.

**Architecture:** Five independent tasks that can be executed in parallel by separate agents, each touching a different area of the codebase. No shared state or cross-task dependencies.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Resend (email), Cloudinary (image storage), Framer Motion

---

## ⚠️ Before Starting: Environment Variables

The following env vars must be present in `.env.local` before tasks 1 and 2 can be tested:

```env
# Task 1 — Resend
RESEND_API_KEY=your_resend_api_key_here

# Task 2 — Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get Resend API key at resend.com (free tier: 3,000 emails/month).
Get Cloudinary credentials at cloudinary.com (free tier: 25GB storage).

---

## File Map

| File | Action | Task |
|------|--------|------|
| `app/api/contact/route.ts` | Create | 1 |
| `components/sections/Contact.tsx` | Modify | 1 |
| `app/api/upload/route.ts` | Modify | 2 |
| `app/layout.tsx` | Modify | 3 |
| `public/og-image.jpg` | Note: user must add | 3 |
| `components/Cursor.tsx` | Modify | 4 |
| `app/loading.tsx` | Create | 5 |

---

## Task 1: Contact Form — Resend Integration + Validation

**Files:**
- Create: `app/api/contact/route.ts`
- Modify: `components/sections/Contact.tsx`

- [ ] **Step 1: Install resend**

```bash
cd popup-site && npm install resend
```

Expected: `resend` added to `package.json` dependencies.

- [ ] **Step 2: Create the contact API route**

Create `app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, eventType, date, budget, message } = body

  if (!name?.trim() || !eventType?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'Name, event type, and message are required.' },
      { status: 400 }
    )
  }

  const { error } = await resend.emails.send({
    from: 'PopUp Website <onboarding@resend.dev>',
    to: ['hello@popup.events'],
    subject: `New Inquiry — ${eventType} from ${name}`,
    html: `
      <h2 style="font-family:sans-serif">New Event Inquiry</h2>
      <table style="font-family:sans-serif;border-collapse:collapse">
        <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Event Type</td><td style="padding:8px">${eventType}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Date</td><td style="padding:8px">${date || 'Not specified'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Budget</td><td style="padding:8px">${budget || 'Not specified'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${message}</td></tr>
      </table>
    `,
  })

  if (error) {
    console.error('[contact] Resend error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: Update Contact.tsx with validation + submission + UI states**

Replace the entire `components/sections/Contact.tsx` with the following (keep all existing JSX/styling — only change the state management and form logic at the top):

Add these state variables after the existing `formData` state:

```typescript
const [errors, setErrors] = useState<Partial<typeof formData>>({})
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
const [serverError, setServerError] = useState('')
```

Replace the `handleSubmit` function (currently empty) with:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Client-side validation
  const newErrors: Partial<typeof formData> = {}
  if (!formData.name.trim()) newErrors.name = 'Name is required'
  if (!formData.eventType) newErrors.eventType = 'Please select an event type'
  if (!formData.message.trim()) newErrors.message = 'Message is required'

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  setErrors({})
  setStatus('loading')
  setServerError('')

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const data = await res.json()

    if (!res.ok) {
      setStatus('error')
      setServerError(data.error || 'Something went wrong.')
      return
    }

    setStatus('success')
    setFormData({ name: '', eventType: '', date: '', budget: '', message: '' })
  } catch {
    setStatus('error')
    setServerError('Network error. Please try again.')
  }
}
```

After each input/select/textarea that has a required field, add an error message span. Example for the name field — add immediately after the `<input>` closing tag:

```tsx
{errors.name && (
  <span className="font-mono text-[9px] tracking-[0.1em] text-red-400 uppercase mt-1">
    {errors.name}
  </span>
)}
```

Do the same for `eventType` and `message`.

Replace the submit `<button>` with:

```tsx
<button
  type="submit"
  disabled={status === 'loading' || status === 'success'}
  className="group self-start font-mono text-[11px] tracking-[0.2em] uppercase px-10 py-4 bg-white text-[#0A0A0A] hover:bg-white/85 transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
  style={{ fontFamily: "var(--font-space-mono)" }}
>
  {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent ✓' : 'Send It'}
</button>
```

Add success/error messages after the button:

```tsx
{status === 'success' && (
  <p className="font-mono text-[10px] tracking-[0.15em] text-white/60 uppercase">
    We'll be in touch soon.
  </p>
)}
{status === 'error' && (
  <p className="font-mono text-[10px] tracking-[0.15em] text-red-400 uppercase">
    {serverError}
  </p>
)}
```

- [ ] **Step 4: Verify manually**

Start the dev server: `npm run dev`

1. Open http://localhost:3000/#contact
2. Try submitting empty form → should see red error messages under Name, Event Type, Message
3. Fill in all required fields → should see "Sending..." then "Sent ✓" or server error if API key not set
4. To test the API directly:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","eventType":"Club Night","message":"Hello"}'
```
Expected with no API key: `{"error":"Failed to send message. Please try again."}`
Expected with valid API key: `{"success":true}`

- [ ] **Step 5: Commit**

```bash
git add app/api/contact/route.ts components/sections/Contact.tsx package.json package-lock.json
git commit -m "feat: add contact form submission via Resend with client-side validation"
```

---

## Task 2: Cloud Image Storage — Cloudinary

**Files:**
- Modify: `app/api/upload/route.ts`

- [ ] **Step 1: Install cloudinary**

```bash
cd popup-site && npm install cloudinary
```

- [ ] **Step 2: Replace local filesystem upload with Cloudinary**

Replace the entire content of `app/api/upload/route.ts` with:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function isAuthed(): boolean {
  const session = cookies().get('popup_admin')?.value
  return session === process.env.ADMIN_SECRET
}

export async function POST(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPG, PNG, WebP, GIF allowed.' },
      { status: 400 }
    )
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'popup/portfolio',
      resource_type: 'image',
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    console.error('[upload] Cloudinary error:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Verify manually**

1. Log into admin panel at http://localhost:3000/admin
2. Go to Portfolio tab
3. Upload an image via drag-and-drop
4. Confirm the returned URL is a `res.cloudinary.com` URL (not `/uploads/...`)
5. Confirm the image displays correctly in the portfolio grid

- [ ] **Step 4: Commit**

```bash
git add app/api/upload/route.ts package.json package-lock.json
git commit -m "feat: replace local image storage with Cloudinary"
```

---

## Task 3: SEO Metadata — Open Graph + Twitter Cards

**Files:**
- Modify: `app/layout.tsx`

**Note:** For the OG image to work, add a 1200×630px image at `public/og-image.jpg`. This can be a branded screenshot of the hero section or a custom graphic. If you don't have one yet, skip the image fields for now.

- [ ] **Step 1: Update layout.tsx metadata**

Replace the `metadata` export in `app/layout.tsx` (lines 24–33) with:

```typescript
export const metadata: Metadata = {
  title: "PopUp — The Art Behind The Night",
  description:
    "PopUp is the intervener group behind the region's most precise, unforgettable club nights, private parties, and brand events.",
  metadataBase: new URL("https://popup.events"),
  openGraph: {
    title: "PopUp — The Art Behind The Night",
    description:
      "PopUp is the intervener group behind the region's most precise, unforgettable club nights, private parties, and brand events.",
    url: "https://popup.events",
    siteName: "PopUp",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PopUp — The Art Behind The Night",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PopUp — The Art Behind The Night",
    description:
      "PopUp is the intervener group behind the region's most precise, unforgettable club nights, private parties, and brand events.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

- [ ] **Step 2: Verify**

```bash
npm run build
```

Expected: Build succeeds with no errors. Check the generated HTML for OG tags:

```bash
curl -s http://localhost:3000 | grep -i "og:"
```

Expected output includes lines like:
```
<meta property="og:title" content="PopUp — The Art Behind The Night"/>
<meta property="og:image" content="https://popup.events/og-image.jpg"/>
<meta name="twitter:card" content="summary_large_image"/>
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add full Open Graph and Twitter card metadata"
```

---

## Task 4: Mobile — Hide Custom Cursor on Touch Devices

**Files:**
- Modify: `components/Cursor.tsx`

The custom 12-dot cursor uses `mousemove` events which don't fire on touch screens. On mobile, the cursor dots render off-screen at `(-200, -200)` but the RAF loop still runs, wasting battery. We need to detect touch devices and skip rendering entirely.

- [ ] **Step 1: Add touch detection to Cursor.tsx**

Add `isTouch` state after the existing state declarations (after line 16 `const [onDark, setOnDark] = useState(false)`):

```typescript
const [isTouch, setIsTouch] = useState(false)
```

Add a new `useEffect` after the existing state declarations, before the `animate` callback (insert after line 23):

```typescript
useEffect(() => {
  setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches)
}, [])
```

Add an early return before the existing `useEffect` that adds the cursor class (before line 53). Insert this block right before `useEffect(() => { document.body.classList.add(...)`:

```typescript
if (isTouch) return null
```

Wait — `isTouch` is state and hooks can't be conditionally called. The correct approach is to return null from the JSX instead. Replace the `return (` block at line 113 with:

```tsx
if (isTouch) return null

return (
  <>
    {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
      // ... existing JSX unchanged
    })}
  </>
)
```

Also update the two `useEffect`s to guard against touch devices. In the first `useEffect` (line 53), wrap the body:

```typescript
useEffect(() => {
  if (isTouch) return
  document.body.classList.add("custom-cursor")
  rafRef.current = requestAnimationFrame(animate)
  return () => {
    document.body.classList.remove("custom-cursor")
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }
}, [animate, isTouch])
```

In the second `useEffect` (line 62), wrap similarly:

```typescript
useEffect(() => {
  if (isTouch) return
  // ... rest of the handler unchanged
}, [isTouch])
```

- [ ] **Step 2: Verify**

Open http://localhost:3000 in Chrome DevTools → toggle device toolbar (mobile view).

Expected: cursor dots are not visible, no RAF running, page renders normally.

Open in desktop → cursor dots appear and trail the mouse as before.

- [ ] **Step 3: Commit**

```bash
git add components/Cursor.tsx
git commit -m "fix: hide custom cursor on touch/mobile devices"
```

---

## Task 5: Page Loading State

**Files:**
- Create: `app/loading.tsx`

Next.js 14 automatically shows `app/loading.tsx` as a React Suspense fallback while the page loads.

- [ ] **Step 1: Create app/loading.tsx**

```typescript
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <p
        className="font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase animate-pulse"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        Loading
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Throttle your network in Chrome DevTools (Slow 3G) and navigate to http://localhost:3000.

Expected: Black screen with faint pulsing "LOADING" text appears briefly before the site loads.

- [ ] **Step 3: Commit**

```bash
git add app/loading.tsx
git commit -m "feat: add loading state screen for page transitions"
```

---

## Task 6: Social Links (User Action — No Code Change Needed)

The admin CMS already supports editing social links. The Instagram link is correctly set. TikTok and WhatsApp are `"#"` placeholders.

**To update:**
1. Go to http://localhost:3000/admin
2. Navigate to the **Contact** tab
3. Update the `href` for TikTok and WhatsApp with the real URLs
4. Click Save

WhatsApp links use the format: `https://wa.me/PHONENUMBER` (e.g. `https://wa.me/9611234567`)

---

## Verification Checklist (run after all tasks)

```bash
npm run build
npm run start
```

- [ ] Contact form: submitting with empty required fields shows red error messages
- [ ] Contact form: successful submission shows "Sent ✓" and clears the form
- [ ] Admin image upload: uploaded images return a `res.cloudinary.com` URL
- [ ] SEO: `curl http://localhost:3000 | grep og:` returns OG meta tags
- [ ] Mobile (DevTools device toggle): custom cursor dots are hidden
- [ ] Page load (throttled network): loading screen appears briefly
- [ ] Build: `npm run build` completes with no errors
