import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SECRET
  if (!expected || !secret) {
    console.error('ADMIN_PASSWORD or ADMIN_SECRET is not set')
    return NextResponse.json({ error: 'Admin login is not configured' }, { status: 500 })
  }

  const body = await req.json().catch(() => null)
  if (typeof body?.password !== 'string' || body.password !== expected) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  cookies().set('popup_admin', secret, {
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
