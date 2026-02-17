import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';

export async function POST() {
    await AuthService.clearCookies();
    return NextResponse.json({ success: true });
}
