'use client';

import { useActionState } from 'react';
import { createUser } from '../app/actions';

const initialState = {
    message: null,
    error: null,
};

// Wrapper around the server action to adapt to useActionState signature if needed
// Or modify action to return state.
// Let's assume action returns { error: string } or { success: true }
async function actionWrapper(prevState, formData) {
    const result = await createUser(formData);
    if (result?.error) {
        return { error: result.error, message: null };
    }
    return { error: null, message: 'User created successfully!' };
}

export default function CreateUserForm() {
    const [state, formAction, isPending] = useActionState(actionWrapper, initialState);

    return (
        <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New User</h3>
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Username</label>
                    <input name="username" type="text" required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'black' }}
                        placeholder="e.g. john_doe"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Role</label>
                    <select name="role" required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'black' }}
                    >
                        <option value="guest">guest</option>
                        <option value="editor">editor</option>
                        <option value="admin">admin</option>
                        <option value="finance">finance</option>
                    </select>
                </div>

                {state.error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{state.error}</p>}
                {state.message && <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>{state.message}</p>}

                <button type="submit" disabled={isPending} className="btn btn-primary">
                    {isPending ? 'Creating...' : 'Create User'}
                </button>
            </form>
        </div>
    );
}
