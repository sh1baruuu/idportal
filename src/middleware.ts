import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
    const authToken = request.cookies.get("firebaseToken")?.value;

    const currentUrl = new URL(request.url);

    // Prevent redirect loop and unnecessary redirection
    if ((authToken && currentUrl.pathname === '/dashboard') || (!authToken && currentUrl.pathname === '/signin')) {
        return NextResponse.next();
    }

    // Prevent authenticated users from accessing the signin page
    if (authToken && currentUrl.pathname === '/signin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users to the signin page
    if (!authToken && currentUrl.pathname !== '/signin') {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Redirect authenticated users from the root to the dashboard
    if (authToken && currentUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/signin', '/dashboard']
}
