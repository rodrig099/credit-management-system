import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  // Si no hay token y está intentando acceder a rutas protegidas
  if (!token && (path.startsWith('/admin') || path.startsWith('/cliente'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Si es admin intentando acceder a rutas de cliente
  if (token?.rol === 'admin' && path.startsWith('/cliente')) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // Si es cliente intentando acceder a rutas de admin
  if (token?.rol === 'cliente' && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/cliente/dashboard', req.url));
  }

  // Si está logueado e intenta ir a /login, redirigir según rol
  if (token && path === '/login') {
    if (token.rol === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/cliente/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/cliente/:path*',
    '/login',
    '/api/clientes/:path*',
    '/api/creditos/:path*',
    '/api/pagos/:path*',
  ],
};
