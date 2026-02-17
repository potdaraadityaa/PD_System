'use client';

import { useState } from 'react';

export default function SimulatorPage() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        const formData = new FormData(e.target);
        const payload = {
            subject: { role: formData.get('role') },
            action: formData.get('action'),
            resource: formData.get('resource')
        };

        try {
            const res = await fetch('/api/authorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            setResult({ error: 'Failed to fetch decision' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Policy Simulator</h1>
                <p style={{ color: '#94a3b8' }}>Test authorization requests against active policies</p>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Input Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Simulate Request</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Subject Role</label>
                            <select name="role" required className="btn"
                                style={{ width: '100%', justifyContent: 'flex-start', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155' }}
                            >
                                <option value="guest">guest</option>
                                <option value="editor">editor</option>
                                <option value="admin">admin</option>
                                <option value="finance">finance</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Action</label>
                            <input name="action" type="text" required placeholder="e.g. refund.approve"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Resource</label>
                            <input name="resource" type="text" required placeholder="e.g. finance"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', color: 'white' }}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            {loading ? 'Evaluating...' : 'Check Permission'}
                        </button>
                    </form>
                </div>

                {/* Result */}
                <div>
                    {result && (
                        <div className="card" style={{
                            border: `1px solid ${result.decision === 'ALLOW' ? 'var(--success)' : 'var(--danger)'}`,
                            height: '100%'
                        }}>
                            <h3 style={{ marginBottom: '1rem', color: '#94a3b8' }}>Decision Result</h3>

                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{
                                    fontSize: '3rem',
                                    fontWeight: 'bold',
                                    color: result.decision === 'ALLOW' ? 'var(--success)' : 'var(--danger)'
                                }}>
                                    {result.decision}
                                </div>
                                <p style={{ color: '#94a3b8' }}>{result.reason}</p>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '4px' }}>
                                <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' }}>Debug Info</h4>
                                <pre style={{ fontSize: '0.75rem', overflowX: 'auto' }}>
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {!result && (
                        <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            Waiting for input...
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
