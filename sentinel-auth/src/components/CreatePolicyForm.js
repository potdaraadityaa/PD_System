'use client';

import { useActionState } from 'react';
import { createPolicy } from '../app/actions';

const initialState = {
    message: null,
    error: null,
};

async function actionWrapper(prevState, formData) {
    const result = await createPolicy(formData);
    if (result?.error) {
        return { error: result.error, message: null };
    }
    return { error: null, message: 'Policy created successfully!' };
}

export default function CreatePolicyForm() {
    const [state, formAction, isPending] = useActionState(actionWrapper, initialState);

    return (
        <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add Policy</h3>
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Policy Name</label>
                    <input name="name" type="text" required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'black' }}
                        placeholder="e.g. Finance Admin"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Effect</label>
                    <select name="effect" required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'black' }}
                    >
                        <option value="ALLOW">ALLOW</option>
                        <option value="DENY">DENY</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Action Pattern</label>
                    <input name="action" type="text" required defaultValue="*"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'black' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Resource Pattern</label>
                    <input name="resource" type="text" required defaultValue="*"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'black' }}
                    />
                </div>

                {state.error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{state.error}</p>}
                {state.message && <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>{state.message}</p>}

                <button type="submit" disabled={isPending} className="btn btn-primary">
                    {isPending ? 'Creating...' : 'Create Policy'}
                </button>
            </form>
        </div>
    );
}
