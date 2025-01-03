import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Array com rotas públicas que redirecionam para /app se autenticado
  const redirectPublicPaths = ["/login", "/register", "/reset-password"]

  // Array com rotas públicas que não redirecionam
  const noRedirectPublicPaths = ["/"]

  const path = request.nextUrl.pathname

  const isRedirectPublicPath = redirectPublicPaths.includes(path)
  const isNoRedirectPublicPath = noRedirectPublicPaths.includes(path)

  // Redireciona usuários autenticados em páginas públicas que exigem redirecionamento
  if (isAuthenticated && isRedirectPublicPath) {
    return NextResponse.redirect(new URL("/app", request.url))
  }

  // Permite acesso às páginas públicas sem redirecionamento
  if (isNoRedirectPublicPath) {
    return NextResponse.next()
  }

  // Redireciona usuários não autenticados para login
  if (!isAuthenticated && !isRedirectPublicPath && !isNoRedirectPublicPath) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
