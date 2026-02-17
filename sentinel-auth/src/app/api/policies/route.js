import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { createPolicySchema } from '@/lib/validations';

export async function GET() {
    try {
        const stmt = db.prepare('SELECT * FROM policies ORDER BY created_at DESC');
        const policies = stmt.all();
        return NextResponse.json(policies);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Zod Validation
        const validation = createPolicySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { name, description, effect, action_pattern, resource_pattern } = validation.data;
        const conditions = body.conditions ? JSON.stringify(body.conditions) : null;

        const stmt = db.prepare(`
        INSERT INTO policies (name, description, effect, action_pattern, resource_pattern, conditions, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

        const info = stmt.run(name, description || '', effect, action_pattern, resource_pattern, conditions);

        db.prepare('INSERT INTO audit_logs (action, subject, resource, decision) VALUES (?, ?, ?, ?)').run(
            'CREATE_POLICY', 'system', name, 'ALLOW'
        );

        return NextResponse.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
        console.error('Create Policy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
