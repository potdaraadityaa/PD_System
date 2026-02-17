'use client';

import { useState } from 'react';
import { createUser } from '../actions';

export default function DebugPage() {
    const [count, setCount] = useState(0);
    const [actionResult, setActionResult] = useState('None');

    function handleClientClick() {
        console.log('Client click working');
        setCount(c => c + 1);
        alert('Client Interactivity is working!');
    }

    async function handleServerAction() {
        console.log('Triggering server action...');
        setActionResult('Pending...');
        try {
            // We pass a dummy FormData
            const formData = new FormData();
            formData.append('username', 'debug_user_' + Date.now());
            formData.append('role', 'guest');

            const result = await createUser(formData);
            console.log('Server action result:', result);
            setActionResult(result?.success ? 'Success' : 'Error: ' + result?.error);
        } catch (e) {
            console.error('Server action failed:', e);
            setActionResult('Exception: ' + e.message);
        }
    }

    return (
        <div style={{ padding: '2rem', background: 'white', color: 'black' }}>
            <h1>Debug Console</h1>

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
                <h2>1. Client Interactivity Test</h2>
                <p>Current Count: <strong>{count}</strong></p>
                <button
                    onClick={handleClientClick}
                    style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Test Client Click (Should Alert)
                </button>
            </div>

            <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
                <h2>2. Server Action Test</h2>
                <p>Result: <strong>{actionResult}</strong></p>
                <button
                    onClick={handleServerAction}
                    style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Test Server Action (Create Debug User)
                </button>
            </div>
        </div>
    );
}
