'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createUser(formData) {
    console.log('[ACTION] createUser called');
    const username = formData.get('username');
    const role = formData.get('role');
    console.log('[ACTION] Payload:', { username, role });

    try {
        const stmt = db.prepare('INSERT INTO users (username, role) VALUES (?, ?)');
        stmt.run(username, role);
        revalidatePath('/users');
        console.log('[ACTION] createUser success');
        return { success: true };
    } catch (e) {
        console.error('[ACTION] createUser error:', e);
        return { error: 'Failed to create user. Username might be taken.' };
    }
}

export async function deleteUser(formData) {
    console.log('[ACTION] deleteUser called');
    const id = formData.get('id');
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    revalidatePath('/users');
    console.log('[ACTION] deleteUser success');
}

export async function togglePolicy(formData) {
    console.log('[ACTION] togglePolicy called');
    const id = formData.get('id');
    const isActive = formData.get('is_active') === 'true';
    const newState = isActive ? 0 : 1;

    db.prepare('UPDATE policies SET is_active = ? WHERE id = ?').run(newState, id);
    revalidatePath('/policies');
    revalidatePath('/'); // Update dashboard stats
}

export async function deletePolicy(formData) {
    console.log('[ACTION] deletePolicy called');
    const id = formData.get('id');
    db.prepare('DELETE FROM policies WHERE id = ?').run(id);
    revalidatePath('/policies');
    revalidatePath('/');
}

// Simple policy creation for now. Advanced editor will need more complex handling.
export async function createPolicy(formData) {
    const name = formData.get('name');
    const effect = formData.get('effect');
    const action = formData.get('action');
    const resource = formData.get('resource');
    // Default condition: true (empty json or specific format)
    // For MVP we won't parse complex JSON from form yet, just basic.

    try {
        const stmt = db.prepare(`
            INSERT INTO policies (name, description, effect, action_pattern, resource_pattern, conditions, is_active)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `);
        stmt.run(name, 'Created via dashboard', effect, action, resource, JSON.stringify(null));
        revalidatePath('/policies');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}
