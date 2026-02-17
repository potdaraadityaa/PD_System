import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';

export async function GET() {
    const session = await AuthService.getSession();

    if (!session) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
        authenticated: true,
        user: session
    });
}
