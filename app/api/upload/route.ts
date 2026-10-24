import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'
import { blobEnabled } from '@/lib/content'

// ponytail: Vercel rejects function request bodies over 4.5MB; switch to @vercel/blob/client uploads if bigger files are needed
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

function isAuthed(): boolean {
  const session = cookies().get('popup_admin')?.value
  return session === process.env.ADMIN_SECRET
}

async function saveLocally(filename: string, file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  fs.mkdirSync(uploadDir, { recursive: true })
  fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))
  return `/uploads/${filename}`
}

export async function POST(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!VALID_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WebP, GIF allowed.' }, { status: 400 })
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'File too large. Max 4MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `portfolio-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  try {
    const url = blobEnabled()
      ? (await put(`uploads/${filename}`, file, { access: 'public', contentType: file.type })).url
      : await saveLocally(filename, file)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Upload failed:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
