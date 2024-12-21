import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname
  const isAuthenticated = request.cookies.has('auth')

  // Ana sayfa yönlendirmesi
  if (url === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Dashboard erişim kontrolü
  if (url.includes('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/401', request.url))
    }
  }

  // Login sayfası kontrolü - eğer zaten giriş yapmışsa
  if (url.includes('/auth/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard/logs', request.url))
  }

  // İzin verilen path'ler kontrolü
  const allowedPaths = ['/', '/auth/login', '/dashboard/logs', '/401']
  if (!allowedPaths.includes(url) && !url.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/404', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}