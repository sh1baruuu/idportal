import { NextRequest, NextResponse } from 'next/server';

export const middleware = (request: NextRequest) => {
    const authToken = request.cookies.get('firebaseToken')?.value;
    const currentUrl = new URL(request.url);
    const { pathname } = currentUrl;

    // Authenticated users
    if (authToken) {
        // Prevent access to login page
        if (pathname === '/login') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Redirect from root to dashboard
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Allow access to dashboard and API paths
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
            return NextResponse.next();
        }
    } else {
        // Unauthenticated users

        // Redirect from root to dashboard
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Redirect from protected paths to login
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // Allow access to login page
        if (pathname === '/login') {
            return NextResponse.next();
        }
    }

    // Allow access to all other paths
    return NextResponse.next();
};

export const config = {
    matcher: ['/', '/login', '/dashboard/:path*', '/api/:path*'],
};
