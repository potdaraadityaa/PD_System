import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { createUserSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const stmt = db.prepare('SELECT id, username, role, created_at FROM users');
        const users = stmt.all();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Zod Validation
        const validation = createUserSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { username, role } = validation.data;

        // Default password for new users (In prod, send email invite)
        const defaultPassword = 'password123';
        const passwordHash = bcrypt.hashSync(defaultPassword, 10);

        const stmt = db.prepare('INSERT INTO users (username, role, password_hash) VALUES (?, ?, ?)');

        try {
            const info = stmt.run(username, role, passwordHash);

            db.prepare('INSERT INTO audit_logs (action, subject, resource, decision) VALUES (?, ?, ?, ?)').run(
                'CREATE_USER', 'system', username, 'ALLOW'
            );

            return NextResponse.json({ success: true, id: info.lastInsertRowid });
        } catch (dbError) {
            if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
            }
            throw dbError;
        }
    } catch (error) {
        console.error('Create User Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
