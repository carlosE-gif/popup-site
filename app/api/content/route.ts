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
