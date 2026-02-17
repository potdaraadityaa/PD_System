import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { AuthService } from '@/lib/auth-service';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Find User
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(username);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify Password
        const isValid = await AuthService.verifyPassword(password, user.password_hash);

        if (!isValid) {
            db.prepare('INSERT INTO audit_logs (action, subject, decision, reason) VALUES (?, ?, ?, ?)').run(
                'LOGIN_ATTEMPT', username, 'DENY', 'Invalid password'
            );
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Set Cookies
        await AuthService.setAuthCookies(user);

        db.prepare('INSERT INTO audit_logs (action, subject, decision, reason) VALUES (?, ?, ?, ?)').run(
            'LOGIN', username, 'ALLOW', 'Credentials verified'
        );

        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
