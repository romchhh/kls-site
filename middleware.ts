import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/translations';
import { addSecurityHeaders, checkAdminIPWhitelist, logSecurityEvent, verifyCSRF } from './lib/security';
import { apiRateLimit, authRateLimit, adminRateLimit } from './lib/rate-limit';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Apply security headers to all responses
  let response = NextResponse.next();
  response = addSecurityHeaders(response);
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api')) {
    // CSRF protection for state-changing methods
    const method = request.method;
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      // Skip CSRF for NextAuth endpoints and public API endpoints
      if (!pathname.startsWith('/api/auth') && !pathname.startsWith('/api/public')) {
        const csrfValid = verifyCSRF(request);
        if (!csrfValid) {
          await logSecurityEvent('CSRF_ATTEMPT', { pathname, method }, request);
          return NextResponse.json(
            { error: 'CSRF token validation failed' },
            { status: 403 }
          );
        }
      }
    }
    
    // Auth endpoints - stricter rate limit
    if (pathname.startsWith('/api/auth') || pathname.includes('/login')) {
      const authLimitResult = await authRateLimit(request);
      if (authLimitResult) {
        await logSecurityEvent('RATE_LIMIT_EXCEEDED', { pathname }, request);
        return authLimitResult;
      }
    }
    
    // Admin API endpoints
    if (pathname.startsWith('/api/admin')) {
      // Check IP whitelist for admin routes (if configured)
      const ipAllowed = await checkAdminIPWhitelist(request);
      if (!ipAllowed) {
        const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
        await logSecurityEvent('UNAUTHORIZED_IP_ACCESS', { pathname, ip: clientIp }, request);
        return NextResponse.json(
          { error: 'Access denied from this IP address' },
          { status: 403 }
        );
      }
      
      const adminLimitResult = await adminRateLimit(request);
      if (adminLimitResult) {
        await logSecurityEvent('ADMIN_RATE_LIMIT_EXCEEDED', { pathname }, request);
        return adminLimitResult;
      }
    }
    
    // General API rate limiting
    const apiLimitResult = await apiRateLimit(request);
    if (apiLimitResult) {
      return apiLimitResult;
    }
  }
  
  // Admin panel IP whitelist check
  if (pathname.startsWith('/admin')) {
    const ipAllowed = await checkAdminIPWhitelist(request);
    if (!ipAllowed) {
      const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
      await logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS', { pathname, ip: clientIp }, request);
      return NextResponse.redirect(new URL('/admin/login?error=ip_restricted', request.url));
    }
  }
  
  // Skip locale handling for admin routes, API routes, and static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return response;
  }
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return response;
  }

  const locale = defaultLocale;
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4)$).*)',
  ],
};

