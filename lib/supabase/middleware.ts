import { createServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: CookieOptions }) =>
            supabaseResponse.cookies.set(name, value, options as Record<string, string>),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /backend routes - redirect to login if not authenticated
  if (
    request.nextUrl.pathname.startsWith('/backend') &&
    !request.nextUrl.pathname.startsWith('/backend/login') &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/backend/login'
    return NextResponse.redirect(url)
  }

  // If logged in and visiting login page, redirect to backend
  if (
    request.nextUrl.pathname === '/backend/login' &&
    user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/backend'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
