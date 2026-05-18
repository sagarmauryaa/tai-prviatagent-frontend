import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const cookieStore = await cookies();
	const token = cookieStore.get('access_token')?.value ?? '';
	const isActiveSubs = cookieStore.get('is_subscription_active')?.value ?? '';

	const signInPath = '/auth/sign-in';
	const setPasswordPath = '/auth/set-password';
	const ssoLoginPath = '/auth/sso-login';

	// Allow access to SSO login page without token
	if (pathname.startsWith(ssoLoginPath)) {
		return NextResponse.next();
	}

	if (pathname.startsWith('/try-it-now')) {
		return NextResponse.next();
	}

	if (!token && (pathname.startsWith('/auth/reset-password') || pathname.startsWith('/auth/forgot-password'))) {
		return NextResponse.next();
	}

	// 1. If no token and not on sign-in or set-password, redirect to sign-in
	if (!token && pathname !== signInPath && pathname !== setPasswordPath) {
		return NextResponse.redirect(new URL(signInPath, req.url));
	}

	// 2. If token exists but user is on set-password page, force logout and redirect to sign-in
	if (token && pathname === setPasswordPath) {
		const response = NextResponse.next();
		response.cookies.set('access_token', '', { maxAge: 0 });
		response.cookies.set('is_subscription_active', '', { maxAge: 0 });
		return response;
	}

	// 3. If token exists and user tries to access /auth pages, redirect to dashboard
	if (token && pathname.startsWith('/auth') && pathname !== setPasswordPath) {
		return NextResponse.redirect(new URL('/dashboard', req.url));
	} 

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|images|public).*)",
	],
};
