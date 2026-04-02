import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
