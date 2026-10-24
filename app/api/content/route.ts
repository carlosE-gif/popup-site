import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getContent, isSiteContent, writeContent } from '@/lib/content'

function isAuthed(): boolean {
  const secret = process.env.ADMIN_SECRET
  return Boolean(secret) && cookies().get('popup_admin')?.value === secret
}

export async function GET() {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json(await getContent())
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Could not load content' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await req.json().catch(() => null)
  if (!isSiteContent(body)) {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 })
  }

  try {
    await writeContent(body)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Could not save content' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
