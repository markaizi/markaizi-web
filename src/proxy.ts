import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * /musteri/** rotalarını korur.
 * - /musteri/giris → serbest
 * - Geçersiz/eksik oturum → /musteri/giris'e yönlendir
 * - /musteri/admin/** → yalnızca ADMIN
 *
 * İnce kapsam (hangi firma) her zaman server component/route içinde
 * ayrıca enforce edilir; proxy yalnızca kaba kapıdır.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Giriş sayfası serbest
  if (pathname === "/musteri/giris") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/musteri/giris";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Admin alanı yalnızca ADMIN
  if (pathname.startsWith("/musteri/admin") && session.role !== "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = session.slug ? `/musteri/${session.slug}` : "/musteri/giris";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/musteri/:path*"],
};
