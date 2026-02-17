import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'super-secret-default-key-change-in-prod'
);

// Simple in-memory rate limiter (Note: specific to each lambda instance)
const rateLimitMap = new Map();

function isRateLimited(ip) {
    const LIMIT = 100; // requests
    const WINDOW = 60 * 1000; // 1 minute
    const now = Date.now();

    const record = rateLimitMap.get(ip) || { count: 0, startTime: now };

    if (now - record.startTime > WINDOW) {
        record.count = 1;
        record.startTime = now;
    } else {
        record.count++;
    }

    rateLimitMap.set(ip, record);
    return record.count > LIMIT;
}

export async function middleware(request) {
    // 1. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    // 2. Auth Guard
    const path = request.nextUrl.pathname;

    // Public Paths
    if (path.startsWith('/api/auth') || path === '/login' || path.startsWith('/_next') || path === '/favicon.ico') {
        return NextResponse.next();
    }

    // Check Token
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
        // API Request -> 401
        if (path.startsWith('/api')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Page Request -> Redirect to Login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jwtVerify(token, SECRET_KEY);
        return NextResponse.next();
    } catch (err) {
        // Token valid failed
        if (path.startsWith('/api')) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
